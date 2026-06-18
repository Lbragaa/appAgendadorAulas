import { useMemo, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { AgendaView } from "./features/agenda/AgendaView";
import { NewLessonForm } from "./features/lessons/NewLessonForm";
import { SettingsView } from "./features/settings/SettingsView";
import { StudentsView } from "./features/students/StudentsView";
import { SubjectsView } from "./features/subjects/SubjectsView";
import { lessons as initialLessons, settings, students, subjects } from "./data/mockData";
import type { Lesson, NewLessonInput } from "./types/schedule";
import { addMinutes, buildDateTime, formatDateInput } from "./utils/date";
import { createLessonFromInput, hasLessonOverlap } from "./utils/schedule";

export type AppView = "agenda" | "students" | "subjects" | "settings";

const firstSubject = subjects[0];

function createInitialForm(): NewLessonInput {
  return {
    studentId: students[0].id,
    subjectId: firstSubject.id,
    date: formatDateInput(new Date("2026-06-18T12:00:00")),
    startTime: "19:00",
    durationMinutes: firstSubject.defaultDurationMinutes,
    format: "online",
    topic: "Prog, aula",
    priceLabel: "65",
    isPaid: false,
    notes: "",
  };
}

export function App() {
  const [activeView, setActiveView] = useState<AppView>("agenda");
  const [lessonList, setLessonList] = useState<Lesson[]>(initialLessons);
  const [selectedWeek, setSelectedWeek] = useState(new Date("2026-06-18T12:00:00"));
  const [selectedStudentId, setSelectedStudentId] = useState("all");
  const [selectedSubjectId, setSelectedSubjectId] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [form, setForm] = useState<NewLessonInput>(createInitialForm);
  const [formError, setFormError] = useState("");

  const nextLesson = useMemo(
    () =>
      lessonList
        .filter((lesson) => lesson.status === "scheduled")
        .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())[0],
    [lessonList],
  );

  const unpaidLessons = useMemo(() => lessonList.filter((lesson) => !lesson.isPaid), [lessonList]);

  function handleCreateLesson() {
    const startsAt = buildDateTime(form.date, form.startTime);
    const endsAt = addMinutes(startsAt, form.durationMinutes);

    if (!form.studentId || !form.subjectId || !form.date || !form.startTime) {
      setFormError("Choose a student, subject, date, and start time.");
      return;
    }

    if (form.durationMinutes < 15) {
      setFormError("Duration must be at least 15 minutes.");
      return;
    }

    if (hasLessonOverlap(lessonList, startsAt, endsAt)) {
      setFormError("This overlaps with another active lesson in your schedule.");
      return;
    }

    const lesson: Lesson = {
      id: `lesson-${Date.now()}`,
      ...createLessonFromInput(form),
    };

    setLessonList((currentLessons) => [...currentLessons, lesson]);
    setSelectedWeek(startsAt);
    setForm(createInitialForm());
    setFormError("");
  }

  return (
    <AppShell activeView={activeView} onViewChange={setActiveView}>
      <div className="top-summary">
        <div>
          <span>Next lesson</span>
          <strong>
            {nextLesson
              ? `${students.find((student) => student.id === nextLesson.studentId)?.name ?? "Unknown"} at ${new Date(
                  nextLesson.startsAt,
                ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "Nothing scheduled"}
          </strong>
        </div>
        <div>
          <span>Active students</span>
          <strong>{students.length}</strong>
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
              students={students}
              subjects={subjects}
              onOpenNewLesson={() => setIsFormOpen(true)}
              onSelectedStudentChange={setSelectedStudentId}
              onSelectedSubjectChange={setSelectedSubjectId}
              onSelectedWeekChange={setSelectedWeek}
            />
          ) : null}
          {activeView === "students" ? <StudentsView lessons={lessonList} students={students} subjects={subjects} /> : null}
          {activeView === "subjects" ? <SubjectsView subjects={subjects} /> : null}
          {activeView === "settings" ? <SettingsView settings={settings} /> : null}
        </div>

        {isFormOpen ? (
          <aside className="side-panel" aria-label="New lesson panel">
            <button className="icon-button close-button" aria-label="Close new lesson form" onClick={() => setIsFormOpen(false)} type="button">
              <span aria-hidden="true">X</span>
            </button>
            <NewLessonForm
              error={formError}
              form={form}
              settings={settings}
              students={students}
              subjects={subjects}
              onChange={(nextForm) => {
                setForm(nextForm);
                setFormError("");
              }}
              onSubmit={handleCreateLesson}
            />
          </aside>
        ) : null}
      </div>
    </AppShell>
  );
}
