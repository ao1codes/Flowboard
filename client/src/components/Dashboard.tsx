import { useState, useCallback } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { WidgetInstance, WidgetType } from "@shared/schema";
import { WIDGET_CONFIGS } from "../types/widgets";
import { generateWidgetId } from "../lib/storage";

// Widgets
import { WelcomeWidget } from "./widgets/WelcomeWidget";
import { TodoWidget } from "./widgets/TodoWidget";
import { PomodoroWidget } from "./widgets/PomodoroWidget";
import { QuoteWidget } from "./widgets/QuoteWidget";
import { StickyNotesWidget } from "./widgets/StickyNotesWidget";
import { HabitTrackerWidget } from "./widgets/HabitTrackerWidget";
import { MoodTrackerWidget } from "./widgets/MoodTrackerWidget";
import { WeatherWidget } from "./widgets/WeatherWidget";
import { GoalsWidget } from "./widgets/GoalsWidget";
import { WaterTrackerWidget } from "./widgets/WaterTrackerWidget";
import { CalendarWidget } from "./widgets/CalendarWidget";
import { ReadingTrackerWidget } from "./widgets/ReadingTrackerWidget";
import { ExpenseTrackerWidget } from "./widgets/ExpenseTrackerWidget";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardProps {
  widgets: WidgetInstance[];
  onUpdateWidgets: (widgets: WidgetInstance[]) => void;
  onLayoutChange: (layout: Layout[]) => void;
}

export function Dashboard({ widgets, onUpdateWidgets, onLayoutChange }: DashboardProps) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');

  const handleLayoutChange = useCallback((layout: Layout[]) => {
    onLayoutChange(layout);
  }, [onLayoutChange]);

  const handleBreakpointChange = useCallback((breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
  }, []);

  const removeWidget = (widgetId: string) => {
    console.log('Removing widget:', widgetId); // Debug log
    onUpdateWidgets(widgets.filter(w => w.id !== widgetId));
  };

  const updateWidgetData = (widgetId: string, newData: any) => {
    onUpdateWidgets(
      widgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, data: { ...widget.data, ...newData } }
          : widget
      )
    );
  };

  const renderWidget = (widget: WidgetInstance) => {
    const commonProps = {
      onRemove: () => removeWidget(widget.id),
    };

    switch (widget.type) {
      case 'welcome':
        return <WelcomeWidget {...commonProps} />;
      
      case 'todo':
        return (
          <TodoWidget
            {...commonProps}
            items={widget.data.items || []}
            onUpdateItems={(items) => updateWidgetData(widget.id, { items })}
          />
        );
      
      case 'pomodoro':
        return (
          <PomodoroWidget
            {...commonProps}
            duration={widget.data.duration || 25}
            timeRemaining={widget.data.timeRemaining || 25 * 60}
            isRunning={widget.data.isRunning || false}
            isPaused={widget.data.isPaused || false}
            onUpdateData={(data) => updateWidgetData(widget.id, data)}
          />
        );
      
      case 'quote':
        return (
          <QuoteWidget
            {...commonProps}
            currentQuote={widget.data.currentQuote || { text: "Loading...", author: "..." }}
            onUpdateQuote={(quote) => updateWidgetData(widget.id, { currentQuote: quote })}
          />
        );
      
      case 'sticky-notes':
        return (
          <StickyNotesWidget
            {...commonProps}
            notes={widget.data.notes || []}
            onUpdateNotes={(notes) => updateWidgetData(widget.id, { notes })}
          />
        );
      
      case 'habit-tracker':
        return (
          <HabitTrackerWidget
            {...commonProps}
            habits={widget.data.habits || []}
            onUpdateHabits={(habits) => updateWidgetData(widget.id, { habits })}
          />
        );
      
      case 'mood-tracker':
        return (
          <MoodTrackerWidget
            {...commonProps}
            entries={widget.data.entries || []}
            currentMood={widget.data.currentMood}
            onUpdateData={(data) => updateWidgetData(widget.id, data)}
          />
        );

      case 'weather':
        return (
          <WeatherWidget
            {...commonProps}
            location={widget.data.location}
            currentWeather={widget.data.currentWeather}
            temperature={widget.data.temperature}
            onUpdateData={(data) => updateWidgetData(widget.id, data)}
          />
        );

      case 'goals':
        return (
          <GoalsWidget
            {...commonProps}
            goals={widget.data.goals || []}
            onUpdateGoals={(goals) => updateWidgetData(widget.id, { goals })}
          />
        );

      case 'water-tracker':
        return (
          <WaterTrackerWidget
            {...commonProps}
            dailyTarget={widget.data.dailyTarget || 8}
            todayAmount={widget.data.todayAmount || 0}
            history={widget.data.history || []}
            onUpdateData={(data) => updateWidgetData(widget.id, data)}
          />
        );

      case 'calendar':
        return (
          <CalendarWidget
            {...commonProps}
            events={widget.data.events || []}
            onUpdateEvents={(events) => updateWidgetData(widget.id, { events })}
          />
        );

      case 'reading-tracker':
        return (
          <ReadingTrackerWidget
            {...commonProps}
            currentBooks={widget.data.currentBooks || []}
            booksRead={widget.data.booksRead || 0}
            pagesRead={widget.data.pagesRead || 0}
            onUpdateData={(data) => updateWidgetData(widget.id, data)}
          />
        );

      case 'expense-tracker':
        return (
          <ExpenseTrackerWidget
            {...commonProps}
            monthlyBudget={widget.data.monthlyBudget}
            expenses={widget.data.expenses || []}
            categories={widget.data.categories || ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other']}
            onUpdateData={(data) => updateWidgetData(widget.id, data)}
          />
        );
      
      default:
        return <div className="sketchy-border p-4">Unknown widget type</div>;
    }
  };

  const layouts = {
    lg: widgets.map(w => ({
      ...w.layout,
      minW: w.layout.minW || 1,
      minH: w.layout.minH || 1,
    })),
    md: widgets.map(w => ({
      ...w.layout,
      w: Math.min(w.layout.w, 3),
      minW: Math.min(w.layout.minW || 1, 2),
      minH: w.layout.minH || 1,
    })),
    sm: widgets.map(w => ({
      ...w.layout,
      w: Math.min(w.layout.w, 2),
      minW: 1,
      minH: w.layout.minH || 1,
    })),
    xs: widgets.map(w => ({
      ...w.layout,
      w: 1,
      minW: 1,
      minH: w.layout.minH || 1,
    })),
    xxs: widgets.map(w => ({
      ...w.layout,
      w: 1,
      minW: 1,
      minH: w.layout.minH || 1,
    })),
  };

  return (
    <div id="dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={150}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
        isDraggable={true}
        isResizable={true}
        margin={[24, 24]}
        containerPadding={[0, 0]}
      >
        {widgets.map((widget) => (
          <div key={widget.id} className="widget-container">
            {renderWidget(widget)}
          </div>
        ))}
      </ResponsiveGridLayout>
      
      {widgets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-warm-brown/60 text-lg mb-4">
            Your cozy workspace is ready! Add some widgets to get started.
          </p>
        </div>
      )}
    </div>
  );
}
