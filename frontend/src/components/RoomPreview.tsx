import { useState } from 'react'
import { Room, Slot } from '../types'
import { fmt } from '../lib/engine'
type P = { room: Room; status: string; slot?: Slot; cap: number; win: string; onClose: () => void; onNavigate: () => void }
export default function RoomPreview({ room, status, slot, cap, win, onClose, onNavigate }: P) {
  const [bad, setBad] = useState(false)
  return <div className="modal" onClick={onClose}><div className="card pv" onClick={e => e.stopPropagation()}>
    {bad ? <div className="ph">{room.icon}</div> : <img src={room.photo} alt={room.name} onError={() => setBad(true)} />}
    <h3>{room.name} <span className={`pill ${status}`}>{status}</span></h3>
    {slot && <div>{slot.course} · {slot.prof} · {fmt(slot.s)}–{fmt(slot.e)}</div>}
    <div className="mut">{win} · Capacity {cap} · {room.av.join(', ')} · {room.noise}</div>
    <div className="row" style={{ marginTop: 10 }}><button className="pri" onClick={() => { onNavigate(); onClose() }}>Navigate here</button><button onClick={onClose}>Close</button></div>
  </div></div>
}
