export type LessonStatus = "scheduled" | "completed" | "canceled" | "rescheduled";
export type LessonFormat = "online" | "in_person";

export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type Subject = {
  id: string;
  name: string;
  description: string;
  defaultDurationMinutes: number;
  createdAt: string;
  updatedAt: string;
};

export type Lesson = {
  id: string;
  studentId: string;
  subjectId: string;
  startsAt: string;
  endsAt: string;
  status: LessonStatus;
  format: LessonFormat;
  topic: string;
  priceLabel: string;
  isPaid: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type TeachingSettings = {
  defaultLessonDurationMinutes: number;
  workingDayStartsAt: string;
  workingDayEndsAt: string;
  timezone: string;
};

export type NewLessonInput = {
  studentId: string;
  subjectId: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  format: LessonFormat;
  topic: string;
  priceLabel: string;
  isPaid: boolean;
  notes: string;
};
