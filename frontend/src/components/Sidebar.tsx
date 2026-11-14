import { useState } from 'react'
import { Complaint, Room } from '../types'
const CATS = ['AV/Projector Issue', 'AC/Heating', 'Locked Room', 'Schedule Mismatch', 'Overcrowding']
type P = { rooms: Room[]; occupied: number; complaints: Complaint[]; onSubmit: (c: { room: string; cat: string; txt: string }) => void }
export default function Sidebar({ rooms, occupied, complaints, onSubmit }: P) {
  const [f, setF] = useState({ room: 'r202', cat: CATS[0], txt: '' })
  return <aside>
    <div className="card"><h4>Live floor info</h4><div>{occupied} occupied · {rooms.length - occupied} available</div></div>
    <div className="card" style={{ marginTop: 12 }}><h4>Campus notices & facility alerts</h4>
      {complaints.filter(c => c.st !== 'Resolved').map(c => <div key={c.id}>⚠ {rooms.find(r => r.id === c.room)?.name}: {c.cat} <small className="mut">({c.st})</small></div>)}
      <h4 style={{ marginTop: 12 }}>Report an issue</h4>
      <div className="row">
        <select value={f.room} onChange={e => setF({ ...f, room: e.target.value })}>{rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
        <select value={f.cat} onChange={e => setF({ ...f, cat: e.target.value })}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
        <textarea placeholder="Short description" value={f.txt} onChange={e => setF({ ...f, txt: e.target.value })} />
        <button className="pri" onClick={() => { onSubmit(f); setF({ ...f, txt: '' }) }}>Submit</button></div></div>
  </aside>
}
