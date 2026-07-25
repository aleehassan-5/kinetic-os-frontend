import { cn } from "@/lib/utils";
import { platformStyle, ScheduledPost } from "./data";

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarGrid({
  viewDate,
  selectedDay,
  onSelect,
  posts,
}: {
  viewDate: Date;
  selectedDay: number | null;
  onSelect: (day: number) => void;
  posts: ScheduledPost[];
}) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Sun=0 -> Mon=0
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const cells: (number | null)[] = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-border">
        {weekdayLabels.map((d) => (
          <div key={d} className="px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const dayPosts = day ? posts.filter((p) => p.day === day && p.month === month && p.year === year) : [];
          const isToday = isCurrentMonth && day === today.getDate();
          const isSelected = day === selectedDay;
          return (
            <button
              key={i}
              disabled={!day}
              onClick={() => day && onSelect(day)}
              className={cn(
                "min-h-[92px] border-b border-r border-border p-2 text-left align-top transition-colors duration-200",
                day ? "hover:bg-white/[0.025]" : "bg-white/[0.01]",
                isSelected && "bg-primary-muted/40"
              )}
            >
              {day && (
                <>
                  <span
                    className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11.5px] font-medium",
                      isToday ? "bg-primary text-background" : "text-text-secondary"
                    )}
                  >
                    {day}
                  </span>
                  <div className="mt-1.5 space-y-1">
                    {dayPosts.slice(0, 2).map((p) => {
                      const s = platformStyle[p.platform];
                      return (
                        <div key={p.id} className={cn("truncate rounded px-1.5 py-0.5 text-[10.5px] font-medium", s.bg, s.text)}>
                          {p.time} · {p.title}
                        </div>
                      );
                    })}
                    {dayPosts.length > 2 && (
                      <div className="px-1 text-[10px] text-text-muted">+{dayPosts.length - 2} more</div>
                    )}
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
