import { Room, Slot, Start } from '../types'
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
export const p = (s: string) => { const [a, b] = s.split(':').map(Number); return a * 60 + b }
export const fmt = (m: number) => { const h = Math.floor(m / 60); return `${h % 12 || 12}:${String(m % 60).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}` }
export const cur = (slots: Slot[], room: string, day: number, min: number) => slots.find(s => s.room === room && s.day === day && min >= s.s && min < s.e)
export const capOf = (r: Room, merged: boolean) => (r.id === 'room2' ? (merged ? 50 : 25) : r.cap)
export const nextWindow = (slots: Slot[], room: string, day: number, min: number) => {
  const busy = slots.filter(s => s.room === room && s.day === day).sort((a, b) => a.s - b.s)
  let c = Math.max(min, 480)
  for (const b of busy) { if (b.e <= c) continue; if (b.s > c && b.s > min) return `Free ${fmt(c)} – ${fmt(b.s)}`; c = Math.max(c, b.e) }
  return c < 1200 ? `Free from ${fmt(c)} – ${fmt(1200)}` : 'No more free time today'
}
export const buildRoute = (r: Room, st: Start) => {
  const [sx, sy] = st.p, [dx, dy] = r.door
  return {
    pts: [[sx, sy], [dx, 210], [dx, dy]].map(q => q.join(',')).join(' '),
    steps: [`Start at ${st.n}.`, `Walk ${dx >= sx ? 'east' : 'west'} along the main corridor for about ${Math.round(Math.abs(dx - sx) / 10)} m.`, `Turn ${dy < 210 ? 'left' : 'right'} at ${r.name} and enter the door.`],
  }
}
