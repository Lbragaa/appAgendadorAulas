import type { Lesson, Student } from "../../types/schedule";

type MetricsViewProps = {
  lessons: Lesson[];
  students: Student[];
};

function parsePrice(priceLabel: string): number {
  const normalized = priceLabel.replace(",", ".");
  const match = normalized.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function monthKey(value: string): string {
  return value.slice(0, 7);
}

export function MetricsView({ lessons, students }: MetricsViewProps) {
  const activeLessons = lessons.filter((lesson) => lesson.status !== "canceled");
  const completedLessons = activeLessons.filter((lesson) => lesson.status === "completed");
  const scheduledLessons = activeLessons.filter((lesson) => lesson.status === "scheduled");
  const paidRevenue = activeLessons.filter((lesson) => lesson.isPaid).reduce((total, lesson) => total + parsePrice(lesson.priceLabel), 0);
  const unpaidRevenue = activeLessons.filter((lesson) => !lesson.isPaid).reduce((total, lesson) => total + parsePrice(lesson.priceLabel), 0);
  const projectedRevenue = paidRevenue + unpaidRevenue;
  const currentMonth = "2026-06";
  const currentMonthLessons = activeLessons.filter((lesson) => monthKey(lesson.startsAt) === currentMonth);
  const currentMonthRevenue = currentMonthLessons.reduce((total, lesson) => total + parsePrice(lesson.priceLabel), 0);
  const revenueByStudent = students
    .map((student) => {
      const studentLessons = activeLessons.filter((lesson) => lesson.studentId === student.id);
      return {
        id: student.id,
        name: student.name,
        total: studentLessons.reduce((sum, lesson) => sum + parsePrice(lesson.priceLabel), 0),
        count: studentLessons.length,
      };
    })
    .filter((row) => row.count > 0)
    .sort((a, b) => b.total - a.total);

  const averageLessonValue = activeLessons.length ? projectedRevenue / activeLessons.length : 0;

  return (
    <section className="view-stack">
      <div className="view-header">
        <div>
          <p className="eyebrow">Money and pace</p>
          <h1>Metrics</h1>
        </div>
      </div>

      <div className="settings-grid">
        <article className="metric-tile">
          <span>Paid revenue</span>
          <strong>{formatCurrency(paidRevenue)}</strong>
        </article>
        <article className="metric-tile">
          <span>Unpaid amount</span>
          <strong>{formatCurrency(unpaidRevenue)}</strong>
        </article>
        <article className="metric-tile">
          <span>Projected total</span>
          <strong>{formatCurrency(projectedRevenue)}</strong>
        </article>
        <article className="metric-tile">
          <span>June revenue</span>
          <strong>{formatCurrency(currentMonthRevenue)}</strong>
        </article>
        <article className="metric-tile">
          <span>Completed lessons</span>
          <strong>{completedLessons.length}</strong>
        </article>
        <article className="metric-tile">
          <span>Upcoming lessons</span>
          <strong>{scheduledLessons.length}</strong>
        </article>
        <article className="metric-tile">
          <span>Average lesson value</span>
          <strong>{formatCurrency(averageLessonValue)}</strong>
        </article>
      </div>

      <div className="subject-table">
        {revenueByStudent.map((row) => (
          <article className="subject-row" key={row.id}>
            <div>
              <h2>{row.name}</h2>
              <p>{row.count} lessons</p>
            </div>
            <span>{formatCurrency(row.total)}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
