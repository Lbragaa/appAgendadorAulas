import type { Subject } from "../../types/schedule";

export function SubjectsView({ subjects }: { subjects: Subject[] }) {
  return (
    <section className="view-stack">
      <div className="view-header">
        <div>
          <p className="eyebrow">Teaching</p>
          <h1>Subjects</h1>
        </div>
      </div>

      <div className="subject-table">
        {subjects.map((subject) => (
          <article className="subject-row" key={subject.id}>
            <div>
              <h2>{subject.name}</h2>
              <p>{subject.description}</p>
            </div>
            <span>
              <span className="inline-icon">D</span>
              {subject.defaultDurationMinutes} min
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
