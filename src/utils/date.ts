const dayFormatter = new Intl.DateTimeFormat("en", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "2-digit",
  minute: "2-digit",
});

export function startOfWeek(date: Date): Date {
  const nextDate = new Date(date);
  const day = nextDate.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  nextDate.setDate(nextDate.getDate() + offset);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

export function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function getWeekDays(date: Date): Date[] {
  const weekStart = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function formatDay(date: Date): string {
  return dayFormatter.format(date);
}

export function formatTime(value: string): string {
  return timeFormatter.format(new Date(value));
}

export function formatDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function isSameDate(date: Date, value: string): boolean {
  const target = new Date(value);
  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth() &&
    date.getDate() === target.getDate()
  );
}

export function buildDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}
