import type { FormEvent } from "react";
import type { NewLessonInput, Student, Subject, TeachingSettings } from "../../types/schedule";

type NewLessonFormProps = {
  form: NewLessonInput;
  students: Student[];
  subjects: Subject[];
  settings: TeachingSettings;
  error: string;
  mode: "create" | "edit";
  onChange: (form: NewLessonInput) => void;
  onAddStudent: () => void;
  onSubmit: () => void;
};

export function NewLessonForm({
  form,
  students,
  subjects,
  settings,
  error,
  mode,
  onChange,
  onAddStudent,
  onSubmit,
}: NewLessonFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="new-lesson-form" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">{mode === "edit" ? "Update" : "Create"}</p>
        <h2>{mode === "edit" ? "Edit lesson" : "New lesson"}</h2>
      </div>

      <label>
        Student
        <div className="inline-field-action">
          <select value={form.studentId} onChange={(event) => onChange({ ...form, studentId: event.target.value })}>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          <button className="secondary-button" onClick={onAddStudent} type="button">
            Add
          </button>
        </div>
      </label>

      <label>
        Subject
        <select
          value={form.subjectId}
          onChange={(event) => {
            const subject = subjects.find((item) => item.id === event.target.value);
            onChange({
              ...form,
              subjectId: event.target.value,
              durationMinutes: subject?.defaultDurationMinutes ?? settings.defaultLessonDurationMinutes,
            });
          }}
        >
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </label>

      <div className="form-row">
        <label>
          Date
          <input value={form.date} onChange={(event) => onChange({ ...form, date: event.target.value })} type="date" />
        </label>
        <label>
          Start
          <input
            value={form.startTime}
            onChange={(event) => onChange({ ...form, startTime: event.target.value })}
            type="time"
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Format
          <select value={form.format} onChange={(event) => onChange({ ...form, format: event.target.value as NewLessonInput["format"] })}>
            <option value="online">Online</option>
            <option value="in_person">Presencial</option>
          </select>
        </label>
        <label>
          Paid
          <select
            value={form.isPaid ? "yes" : "no"}
            onChange={(event) => onChange({ ...form, isPaid: event.target.value === "yes" })}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
      </div>

      <label>
        Status
        <select value={form.status} onChange={(event) => onChange({ ...form, status: event.target.value as NewLessonInput["status"] })}>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
          <option value="rescheduled">Rescheduled</option>
        </select>
      </label>

      <label>
        Duration
        <input
          min="15"
          step="15"
          value={form.durationMinutes}
          onChange={(event) => onChange({ ...form, durationMinutes: Number(event.target.value) })}
          type="number"
        />
      </label>

      <div className="form-row">
        <label>
          Topic
          <input value={form.topic} onChange={(event) => onChange({ ...form, topic: event.target.value })} />
        </label>
        <label>
          Price
          <input value={form.priceLabel} onChange={(event) => onChange({ ...form, priceLabel: event.target.value })} />
        </label>
      </div>

      <label>
        Notes
        <textarea
          value={form.notes}
          onChange={(event) => onChange({ ...form, notes: event.target.value })}
          placeholder="Focus, homework, preparation, or anything useful for the lesson"
          rows={4}
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="primary-button full-width" type="submit">
        <span className="inline-icon">OK</span>
        <span>{mode === "edit" ? "Update lesson" : "Save lesson"}</span>
      </button>
    </form>
  );
}
