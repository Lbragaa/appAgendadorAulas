import type { LessonStatus } from "../../types/schedule";

const labels: Record<LessonStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  canceled: "Canceled",
  rescheduled: "Rescheduled",
};

export function StatusBadge({ status }: { status: LessonStatus }) {
  return <span className={`status-badge ${status}`}>{labels[status]}</span>;
}
