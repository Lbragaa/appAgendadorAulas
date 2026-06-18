import type { Lesson, NewLessonInput } from "../types/schedule";
import { addMinutes, buildDateTime } from "./date";

export function hasLessonOverlap(lessons: Lesson[], startsAt: Date, endsAt: Date): boolean {
  return lessons.some((lesson) => {
    if (lesson.status === "canceled") {
      return false;
    }

    const lessonStart = new Date(lesson.startsAt);
    const lessonEnd = new Date(lesson.endsAt);
    return startsAt < lessonEnd && endsAt > lessonStart;
  });
}

export function createLessonFromInput(input: NewLessonInput): Omit<Lesson, "id"> {
  const startsAt = buildDateTime(input.date, input.startTime);
  const endsAt = addMinutes(startsAt, input.durationMinutes);
  const now = new Date().toISOString();

  return {
    studentId: input.studentId,
    subjectId: input.subjectId,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    status: "scheduled",
    format: input.format,
    topic: input.topic.trim(),
    priceLabel: input.priceLabel.trim(),
    isPaid: input.isPaid,
    notes: input.notes.trim(),
    createdAt: now,
    updatedAt: now,
  };
}

export function getLessonDurationMinutes(lesson: Lesson): number {
  return Math.round((new Date(lesson.endsAt).getTime() - new Date(lesson.startsAt).getTime()) / 60_000);
}
