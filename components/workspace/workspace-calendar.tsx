"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "task" | "milestone" | "deadline";
  productName?: string;
}

interface WorkspaceCalendarProps {
  events: CalendarEvent[];
}

const TYPE_COLORS = {
  task: { bg: "bg-[#6366f1]/20", text: "text-[#818cf8]", dot: "#6366f1" },
  milestone: { bg: "bg-white/10", text: "text-white", dot: "#ffffff" },
  deadline: { bg: "bg-[#ef4444]/20", text: "text-[#f87171]", dot: "#ef4444" },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  // Returns 0=Mon, 6=Sun
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export function WorkspaceCalendar({ events }: WorkspaceCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function goToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  function getEventsForDay(day: number) {
    return events.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getFullYear() === viewYear &&
        d.getMonth() === viewMonth &&
        d.getDate() === day
      );
    });
  }

  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  return (
    <div className="flex flex-col h-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-white text-xl font-bold">
            {MONTHS[viewMonth]} {viewYear}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 text-[#a1a1aa] hover:text-white hover:bg-[#27272a] rounded transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 text-[#a1a1aa] hover:text-white hover:bg-[#27272a] rounded transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={goToday}
            className="px-3 py-1.5 border border-[#27272a] rounded text-xs text-[#a1a1aa] hover:border-[#444748] hover:text-[#e5e1e4] ws-label transition-colors"
          >
            Today
          </button>
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 text-xs ws-label text-[#a1a1aa]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
              Task
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white" />
              Milestone
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
              Deadline
            </span>
          </div>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs text-[#a1a1aa] ws-label uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1 border-l border-t border-[#27272a]">
        {Array.from({ length: totalCells }).map((_, idx) => {
          const day = idx - firstDay + 1;
          const isCurrentMonth = day >= 1 && day <= daysInMonth;
          const dayEvents = isCurrentMonth ? getEventsForDay(day) : [];

          return (
            <div
              key={idx}
              className={`min-h-[90px] border-r border-b border-[#27272a] p-1.5 ${
                isCurrentMonth ? "bg-[#131315]" : "bg-[#0e0e10]"
              }`}
            >
              {isCurrentMonth && (
                <>
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-full mb-1 ${
                      isToday(day)
                        ? "bg-[#6366f1] text-white font-bold"
                        : "text-[#a1a1aa]"
                    }`}
                  >
                    {day}
                  </span>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((event) => {
                      const colors = TYPE_COLORS[event.type];
                      return (
                        <div
                          key={event.id}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs truncate ${colors.bg} ${colors.text}`}
                          title={event.title}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: colors.dot }}
                          />
                          <span className="truncate">{event.title}</span>
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <span className="text-xs text-[#444748] ws-label pl-1">
                        +{dayEvents.length - 3} more
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
