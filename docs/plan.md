# Initial Plan - Class Scheduling App

## Goal

Build a simple personal app for managing your own teaching schedule. The app should make it easy to see upcoming classes, schedule new lessons, keep track of students, and avoid booking conflicts.

This is a personal project, so the first version should assume there is one teacher: you. The app does not need a full teacher-management system unless that becomes useful later.

## First Version

The first version should let you:

- Add and edit students.
- Add and edit subjects or lesson types.
- Create, edit, cancel, and reschedule lessons.
- View lessons in a daily, weekly, or monthly agenda.
- Prevent overlapping lessons in your schedule.
- Track lesson status: scheduled, completed, canceled, or rescheduled.
- Keep notes for students and individual lessons.

## Suggested Stack

To move quickly while keeping the project easy to maintain:

- Frontend: React with Vite.
- Language: TypeScript.
- Styling: CSS Modules or Tailwind.
- Local state: Zustand or React Context at the beginning.
- Backend: Supabase, Firebase, or a small custom Node/Express API.
- Database: PostgreSQL if using Supabase, or SQLite/PostgreSQL if using a custom backend.

My recommendation for the first build is React + TypeScript + Vite on the frontend and Supabase for backend/database/auth. That keeps setup light and avoids spending too much time on infrastructure before the app itself exists.

## Folder Structure

```txt
appAgendadorAulas/
  docs/
    plan.md
  public/
  src/
    components/
      layout/
      ui/
    data/
    features/
      agenda/
      lessons/
      settings/
      students/
      subjects/
    pages/
    services/
    store/
    styles/
    types/
    utils/
  tests/
```

## Main Screens

### Agenda

The main screen of the app. It should show your lessons for the selected day, week, or month, with filters for student, subject, and lesson status.

### New Lesson

A form to choose the student, subject, date, start time, duration, status, price/payment fields if needed, and notes.

### Students

A searchable list of students with contact information, notes, and lesson history.

### Subjects

A list of subjects or lesson types you teach, such as English conversation, grammar, test prep, tutoring, or any other category you want.

### Settings

A place to configure your default lesson duration, working hours, unavailable times, lesson statuses, and scheduling rules.

## Initial Data Model

### Student

- id
- name
- email
- phone
- notes
- createdAt
- updatedAt

### Subject

- id
- name
- description
- defaultDurationMinutes
- createdAt
- updatedAt

### Lesson

- id
- studentId
- subjectId
- startsAt
- endsAt
- status
- notes
- createdAt
- updatedAt

### TeachingSettings

- id
- defaultLessonDurationMinutes
- workingHours
- unavailablePeriods
- timezone
- createdAt
- updatedAt

## Important Rules

- Two lessons cannot overlap.
- A lesson end time must be later than its start time.
- Canceled lessons should remain in the student's history.
- Rescheduled lessons should update the current schedule while ideally keeping enough history to understand what changed.
- Agenda filters should be quick to apply and easy to clear.
- The app should feel lightweight because it is for daily personal use, not school-wide administration.

## First Milestone

1. Create the React + TypeScript project.
2. Add the base layout and navigation.
3. Create mock data for students, subjects, lessons, and settings.
4. Build the weekly agenda view.
5. Build the new lesson form using mock data.
6. Add basic validation for overlapping lessons.
7. Add a student detail view with lesson history.

## After the First Milestone

- Add real persistence with Supabase or another backend.
- Add authentication if the app will be hosted online.
- Add a monthly calendar view.
- Add reminders or notifications.
- Add payment tracking if useful.
- Add student progress notes.
- Add basic reports, such as lessons taught per month.

## Initial Success Criteria

The first working version should let you create students and subjects, schedule a lesson, see it in the agenda, and prevent overlapping lessons in your personal teaching calendar.
