export const p = (s: string) => { const [a, b] = s.split(':').map(Number); return a * 60 + b }
export type Room = { id: string; name: string; x: number; y: number; w: number; h: number; cap: number; door: [number, number]; av: string[]; noise: string; icon: string }
export type Slot = { id: number; day: number; s: number; e: number; room: string; course: string; prof: string }

// Modular coordinates (SVG units, 800x420): replace x/y/w/h/door with your real floor plan.
export const ROOMS: Room[] = [
  { id: 'theater', name: 'Room 1 · Theater Room', x: 20, y: 20, w: 260, h: 160, cap: 180, door: [150, 180], av: ['Dual Projector', 'Lecture Capture', 'Surround PA'], noise: 'Loud zone', icon: '🎭' },
  { id: 'room2', name: 'Room 2 · Grand Mergeable', x: 300, y: 20, w: 240, h: 160, cap: 50, door: [420, 180], av: ['Smartboard', 'Dual Projector', 'Lecture Capture'], noise: 'Medium', icon: '🧩' },
  { id: 'r202', name: 'Room 202', x: 560, y: 20, w: 200, h: 160, cap: 30, door: [660, 180], av: ['Smartboard'], noise: 'Quiet', icon: '📘' },
  { id: 'r203', name: 'Lab 203', x: 20, y: 240, w: 180, h: 140, cap: 24, door: [110, 240], av: ['24 Workstations', 'Projector'], noise: 'Medium', icon: '💻' },
  { id: 'sem1', name: 'Seminar Room S1', x: 220, y: 240, w: 160, h: 140, cap: 16, door: [300, 240], av: ['Smartboard'], noise: 'Quiet', icon: '🗣️' },
  { id: 'study', name: 'Study Room St1', x: 400, y: 240, w: 160, h: 140, cap: 12, door: [480, 240], av: ['Power outlets', 'Whiteboard'], noise: 'Silent zone', icon: '📚' },
  { id: 'r204', name: 'Room 204', x: 580, y: 240, w: 180, h: 140, cap: 28, door: [670, 240], av: ['Projector'], noise: 'Quiet', icon: '📗' },
]
export const STARTS: Record<string, { n: string; p: [number, number] }> = {
  entrance: { n: 'Main Entrance', p: [30, 210] },
  reception: { n: 'Campus Reception', p: [390, 210] },
  stairs: { n: 'Stairwell / Elevator A', p: [775, 210] },
}
let id = 0
const mk = (days: number[], a: string, b: string, room: string, course: string, prof: string): Slot[] =>
  days.map(day => ({ id: ++id, day, s: p(a), e: p(b), room, course, prof }))
export const SLOTS: Slot[] = [
  ...mk([1, 3], '15:00', '16:30', 'r202', 'Data Science', 'Prof. Müller'),
  ...mk([1, 4], '09:00', '10:30', 'room2', 'Business Analytics', 'Prof. Keller'),
  ...mk([2], '10:00', '12:00', 'theater', 'Digital Marketing', 'Prof. Novak'),
  ...mk([1], '11:00', '13:00', 'theater', 'Intro to Management', 'Prof. Schneider'),
  ...mk([3], '11:00', '13:00', 'r203', 'Machine Learning Lab', 'Prof. Weber'),
  ...mk([5], '13:00', '15:00', 'r204', 'UX Design', 'Prof. Rossi'),
  ...mk([2], '14:00', '15:30', 'sem1', 'Applied Statistics', 'Prof. Becker'),
  ...mk([3], '13:00', '15:00', 'room2', 'Decision Support Systems', 'Prof. Hoffmann'),
  ...mk([2], '09:00', '10:30', 'r204', 'Project Management', 'Prof. Fischer'),
  ...mk([4], '14:00', '16:00', 'r202', 'Data Science', 'Prof. Müller'),
]
export const STUDENTS: Record<string, { name: string; courses: string[] }> = {
  'UE-2024-1001': { name: 'Amelie K.', courses: ['Data Science', 'Business Analytics', 'Digital Marketing'] },
  'UE-2024-1002': { name: 'Jonas R.', courses: ['Decision Support Systems', 'Machine Learning Lab', 'Data Science'] },
  'UE-2024-1003': { name: 'Sara M.', courses: ['UX Design', 'Applied Statistics', 'Project Management'] },
}
