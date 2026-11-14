import { useState } from 'react'
import { Room, Slot } from '../types'
import { DAYS, fmt } from '../lib/engine'
type P = { slots: Slot[]; rooms: Room[]; day: number; min: number; onReport: (room: string) => void }
export default function StaffPanel({ slots, rooms, day, min, onReport }: P) {
  const [prof, setProf] = useState('')
  return <main style={{ padding: 20 }} className="card"><h3>Staff / Professor view</h3>
    <select value={prof} onChange={e => setProf(e.target.value)}><option value="">All professors</option>{[...new Set(slots.map(s => s.prof))].map(x => <option key={x}>{x}</option>)}</select>
    <table><tbody>{slots.filter(s => !prof || s.prof === prof).sort((a, b) => a.day - b.day || a.s - b.s).map(s => <tr key={s.id}>
      <td>{DAYS[s.day - 1]}</td><td>{fmt(s.s)}–{fmt(s.e)}</td><td>{s.course}</td><td>{rooms.find(r => r.id === s.room)?.name}</td>
      <td>{day === s.day && min >= s.s && min < s.e ? '🔴 Live' : ''}</td><td><button onClick={() => onReport(s.room)}>Report delay</button></td></tr>)}</tbody></table></main>
}
