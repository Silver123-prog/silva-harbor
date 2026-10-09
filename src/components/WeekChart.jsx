import { useMemo } from "react";

const sameDay = (a, b) => a.toDateString() === b.toDateString();

// Bars for tasks completed on each of the last 7 days.
export default function WeekChart({ tasks }) {
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const count = tasks.filter((t) => t.completedAt && sameDay(new Date(t.completedAt), date)).length;
      return { date, count, label: date.toLocaleDateString(undefined, { weekday: "short" }) };
    });
  }, [tasks]);

  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <figure className="week">
      <figcaption className="sr-only">Tasks completed per day over the last 7 days</figcaption>
      <div className="week-bars">
        {days.map((d, i) => (
          <div className="week-col" key={d.label + i}>
            <span className="week-count">{d.count}</span>
            <div
              className={`week-bar ${i === 6 ? "is-today" : ""}`}
              style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? 8 : 3 }}
              title={`${d.count} completed`}
            />
            <span className="week-label">{d.label}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
