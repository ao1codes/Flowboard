import { z } from "zod";

// Simple types for localStorage-based app
export const insertUserSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(6).max(100),
});

export const selectUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  createdAt: z.date(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

// all widget types we have
export const widgetTypeSchema = z.enum([
  'welcome',
  'todo',
  'pomodoro', 
  'quote',
  'sticky-notes',
  'habit-tracker',
  'mood-tracker',
  'weather',
  'calendar',
  'goals',
  'water-tracker',
  'reading-tracker',
  'expense-tracker'
]);

// todo item data
export const todoItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
  createdAt: z.string(),
});

// Sticky note schema
export const stickyNoteSchema = z.object({
  id: z.string(),
  text: z.string(),
  color: z.string(),
  createdAt: z.string(),
});

// Habit schema
export const habitSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  completedDays: z.array(z.string()), // ISO date strings
});

// Quote schema
export const quoteSchema = z.object({
  text: z.string(),
  author: z.string(),
});

// Mood entry schema
export const moodEntrySchema = z.object({
  date: z.string(), // ISO date string
  mood: z.enum(['😊', '😌', '😐', '😔', '😞']),
  moodLabel: z.string(),
});

// Goal schema
export const goalSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  targetDate: z.string(), // ISO date string
  completed: z.boolean(),
  progress: z.number().min(0).max(100), // percentage
});

// Water tracking schema
export const waterEntrySchema = z.object({
  date: z.string(), // ISO date string
  amount: z.number(), // in cups/glasses
  target: z.number(), // daily target
});

// Reading tracking schema
export const readingEntrySchema = z.object({
  id: z.string(),
  bookTitle: z.string(),
  author: z.string(),
  totalPages: z.number(),
  currentPage: z.number(),
  startedDate: z.string(),
  finishedDate: z.string().optional(),
});

// Expense tracking schema
export const expenseSchema = z.object({
  id: z.string(),
  amount: z.number(),
  description: z.string(),
  category: z.string(),
  date: z.string(), // ISO date string
});

// Calendar event schema
export const calendarEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(), // ISO date string
  time: z.string().optional(),
  description: z.string().optional(),
});

// Widget data schemas
export const widgetDataSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('welcome'),
    data: z.object({}).optional(),
  }),
  z.object({
    type: z.literal('todo'),
    data: z.object({
      items: z.array(todoItemSchema),
    }),
  }),
  z.object({
    type: z.literal('pomodoro'),
    data: z.object({
      duration: z.number(), // minutes
      timeRemaining: z.number(), // seconds
      isRunning: z.boolean(),
      isPaused: z.boolean(),
    }),
  }),
  z.object({
    type: z.literal('quote'),
    data: z.object({
      currentQuote: quoteSchema,
    }),
  }),
  z.object({
    type: z.literal('sticky-notes'),
    data: z.object({
      notes: z.array(stickyNoteSchema),
    }),
  }),
  z.object({
    type: z.literal('habit-tracker'),
    data: z.object({
      habits: z.array(habitSchema),
    }),
  }),
  z.object({
    type: z.literal('mood-tracker'),
    data: z.object({
      entries: z.array(moodEntrySchema),
      currentMood: z.string().optional(),
    }),
  }),
  z.object({
    type: z.literal('weather'),
    data: z.object({
      location: z.string().optional(),
      currentWeather: z.string().optional(),
      temperature: z.number().optional(),
    }),
  }),
  z.object({
    type: z.literal('calendar'),
    data: z.object({
      events: z.array(calendarEventSchema),
    }),
  }),
  z.object({
    type: z.literal('goals'),
    data: z.object({
      goals: z.array(goalSchema),
    }),
  }),
  z.object({
    type: z.literal('water-tracker'),
    data: z.object({
      dailyTarget: z.number(),
      todayAmount: z.number(),
      history: z.array(waterEntrySchema),
    }),
  }),
  z.object({
    type: z.literal('reading-tracker'),
    data: z.object({
      currentBooks: z.array(readingEntrySchema),
      booksRead: z.number(),
      pagesRead: z.number(),
    }),
  }),
  z.object({
    type: z.literal('expense-tracker'),
    data: z.object({
      monthlyBudget: z.number().optional(),
      expenses: z.array(expenseSchema),
      categories: z.array(z.string()),
    }),
  }),
]);

// Layout item for react-grid-layout
export const layoutItemSchema = z.object({
  i: z.string(), // widget id
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  minW: z.number().optional(),
  minH: z.number().optional(),
  maxW: z.number().optional(),
  maxH: z.number().optional(),
});

// Widget instance schema
export const widgetInstanceSchema = z.object({
  id: z.string(),
  type: widgetTypeSchema,
  data: z.record(z.any()), // Dynamic data based on widget type
  layout: layoutItemSchema,
});

// Dashboard schema
export const dashboardSchema = z.object({
  widgets: z.array(widgetInstanceSchema),
  layout: z.array(layoutItemSchema),
  lastModified: z.string(),
});

// Type exports
export type WidgetType = z.infer<typeof widgetTypeSchema>;
export type TodoItem = z.infer<typeof todoItemSchema>;
export type StickyNote = z.infer<typeof stickyNoteSchema>;
export type Habit = z.infer<typeof habitSchema>;
export type Quote = z.infer<typeof quoteSchema>;
export type MoodEntry = z.infer<typeof moodEntrySchema>;
export type Goal = z.infer<typeof goalSchema>;
export type WaterEntry = z.infer<typeof waterEntrySchema>;
export type ReadingEntry = z.infer<typeof readingEntrySchema>;
export type Expense = z.infer<typeof expenseSchema>;
export type CalendarEvent = z.infer<typeof calendarEventSchema>;
export type WidgetData = z.infer<typeof widgetDataSchema>;
export type LayoutItem = z.infer<typeof layoutItemSchema>;
export type WidgetInstance = z.infer<typeof widgetInstanceSchema>;
export type Dashboard = z.infer<typeof dashboardSchema>;