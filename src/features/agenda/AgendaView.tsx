import { StatusBadge } from "../../components/ui/StatusBadge";
import type { Lesson, Student, Subject } from "../../types/schedule";
import { addDays, formatDay, formatTime, getWeekDays, isSameDate } from "../../utils/date";

type AgendaViewProps = {
  lessons: Lesson[];
  students: Student[];
  subjects: Subject[];
  selectedWeek: Date;
  selectedStudentId: string;
  selectedSubjectId: string;
  onSelectedWeekChange: (date: Date) => void;
  onSelectedStudentChange: (studentId: string) => void;
  onSelectedSubjectChange: (subjectId: string) => void;
  onOpenNewLesson: () => void;
  onEditLesson: (lesson: Lesson) => void;
};

export function AgendaView({
  lessons,
  students,
  subjects,
  selectedWeek,
  selectedStudentId,
  selectedSubjectId,
  onSelectedWeekChange,
  onSelectedStudentChange,
  onSelectedSubjectChange,
  onOpenNewLesson,
  onEditLesson,
}: AgendaViewProps) {
  const weekDays = getWeekDays(selectedWeek);
  const visibleLessons = lessons
    .filter((lesson) => selectedStudentId === "all" || lesson.studentId === selectedStudentId)
    .filter((lesson) => selectedSubjectId === "all" || lesson.subjectId === selectedSubjectId)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  return (
    <section className="view-stack">
      <div className="view-header">
        <div>
          <p className="eyebrow">Your week</p>
          <h1>Teaching agenda</h1>
        </div>
        <button className="primary-button" onClick={onOpenNewLesson} type="button">
          <span className="inline-icon">+</span>
          <span>New lesson</span>
        </button>
      </div>

      <div className="toolbar">
        <div className="week-controls">
          <button
            aria-label="Previous week"
            className="icon-button"
            onClick={() => onSelectedWeekChange(addDays(selectedWeek, -7))}
            type="button"
          >
            <span aria-hidden="true">&lt;</span>
          </button>
          <strong>
            {formatDay(weekDays[0])} - {formatDay(weekDays[6])}
          </strong>
          <button
            aria-label="Next week"
            className="icon-button"
            onClick={() => onSelectedWeekChange(addDays(selectedWeek, 7))}
            type="button"
          >
            <span aria-hidden="true">&gt;</span>
          </button>
        </div>

        <div className="filters" aria-label="Agenda filters">
          <span className="inline-icon">F</span>
          <select value={selectedStudentId} onChange={(event) => onSelectedStudentChange(event.target.value)}>
            <option value="all">All students</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          <select value={selectedSubjectId} onChange={(event) => onSelectedSubjectChange(event.target.value)}>
            <option value="all">All subjects</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="agenda-grid">
        {weekDays.map((day) => {
          const dayLessons = visibleLessons.filter((lesson) => isSameDate(day, lesson.startsAt));

          return (
            <section className="day-column" key={day.toISOString()}>
              <header>
                <span>{formatDay(day)}</span>
                <strong>{dayLessons.length}</strong>
              </header>
              <div className="lesson-list">
                {dayLessons.length === 0 ? (
                  <p className="empty-state">No lessons</p>
                ) : (
                  dayLessons.map((lesson) => {
                    const student = students.find((item) => item.id === lesson.studentId);
                    const subject = subjects.find((item) => item.id === lesson.subjectId);
                    const lessonStart = new Date(lesson.startsAt);
                    const lessonEnd = new Date(lesson.endsAt);
                    const hasConflict = dayLessons.some((otherLesson) => {
                      if (otherLesson.id === lesson.id || otherLesson.status === "canceled") {
                        return false;
                      }

                      const otherStart = new Date(otherLesson.startsAt);
                      const otherEnd = new Date(otherLesson.endsAt);
                      return lessonStart < otherEnd && lessonEnd > otherStart;
                    });

                    return (
                      <article className="lesson-item" key={lesson.id}>
                        <button className="link-button lesson-edit-button" onClick={() => onEditLesson(lesson)} type="button">
                          Edit
                        </button>
                        <div className="lesson-time">
                          {formatTime(lesson.startsAt)} - {formatTime(lesson.endsAt)}
                        </div>
                        <h3>{student?.name ?? "Unknown student"}</h3>
                        <p>{lesson.topic || subject?.name || "Unknown subject"}</p>
                        <div className="lesson-meta">
                          <span>
                            <span className="inline-icon">{lesson.format === "online" ? "O" : "P"}</span>
                            {lesson.format === "online" ? "Online" : "Presencial"}
                          </span>
                          <span>
                            <span className="inline-icon">$</span>
                            {lesson.priceLabel || "-"}
                          </span>
                        </div>
                        <div className="badge-row">
                          <StatusBadge status={lesson.status} />
                          <span className={lesson.isPaid ? "payment-badge paid" : "payment-badge unpaid"}>
                            {lesson.isPaid ? "Paid" : "Unpaid"}
                          </span>
                          {hasConflict ? <span className="conflict-badge">Conflict</span> : null}
                        </div>
                        {lesson.notes ? <p className="lesson-note">{lesson.notes}</p> : null}
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
