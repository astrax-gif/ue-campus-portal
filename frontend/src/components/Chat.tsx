import { useState } from 'react'
import { Room, Slot } from '../types'
type P = { rooms: Room[]; cur: (r: Room) => Slot | undefined; win: (r: Room) => string }
export default function Chat({ rooms, cur, win }: P) {
  const [open, setOpen] = useState(false), [q, setQ] = useState(''), [log, setLog] = useState(["Hi! I'm the UE Campus Helper."])
  const ask = () => {
    const s = q.toLowerCase(); let a = 'Try: "Where is Room 202?", "Which rooms are free?" or "Where can 50 students study?"'
    const n = s.match(/(\d+)\s*(students|people)/)
    if (n) { const k = +n[1]; a = k > 45 ? 'Room 2 (Grand Mergeable, 2-in-1) or the Theater Room.' : rooms.filter(r => r.cap >= k).map(r => r.name).join(', ') }
    else if (s.includes('free')) a = rooms.filter(r => !cur(r)).map(r => `${r.name} (${win(r)})`).join('; ')
    else { const r = rooms.find(r => s.includes(r.name.toLowerCase().replace(/ ·.*/, '')) || s.includes(r.id)); if (r) a = `${r.name}: along the main corridor, ${r.door[1] < 210 ? 'north' : 'south'} side.` }
    setLog([...log, '🧑 ' + q, '🤖 ' + a]); setQ('')
  }
  return <div className="chat card">{open ? <><div className="row"><b>UE Campus Helper</b><span className="sp" /><button onClick={() => setOpen(false)}>×</button></div>
    <div className="msgs">{log.map((l, i) => <div key={i}>{l}</div>)}</div>
    <div className="row"><input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} /><button className="pri" onClick={ask}>Send</button></div></> : <button onClick={() => setOpen(true)}>💬 Campus Helper</button>}</div>
}
