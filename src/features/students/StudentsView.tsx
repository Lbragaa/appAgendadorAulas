import { StatusBadge } from "../../components/ui/StatusBadge";
import type { Lesson, Student, Subject } from "../../types/schedule";
import { formatTime } from "../../utils/date";

type StudentsViewProps = {
  students: Student[];
  lessons: Lesson[];
  subjects: Subject[];
};

export function StudentsView({ students, lessons, subjects }: StudentsViewProps) {
  return (
    <section className="view-stack">
      <div className="view-header">
        <div>
          <p className="eyebrow">People</p>
          <h1>Students</h1>
        </div>
      </div>

      <div className="student-grid">
        {students.map((student) => {
          const studentLessons = lessons
            .filter((lesson) => lesson.studentId === student.id)
            .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

          return (
            <article className="student-panel" key={student.id}>
              <header>
                <div>
                  <h2>{student.name}</h2>
                  <p>{student.notes}</p>
                </div>
                <span className="count-pill">{studentLessons.length} lessons</span>
              </header>

              <div className="contact-line">
                {student.email ? (
                  <span>
                    <span className="inline-icon">@</span>
                    {student.email}
                  </span>
                ) : null}
                {student.phone ? (
                  <span>
                    <span className="inline-icon">P</span>
                    {student.phone}
                  </span>
                ) : null}
                {!student.email && !student.phone ? <span>No contact details yet</span> : null}
              </div>

              <div className="history-list">
                {studentLessons.length === 0 ? (
                  <p className="empty-state">No lesson history yet</p>
                ) : (
                  studentLessons.map((lesson) => {
                    const subject = subjects.find((item) => item.id === lesson.subjectId);

                    return (
                      <div className="history-item" key={lesson.id}>
                        <div>
                          <strong>{subject?.name ?? "Unknown subject"}</strong>
                          <span>
                            {new Date(lesson.startsAt).toLocaleDateString()} at {formatTime(lesson.startsAt)}
                          </span>
                          <span>
                            <span className="inline-icon">$</span>
                            {lesson.priceLabel || "-"} - {lesson.isPaid ? "paid" : "unpaid"}
                          </span>
                          {lesson.notes ? <p>{lesson.notes}</p> : null}
                        </div>
                        <StatusBadge status={lesson.status} />
                      </div>
                    );
                  })
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
