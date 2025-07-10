# 🗒️ ao1code's Flowboard

A customizable productivity dashboard built with React and TypeScript. Includes draggable widgets like to-do lists, timers, habit and mood trackers, all within a notebook-style interface.

---

## Features

* Drag-and-drop dashboard layout
* Todo list with task tracking
* Pomodoro timer with session persistence and audio alerts
* Sticky notes with color-coded organization
* Habit tracker with visual checkmarks
* Mood tracker with daily logs
* Weather widget with simulated seasonal data
* Goals tracker with progress and deadlines
* Water intake, reading, and expense trackers
* Calendar with current-month view
* Dashboard export to image
* Light and dark mode support
* LocalStorage-based persistence

---

## Tech Stack

**Frontend**

* React 18 + TypeScript
* Tailwind CSS with custom palette
* Shadcn/ui and Radix UI components
* React Grid Layout
* Wouter (routing)
* html2canvas (dashboard export)

**Tooling**

* Vite (frontend development and build)
* Zod for schema validation
* LocalStorage-based data persistence

---

## Installation

### Prerequisites

* Node.js 18+

### Setup

```bash
git clone https://github.com/ao1codes/Flowboard
cd flowboard
npm install
```

Start the dev server:

```bash
npm run dev
```

Open your browser at:

```
http://localhost:8082
```

---