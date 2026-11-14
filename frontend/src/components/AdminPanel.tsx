import { Complaint, Room, Slot } from '../types'
import { DAYS, fmt, p } from '../lib/engine'
type P = { rooms: Room[]; slots: Slot[]; setSlots: (s: Slot[]) => void; merged: boolean; setMerged: (b: boolean) => void; complaints: Complaint[]; setStatus: (id: number, st: Complaint['st']) => void; occupied: number }
export default function AdminPanel({ rooms, slots, setSlots, merged, setMerged, complaints, setStatus, occupied }: P) {
  const upd = (id: number, patch: Partial<Slot>) => setSlots(slots.map(x => (x.id === id ? { ...x, ...patch } : x)))
  return <main style={{ padding: 20, display: 'grid', gap: 12 }}>
    <div className="card"><h3>Mergeable classroom</h3><button className="pri" onClick={() => setMerged(!merged)}>{merged ? 'Merged Mode (45+ Capacity) → switch to Split' : 'Split Mode (2 Rooms) → switch to Merged'}</button>
      <p className="mut">Live occupancy: {occupied}/{rooms.length} rooms in use.</p></div>
    <div className="card"><h3>Weekly schedule</h3><table><tbody>{slots.map(s => <tr key={s.id}>
      <td>{DAYS[s.day - 1]}</td><td>{fmt(s.s)}–{fmt(s.e)}</td><td>{s.course}</td>
      <td><select value={s.room} onChange={e => upd(s.id, { room: e.target.value })}>{rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></td>
      <td><input value={s.prof} onChange={e => upd(s.id, { prof: e.target.value })} /></td></tr>)}</tbody></table>
      <button onClick={() => setSlots([...slots, { id: Date.now(), day: 1, s: p('08:00'), e: p('09:30'), room: 'r202', course: 'New Course', prof: 'TBA' }])}>+ Add class</button></div>
    <div className="card"><h3>Student complaints</h3><table><tbody>{complaints.map(c => <tr key={c.id}><td>{rooms.find(r => r.id === c.room)?.name}</td><td>{c.cat}</td><td>{c.txt}</td>
      <td><select value={c.st} onChange={e => setStatus(c.id, e.target.value as Complaint['st'])}>{['Pending', 'In Progress', 'Resolved'].map(s => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div>
  </main>
}
