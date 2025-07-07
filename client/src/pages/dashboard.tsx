import { useState, useEffect } from "react";
import { Layout } from "react-grid-layout";
import { Header } from "../components/Header";
import { Dashboard } from "../components/Dashboard";

import { WidgetInstance, WidgetType, Dashboard as DashboardType } from "@shared/schema";
import { WIDGET_CONFIGS } from "../types/widgets";
import { loadDashboard, saveDashboard, createDefaultDashboard, generateWidgetId } from "../lib/storage";
import { exportDashboardAsImage } from "../lib/export";
import { useToast } from "../hooks/use-toast";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";


export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardType>(() => {
    const saved = loadDashboard();
    return saved || createDefaultDashboard();
  });
  

  const { toast } = useToast();

  // keyboard shortcuts setup
  useKeyboardShortcuts({
    onAddWidget: () => {
      // dont need this anymore have dropdown
    },
    onExportDashboard: () => {
      exportDashboardAsImage('dashboard').then(() => {
        toast({
          title: "Export Successful",
          description: "Your dashboard has been downloaded as an image.",
        });
      }).catch(() => {
        toast({
          title: "Export Failed",
          description: "Failed to export dashboard. Please try again.",
          variant: "destructive",
        });
      });
    },
  });

  // save to localStorage when dashboard changes
  useEffect(() => {
    const updatedDashboard = {
      ...dashboard,
      lastModified: new Date().toISOString(),
    };
    saveDashboard(updatedDashboard);
  }, [dashboard]);

  const handleLayoutChange = (layout: Layout[]) => {
    setDashboard(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget => {
        const layoutItem = layout.find(l => l.i === widget.id);
        if (layoutItem) {
          return {
            ...widget,
            layout: {
              ...widget.layout,
              ...layoutItem,
            },
          };
        }
        return widget;
      }),
      layout,
    }));
  };

  const handleUpdateWidgets = (widgets: WidgetInstance[]) => {
    setDashboard(prev => ({
      ...prev,
      widgets,
      layout: widgets.map(w => w.layout),
    }));
  };

  const handleAddWidget = (type: WidgetType) => {
    const config = WIDGET_CONFIGS[type];
    const widgetId = generateWidgetId(type);
    
    // find spot for new widget
    const existingLayouts = dashboard.widgets.map(w => w.layout);
    let x = 0;
    let y = 0;
    
    // find first open spot on grid
    const gridWidth = 4; // lg screen has 4 cols
    let placed = false;
    
    for (let row = 0; row < 10 && !placed; row++) {
      for (let col = 0; col <= gridWidth - config.defaultSize.w && !placed; col++) {
        const proposed = {
          x: col,
          y: row,
          w: config.defaultSize.w,
          h: config.defaultSize.h,
        };
        
        const hasCollision = existingLayouts.some(layout => 
          layout.x < proposed.x + proposed.w &&
          layout.x + layout.w > proposed.x &&
          layout.y < proposed.y + proposed.h &&
          layout.y + layout.h > proposed.y
        );
        
        if (!hasCollision) {
          x = col;
          y = row;
          placed = true;
        }
      }
    }

    const newWidget: WidgetInstance = {
      id: widgetId,
      type,
      data: getDefaultWidgetData(type),
      layout: {
        i: widgetId,
        x,
        y,
        w: config.defaultSize.w,
        h: config.defaultSize.h,
        minW: config.minSize.w,
        minH: config.minSize.h,
      },
    };

    handleUpdateWidgets([...dashboard.widgets, newWidget]);
    
    toast({
      title: "Widget Added",
      description: `${config.name} widget has been added to your dashboard.`,
    });
  };

  const getDefaultWidgetData = (type: WidgetType): any => {
    switch (type) {
      case 'welcome':
        return {};
      case 'todo':
        return { items: [] };
      case 'pomodoro':
        return {
          duration: 25,
          timeRemaining: 25 * 60,
          isRunning: false,
          isPaused: false,
        };
      case 'quote':
        return {
          currentQuote: {
            text: "The way to get started is to quit talking and begin doing.",
            author: "Walt Disney",
          },
        };
      case 'sticky-notes':
        return { notes: [] };
      case 'habit-tracker':
        return {
          habits: [
            {
              id: '1',
              name: 'Drink water',
              color: 'sage',
              completedDays: [],
            },
            {
              id: '2',
              name: 'Exercise',
              color: 'dusty-pink',
              completedDays: [],
            },
            {
              id: '3',
              name: 'Read',
              color: 'pastel-teal',
              completedDays: [],
            },
          ],
        };
      case 'mood-tracker':
        return {
          entries: [],
          currentMood: undefined,
        };
      case 'weather':
        return {
          location: undefined,
          currentWeather: undefined,
          temperature: undefined,
        };
      case 'calendar':
        return {
          events: [],
        };
      case 'goals':
        return {
          goals: [],
        };
      case 'water-tracker':
        return {
          dailyTarget: 8,
          todayAmount: 0,
          history: [],
        };
      case 'reading-tracker':
        return {
          currentBooks: [],
          booksRead: 0,
          pagesRead: 0,
        };
      case 'expense-tracker':
        return {
          monthlyBudget: undefined,
          expenses: [],
          categories: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'],
        };
      default:
        return {};
    }
  };

  const handleResetDashboard = () => {
    console.log('resetting dashboard to default'); // debug
    const defaultDashboard = createDefaultDashboard();
    setDashboard(defaultDashboard);
    saveDashboard(defaultDashboard);
    toast({
      title: "Dashboard Reset",
      description: "Your dashboard has been reset to its default state.",
    });
  };

  const handleClearDashboard = () => {
    console.log('clearing all widgets'); // debug
    const emptyDashboard = {
      widgets: [],
      layout: [],
      lastModified: new Date().toISOString(),
    };
    setDashboard(emptyDashboard);
    saveDashboard(emptyDashboard);
    toast({
      title: "Dashboard Cleared",
      description: "All widgets have been removed from your dashboard.",
    });
  };

  return (
    <div className="min-h-screen bg-soft-cream">
      <Header
        onAddWidget={handleAddWidget}
        onResetDashboard={handleResetDashboard}
        onClearDashboard={handleClearDashboard}
        onExportDashboard={() => {
          exportDashboardAsImage('dashboard').then(() => {
            toast({
              title: "Export Successful",
              description: "Your dashboard has been downloaded as an image.",
            });
          }).catch(() => {
            toast({
              title: "Export Failed",
              description: "Failed to export dashboard. Please try again.",
              variant: "destructive",
            });
          });
        }}
      />
      
      <Dashboard
        widgets={dashboard.widgets}
        onUpdateWidgets={handleUpdateWidgets}
        onLayoutChange={handleLayoutChange}
      />


    </div>
  );
}
