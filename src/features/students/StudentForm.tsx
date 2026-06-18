import type { FormEvent } from "react";
import type { NewStudentInput } from "../../types/schedule";

type StudentFormProps = {
  form: NewStudentInput;
  error: string;
  onChange: (form: NewStudentInput) => void;
  onSubmit: () => void;
};

export function StudentForm({ form, error, onChange, onSubmit }: StudentFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="new-lesson-form" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Create</p>
        <h2>New student</h2>
      </div>

      <label>
        Name
        <input value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} />
      </label>

      <label>
        Phone
        <input value={form.phone} onChange={(event) => onChange({ ...form, phone: event.target.value })} />
      </label>

      <label>
        Email
        <input value={form.email} onChange={(event) => onChange({ ...form, email: event.target.value })} type="email" />
      </label>

      <label>
        Notes
        <textarea
          value={form.notes}
          onChange={(event) => onChange({ ...form, notes: event.target.value })}
          placeholder="Goals, level, payment details, or anything useful"
          rows={4}
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="primary-button full-width" type="submit">
        <span className="inline-icon">OK</span>
        <span>Save student</span>
      </button>
    </form>
  );
}
