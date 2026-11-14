import { Room, Slot } from '../types'
import { fmt } from '../lib/engine'
type P = { rooms: Room[]; status: (r: Room) => string; cur: (r: Room) => Slot | undefined; win: (r: Room) => string; cap: (r: Room) => number; recommended: string[]; min: number; merged: boolean; onPick: (id: string) => void }
export default function RoomCards({ rooms, status, cur, win, cap, recommended, min, merged, onPick }: P) {
  return <div className="cards">{rooms.map(r => { const c = cur(r), s = status(r); return (
    <div key={r.id} className="flip" onClick={() => onPick(r.id)}><div className="fi">
      <div className="fa"><div className="ic">{r.icon}</div><b>{r.name}</b> <span className={`pill ${s}`}>{s}</span>
        {recommended.includes(r.id) && <span className="badge"> Best match</span>}
        {c && <><div className="mut">{c.course} · {c.prof}</div><div className="bar"><i style={{ width: `${((min - c.s) / (c.e - c.s)) * 100}%` }} /></div><small>{fmt(c.s)}–{fmt(c.e)} · Free in {c.e - min} mins</small></>}
        <div><small>{win(r)}</small></div></div>
      <div className="fb"><b>Capacity {cap(r)}</b>{r.id === 'room2' && <div>{merged ? 'Merged: 2-in-1' : 'Split: 2 rooms'}</div>}
        <div>{r.av.join(' · ')}</div><div className="mut">🔊 {r.noise}</div><small>Click for photo & details</small></div>
    </div></div>) })}</div>
}
