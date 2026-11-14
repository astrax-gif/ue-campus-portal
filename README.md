# UE Campus Portal
Smart Campus Classroom Availability & Indoor Navigation Portal — University of Europe for Applied Sciences.

```
backend/   Express + TypeScript API (data, timetable, complaints, config)
frontend/  React 18 + TypeScript + Vite UI (components/, lib/engine.ts, api.ts)
api/       Vercel serverless entry that wraps the Express app
```

## Run locally
    npm install && npm --prefix frontend install
    npm run dev:api   # http://localhost:3001
    npm run dev:web   # http://localhost:5173 (proxies /api)

## Classroom photos
Put `theater.jpg room2.jpg r202.jpg r203.jpg sem1.jpg study.jpg r204.jpg` in `frontend/public/rooms/`.
Clicking a room opens a preview with its photo.

## Customize
- Floor plan, rooms, timetable, students: `backend/src/data.ts`
- QR wayfinding: `?from=entrance|reception|stairs`
- Data is in-memory (resets on cold start); swap `backend/src/app.ts` store for a database for persistence.

## Deploy
Vercel: root directory = repo root (uses `vercel.json`).
