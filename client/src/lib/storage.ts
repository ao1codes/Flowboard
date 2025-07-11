import { Dashboard, WidgetInstance, LayoutItem } from "@shared/schema";
import { WIDGET_CONFIGS } from "../types/widgets";

const STORAGE_KEY = 'flowboard-dashboard';

export function saveDashboard(dashboard: Dashboard): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboard));
  } catch (error) {
    console.error('Failed to save dashboard:', error);
  }
}

export function loadDashboard(): Dashboard | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
  return null;
}

export function createDefaultDashboard(): Dashboard {
  const now = new Date().toISOString();
  
  const defaultWidgets: WidgetInstance[] = [
    {
      id: 'welcome-1',
      type: 'welcome',
      data: {},
      layout: { i: 'welcome-1', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    },
    {
      id: 'todo-1',
      type: 'todo',
      data: {
        items: [
          {
            id: '1',
            text: 'Review project proposal',
            completed: false,
            createdAt: now,
          },
          {
            id: '2',
            text: 'Buy groceries',
            completed: true,
            createdAt: now,
          },
          {
            id: '3',
            text: 'Call mom',
            completed: false,
            createdAt: now,
          },
        ],
      },
      layout: { i: 'todo-1', x: 2, y: 0, w: 1, h: 3, minW: 1, minH: 2 },
    },
    {
      id: 'pomodoro-1',
      type: 'pomodoro',
      data: {
        duration: 25,
        timeRemaining: 25 * 60,
        isRunning: false,
        isPaused: false,
      },
      layout: { i: 'pomodoro-1', x: 3, y: 0, w: 1, h: 2, minW: 1, minH: 2 },
    },
    {
      id: 'quote-1',
      type: 'quote',
      data: {
        currentQuote: {
          text: "The way to get started is to quit talking and begin doing.",
          author: "Walt Disney",
        },
      },
      layout: { i: 'quote-1', x: 0, y: 2, w: 1, h: 2, minW: 1, minH: 2 },
    },
    {
      id: 'sticky-notes-1',
      type: 'sticky-notes',
      data: {
        notes: [
          {
            id: '1',
            text: 'Remember to water the plants! 🌱',
            color: 'dusty-pink',
            createdAt: now,
          },
          {
            id: '2',
            text: 'Book flight for next month',
            color: 'sage',
            createdAt: now,
          },
          {
            id: '3',
            text: 'Try that new recipe! 🍝',
            color: 'pastel-teal',
            createdAt: now,
          },
        ],
      },
      layout: { i: 'sticky-notes-1', x: 1, y: 2, w: 1, h: 3, minW: 1, minH: 2 },
    },
    {
      id: 'habit-tracker-1',
      type: 'habit-tracker',
      data: {
        habits: [
          {
            id: '1',
            name: 'Drink water',
            color: 'sage',
            completedDays: [now.split('T')[0]],
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
            completedDays: [now.split('T')[0]],
          },
          {
            id: '4',
            name: 'Meditate',
            color: 'sage',
            completedDays: [],
          },
        ],
      },
      layout: { i: 'habit-tracker-1', x: 2, y: 3, w: 1, h: 2, minW: 1, minH: 2 },
    },
    {
      id: 'mood-tracker-1',
      type: 'mood-tracker',
      data: {
        entries: [
          {
            date: now.split('T')[0],
            mood: '😊',
            moodLabel: 'Happy & Productive',
          },
        ],
        currentMood: '😊',
      },
      layout: { i: 'mood-tracker-1', x: 3, y: 2, w: 2, h: 2, minW: 2, minH: 2 },
    },
    {
      id: 'weather-1',
      type: 'weather',
      data: {
        location: 'San Francisco',
      },
      layout: { i: 'weather-1', x: 0, y: 4, w: 1, h: 2, minW: 1, minH: 2 },
    },
    {
      id: 'water-tracker-1',
      type: 'water-tracker',
      data: {
        dailyTarget: 8,
        todayAmount: 3,
        history: [
          {
            date: now.split('T')[0],
            amount: 3,
            target: 8,
          },
        ],
      },
      layout: { i: 'water-tracker-1', x: 1, y: 5, w: 1, h: 2, minW: 1, minH: 2 },
    },
    {
      id: 'goals-1',
      type: 'goals',
      data: {
        goals: [
          {
            id: '1',
            title: 'Learn a new skill',
            description: 'Complete an online course',
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
            completed: false,
            progress: 25,
          },
          {
            id: '2',
            title: 'Exercise regularly',
            description: 'Work out 3 times a week',
            targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
            completed: false,
            progress: 60,
          },
        ],
      },
      layout: { i: 'goals-1', x: 2, y: 5, w: 2, h: 3, minW: 1, minH: 2 },
    },
    {
      id: 'calendar-1',
      type: 'calendar',
      data: {
        events: [
          {
            id: '1',
            title: 'Team Meeting',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // tomorrow
            time: '14:00',
            description: 'Weekly team sync',
          },
          {
            id: '2',
            title: 'Doctor Appointment',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
            time: '10:30',
          },
        ],
      },
      layout: { i: 'calendar-1', x: 0, y: 6, w: 2, h: 3, minW: 2, minH: 2 },
    },
    {
      id: 'reading-tracker-1',
      type: 'reading-tracker',
      data: {
        currentBooks: [
          {
            id: '1',
            bookTitle: 'The Psychology of Money',
            author: 'Morgan Housel',
            totalPages: 256,
            currentPage: 89,
            startedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days ago
          },
        ],
        booksRead: 3,
        pagesRead: 847,
      },
      layout: { i: 'reading-tracker-1', x: 2, y: 8, w: 2, h: 2, minW: 2, minH: 2 },
    },
    {
      id: 'expense-tracker-1',
      type: 'expense-tracker',
      data: {
        monthlyBudget: 2000,
        expenses: [
          {
            id: '1',
            amount: 45.67,
            description: 'Grocery shopping',
            category: 'Food',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
          },
          {
            id: '2',
            amount: 12.50,
            description: 'Coffee',
            category: 'Food',
            date: new Date().toISOString().split('T')[0], // today
          },
          {
            id: '3',
            amount: 85.00,
            description: 'Gas bill',
            category: 'Bills',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // yesterday
          },
        ],
        categories: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'],
      },
      layout: { i: 'expense-tracker-1', x: 0, y: 9, w: 2, h: 3, minW: 2, minH: 2 },
    },
  ];

  return {
    widgets: defaultWidgets,
    layout: defaultWidgets.map(w => w.layout),
    lastModified: now,
  };
}

export function generateWidgetId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
