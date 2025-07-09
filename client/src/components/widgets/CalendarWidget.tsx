import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarEvent } from "@shared/schema";

interface CalendarWidgetProps {
  events: CalendarEvent[];
  onUpdateEvents: (events: CalendarEvent[]) => void;
  onRemove: () => void;
}

export function CalendarWidget({ events, onUpdateEvents, onRemove }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // get calendar data
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay()); // start from sunday

  const calendarDays = [];
  const currentDateIter = new Date(startDate);
  
  // generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(currentDateIter));
    currentDateIter.setDate(currentDateIter.getDate() + 1);
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  return (
    <div className="sketchy-border p-4 widget-hover transition-all duration-300 notebook-texture h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-sage rounded-full flex items-center justify-center doodle-icon">
            <Calendar className="text-warm-brown h-3 w-3" />
          </div>
          <h3 className="text-sm font-bold text-warm-brown">Calendar</h3>
        </div>
        <Button
          onClick={onRemove}
          variant="ghost"
          size="sm"
          className="text-warm-brown/50 hover:text-warm-brown doodle-icon p-1"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* month header */}
      <div className="flex items-center justify-between mb-2">
        <Button
          onClick={goToPreviousMonth}
          variant="ghost"
          size="sm"
          className="text-warm-brown/60 hover:text-warm-brown p-1"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        <h4 className="text-sm font-medium text-warm-brown">
          {monthNames[currentMonth]} {currentYear}
        </h4>
        <Button
          onClick={goToNextMonth}
          variant="ghost"
          size="sm"
          className="text-warm-brown/60 hover:text-warm-brown p-1"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs text-warm-brown/60 font-medium p-1">
            {day}
          </div>
        ))}
      </div>

      {/* calendar grid */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-7 gap-1 h-full">
          {calendarDays.map((date, index) => (
            <div
              key={index}
              className={`
                text-xs p-1 rounded text-center
                ${isCurrentMonth(date) ? 'text-warm-brown' : 'text-warm-brown/30'}
                ${isToday(date) ? 'bg-sage/20 border-2 border-green-500 font-bold text-warm-brown' : ''}
              `}
            >
              {date.getDate()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}