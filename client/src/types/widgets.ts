import { LayoutItem, WidgetType } from "@shared/schema";

export interface BaseWidget {
  id: string;
  type: WidgetType;
  layout: LayoutItem;
}

export interface WidgetConfig {
  type: WidgetType;
  name: string;
  icon: string;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  color: string;
}

export const WIDGET_CONFIGS: Record<WidgetType, WidgetConfig> = {
  welcome: {
    type: 'welcome',
    name: 'Welcome',
    icon: 'Heart',
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 2 },
    color: 'dusty-pink',
  },
  todo: {
    type: 'todo',
    name: 'To-Do List',
    icon: 'CheckSquare',
    defaultSize: { w: 1, h: 3 },
    minSize: { w: 1, h: 2 },
    color: 'sage',
  },
  pomodoro: {
    type: 'pomodoro',
    name: 'Pomodoro Timer',
    icon: 'Timer',
    defaultSize: { w: 1, h: 2 },
    minSize: { w: 1, h: 2 },
    color: 'dusty-pink',
  },
  quote: {
    type: 'quote',
    name: 'Daily Quote',
    icon: 'Quote',
    defaultSize: { w: 1, h: 2 },
    minSize: { w: 1, h: 2 },
    color: 'pastel-teal',
  },
  'sticky-notes': {
    type: 'sticky-notes',
    name: 'Sticky Notes',
    icon: 'StickyNote',
    defaultSize: { w: 1, h: 3 },
    minSize: { w: 1, h: 2 },
    color: 'sage',
  },
  'habit-tracker': {
    type: 'habit-tracker',
    name: 'Habit Tracker',
    icon: 'Target',
    defaultSize: { w: 1, h: 3 },
    minSize: { w: 1, h: 2 },
    color: 'dusty-pink',
  },
  'mood-tracker': {
    type: 'mood-tracker',
    name: 'Mood Tracker',
    icon: 'Smile',
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 2 },
    color: 'pastel-teal',
  },
  'weather': {
    type: 'weather',
    name: 'Weather',
    icon: 'Cloud',
    defaultSize: { w: 1, h: 2 },
    minSize: { w: 1, h: 2 },
    color: 'pastel-teal',
  },
  'calendar': {
    type: 'calendar',
    name: 'Calendar',
    icon: 'Calendar',
    defaultSize: { w: 2, h: 3 },
    minSize: { w: 2, h: 2 },
    color: 'sage',
  },
  'goals': {
    type: 'goals',
    name: 'Goals',
    icon: 'Trophy',
    defaultSize: { w: 2, h: 3 },
    minSize: { w: 1, h: 2 },
    color: 'dusty-pink',
  },
  'water-tracker': {
    type: 'water-tracker',
    name: 'Water Tracker',
    icon: 'Droplets',
    defaultSize: { w: 1, h: 2 },
    minSize: { w: 1, h: 2 },
    color: 'pastel-teal',
  },
  'reading-tracker': {
    type: 'reading-tracker',
    name: 'Reading Tracker',
    icon: 'BookOpen',
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 2, h: 2 },
    color: 'sage',
  },
  'expense-tracker': {
    type: 'expense-tracker',
    name: 'Expense Tracker',
    icon: 'DollarSign',
    defaultSize: { w: 2, h: 3 },
    minSize: { w: 2, h: 2 },
    color: 'dusty-pink',
  },
};
