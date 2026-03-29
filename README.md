# Math4Kids - תרגול חשבון לכיתה ב׳

A kid-friendly web app for 2nd grade math practice, focused on addition and subtraction up to 100 with full regrouping (carrying and borrowing) support.

## Features

- **Hebrew UI** with RTL layout
- **Addition & Subtraction** up to 100
- **Three difficulty levels**: easy, medium, and regrouping (carrying/borrowing)
- **Three practice modes**: addition only, subtraction only, mixed
- **Session sizes**: 5, 10, or 20 questions
- **Large, colorful numeric keypad** designed for young children
- **Instant feedback** after each answer
- **Score summary** with encouraging messages
- **Session history** saved locally in the browser
- **Responsive** design for desktop and tablet

## Tech Stack

- React 18
- TypeScript
- Vite

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── logic/
│   ├── questionGenerator.ts   # Random question generation with difficulty balancing
│   ├── scoring.ts             # Score calculation and feedback messages
│   └── storage.ts             # localStorage abstraction (swap-ready for DB)
├── components/
│   ├── QuestionDisplay.tsx    # Math question display
│   └── NumericKeypad.tsx      # Touch-friendly numeric input
├── pages/
│   ├── HomePage.tsx           # Mode and session config
│   ├── PracticePage.tsx       # Question-by-question practice
│   ├── ResultsPage.tsx        # Score summary
│   └── HistoryPage.tsx        # Past sessions
├── types.ts                   # Shared TypeScript types
├── App.tsx                    # Page routing
└── index.css                  # RTL-aware child-friendly styles
```
