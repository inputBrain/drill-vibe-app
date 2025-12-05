# Drill Management System - Frontend

A professional drill tracking system with real-time monitoring, built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Home Page - Drill Cards
- **Responsive Grid Layout**: 1-6 cards per row depending on screen size
- **Real-time Timers**: Active sessions update every second
- **Multi-user Management**: Start/stop drills for multiple users simultaneously
- **Create/Edit/Delete Drills**: Full CRUD operations with modals
- **User Selection**: Multi-select dropdown for adding users to drills

### Reports Page
- **Summary Statistics Table**: Aggregated data by drill with total sessions, time, and cost
- **All Sessions Table**: Detailed view of all user sessions with real-time updates
- **Filters**: View all sessions, active only, or completed only
- **Real-time Cost Calculation**: Costs update automatically for active sessions

### Design
- **Crypto Exchange Style**: Modern dark theme with blue/cyan accents
- **Smooth Animations**: Hover effects, transitions, and pulsing indicators
- **Toast Notifications**: Success/error feedback for all operations
- **Mobile Responsive**: Optimized for all screen sizes

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Date/Time**: date-fns

## Prerequisites

- Node.js 18+
- Backend API running on `http://localhost:5000`

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

The API base URL is configured in `src/lib/api.ts`:
```typescript
const BASE_URL = 'http://localhost:5000';
```

Change this if your backend API is running on a different port.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page (Drill cards)
│   ├── reports/
│   │   └── page.tsx        # Reports page
│   └── globals.css         # Global styles & theme
├── components/
│   ├── drill/              # Drill card components
│   ├── reports/            # Report table components
│   ├── layout/             # Header & Footer
│   ├── ui/                 # Reusable UI components
│   └── providers/          # React Query & Toast providers
├── hooks/                  # Custom React hooks
├── lib/
│   ├── api.ts              # API client
│   └── utils.ts            # Utility functions
└── types/
    └── index.ts            # TypeScript interfaces
```

## Real-time Updates

The application uses two strategies for real-time updates:

1. **Client-side Timers**: Updates every second for active sessions
2. **Periodic Refetching**: React Query refetches data every 30 seconds

## Responsive Breakpoints

```
- 640px (sm):   2 cards per row
- 768px (md):   3 cards per row
- 1024px (lg):  4 cards per row
- 1280px (xl):  5 cards per row
- 1536px (2xl): 6 cards per row
```

## License

All rights reserved © 2025 Drill Management System
