import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { AgendaView } from "./features/agenda/AgendaView";
import { NewLessonForm } from "./features/lessons/NewLessonForm";
import { MetricsView } from "./features/metrics/MetricsView";
import { SettingsView } from "./features/settings/SettingsView";
import { StudentForm } from "./features/students/StudentForm";
import { StudentsView } from "./features/students/StudentsView";
import { SubjectsView } from "./features/subjects/SubjectsView";
import {
  lessons as initialLessons,
  settings,
  students as initialStudents,
  subjects,
} from "./data/mockData";
import type { Lesson, NewLessonInput, NewStudentInput, Student } from "./types/schedule";
import { addMinutes, buildDateTime, formatDateInput } from "./utils/date";
import { createLessonFromInput, getLessonDurationMinutes, hasLessonOverlap } from "./utils/schedule";

export type AppView = "agenda" | "students" | "subjects" | "metrics" | "settings";

const STORAGE_KEY = "class-scheduler-state-v1";
const firstSubject = subjects[0];

type SavedAppState = {
  lessons: Lesson[];
  students: Student[];
};

type SidePanelMode = "lesson" | "student";

function loadSavedState(): SavedAppState {
  if (typeof window === "undefined") {
    return { lessons: initialLessons, students: initialStudents };
  }

  const savedState = window.localStorage.getItem(STORAGE_KEY);

  if (!savedState) {
    return { lessons: initialLessons, students: initialStudents };
  }

  try {
    const parsed = JSON.parse(savedState) as Partial<SavedAppState>;
    return {
      lessons: Array.isArray(parsed.lessons) ? parsed.lessons : initialLessons,
      students: Array.isArray(parsed.students) ? parsed.students : initialStudents,
    };
  } catch {
    return { lessons: initialLessons, students: initialStudents };
  }
}

function createInitialLessonForm(students: Student[]): NewLessonInput {
  return {
    studentId: students[0]?.id ?? "",
    subjectId: firstSubject.id,
    date: formatDateInput(new Date("2026-06-18T12:00:00")),
    startTime: "19:00",
    durationMinutes: firstSubject.defaultDurationMinutes,
    status: "scheduled",
    format: "online",
    topic: "Prog, aula",
    priceLabel: "65",
    isPaid: false,
    notes: "",
  };
}

function createLessonFormFromLesson(lesson: Lesson): NewLessonInput {
  const startsAt = new Date(lesson.startsAt);

  return {
    studentId: lesson.studentId,
    subjectId: lesson.subjectId,
    date: formatDateInput(startsAt),
    startTime: lesson.startsAt.slice(11, 16),
    durationMinutes: getLessonDurationMinutes(lesson),
    status: lesson.status,
    format: lesson.format,
    topic: lesson.topic,
    priceLabel: lesson.priceLabel,
    isPaid: lesson.isPaid,
    notes: lesson.notes,
  };
}

function createInitialStudentForm(): NewStudentInput {
  return {
    name: "",
    email: "",
    phone: "",
    notes: "",
  };
}

function createStudentId(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `student-${slug || Date.now()}`;
}

export function App() {
  const savedState = useMemo(loadSavedState, []);
  const [activeView, setActiveView] = useState<AppView>("agenda");
  const [studentList, setStudentList] = useState<Student[]>(savedState.students);
  const [lessonList, setLessonList] = useState<Lesson[]>(savedState.lessons);
  const [selectedWeek, setSelectedWeek] = useState(new Date("2026-06-18T12:00:00"));
  const [selectedStudentId, setSelectedStudentId] = useState("all");
  const [selectedSubjectId, setSelectedSubjectId] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [sidePanelMode, setSidePanelMode] = useState<SidePanelMode>("lesson");
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState<NewLessonInput>(() => createInitialLessonForm(savedState.students));
  const [studentForm, setStudentForm] = useState<NewStudentInput>(createInitialStudentForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lessons: lessonList,
        students: studentList,
      }),
    );
  }, [lessonList, studentList]);

  const nextLesson = useMemo(
    () =>
      lessonList
        .filter((lesson) => lesson.status === "scheduled")
        .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())[0],
    [lessonList],
  );

  const unpaidLessons = useMemo(() => lessonList.filter((lesson) => !lesson.isPaid && lesson.status !== "canceled"), [lessonList]);

  function openNewLessonForm() {
    setLessonForm(createInitialLessonForm(studentList));
    setEditingLessonId(null);
    setSidePanelMode("lesson");
    setFormError("");
    setIsFormOpen(true);
  }

  function openEditLessonForm(lesson: Lesson) {
    setLessonForm(createLessonFormFromLesson(lesson));
    setEditingLessonId(lesson.id);
    setSidePanelMode("lesson");
    setFormError("");
    setIsFormOpen(true);
  }

  function openStudentForm() {
    setStudentForm(createInitialStudentForm());
    setSidePanelMode("student");
    setFormError("");
    setIsFormOpen(true);
  }

  function handleSaveLesson() {
    const startsAt = buildDateTime(lessonForm.date, lessonForm.startTime);
    const endsAt = addMinutes(startsAt, lessonForm.durationMinutes);

    if (!lessonForm.studentId || !lessonForm.subjectId || !lessonForm.date || !lessonForm.startTime) {
      setFormError("Choose a student, subject, date, and start time.");
      return;
    }

    if (lessonForm.durationMinutes < 15) {
      setFormError("Duration must be at least 15 minutes.");
      return;
    }

    if (hasLessonOverlap(lessonList, startsAt, endsAt, editingLessonId ?? undefined)) {
      setFormError("This overlaps with another active lesson in your schedule.");
      return;
    }

    if (editingLessonId) {
      const updatedLesson = createLessonFromInput(lessonForm);
      setLessonList((currentLessons) =>
        currentLessons.map((lesson) =>
          lesson.id === editingLessonId
            ? {
                ...lesson,
                ...updatedLesson,
                createdAt: lesson.createdAt,
              }
            : lesson,
        ),
      );
    } else {
      const lesson: Lesson = {
        id: `lesson-${Date.now()}`,
        ...createLessonFromInput(lessonForm),
      };

      setLessonList((currentLessons) => [...currentLessons, lesson]);
    }

    setSelectedWeek(startsAt);
    setLessonForm(createInitialLessonForm(studentList));
    setEditingLessonId(null);
    setFormError("");
  }

  function handleSaveStudent() {
    const name = studentForm.name.trim();

    if (!name) {
      setFormError("Student name is required.");
      return;
    }

    const now = new Date().toISOString();
    const baseId = createStudentId(name);
    const existingIds = new Set(studentList.map((student) => student.id));
    const id = existingIds.has(baseId) ? `${baseId}-${Date.now()}` : baseId;
    const student: Student = {
      id,
      name,
      email: studentForm.email.trim(),
      phone: studentForm.phone.trim(),
      notes: studentForm.notes.trim(),
      createdAt: now,
      updatedAt: now,
    };

    setStudentList((currentStudents) => [...currentStudents, student]);
    setLessonForm((currentForm) => ({ ...currentForm, studentId: id }));
    setStudentForm(createInitialStudentForm());
    setSidePanelMode("lesson");
    setFormError("");
  }

  return (
    <AppShell activeView={activeView} onViewChange={setActiveView}>
      <div className="top-summary">
        <div>
          <span>Next lesson</span>
          <strong>
            {nextLesson
              ? `${studentList.find((student) => student.id === nextLesson.studentId)?.name ?? "Unknown"} at ${new Date(
                  nextLesson.startsAt,
                ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "Nothing scheduled"}
          </strong>
        </div>
        <div>
          <span>Active students</span>
          <strong>{studentList.length}</strong>
        </div>
        <div>
          <span>Unpaid lessons</span>
          <strong>{unpaidLessons.length}</strong>
        </div>
      </div>

      <div className="workspace">
        <div className="primary-view">
          {activeView === "agenda" ? (
            <AgendaView
              lessons={lessonList}
              selectedStudentId={selectedStudentId}
              selectedSubjectId={selectedSubjectId}
              selectedWeek={selectedWeek}
              students={studentList}
              subjects={subjects}
              onEditLesson={openEditLessonForm}
              onOpenNewLesson={openNewLessonForm}
              onSelectedStudentChange={setSelectedStudentId}
              onSelectedSubjectChange={setSelectedSubjectId}
              onSelectedWeekChange={setSelectedWeek}
            />
          ) : null}
          {activeView === "students" ? <StudentsView lessons={lessonList} students={studentList} subjects={subjects} /> : null}
          {activeView === "subjects" ? <SubjectsView subjects={subjects} /> : null}
          {activeView === "metrics" ? <MetricsView lessons={lessonList} students={studentList} /> : null}
          {activeView === "settings" ? <SettingsView settings={settings} /> : null}
        </div>

        {isFormOpen ? (
          <aside className="side-panel" aria-label="Editing panel">
            <button className="icon-button close-button" aria-label="Close form" onClick={() => setIsFormOpen(false)} type="button">
              <span aria-hidden="true">X</span>
            </button>
            {sidePanelMode === "lesson" ? (
              <NewLessonForm
                error={formError}
                form={lessonForm}
                mode={editingLessonId ? "edit" : "create"}
                settings={settings}
                students={studentList}
                subjects={subjects}
                onAddStudent={openStudentForm}
                onChange={(nextForm) => {
                  setLessonForm(nextForm);
                  setFormError("");
                }}
                onSubmit={handleSaveLesson}
              />
            ) : (
              <StudentForm
                error={formError}
                form={studentForm}
                onChange={(nextForm) => {
                  setStudentForm(nextForm);
                  setFormError("");
                }}
                onSubmit={handleSaveStudent}
              />
            )}
          </aside>
        ) : null}
      </div>
    </AppShell>
  );
}
