import { useEffect, useMemo, useState } from 'react'
import { ROOMS, SLOTS as S0, STARTS, STUDENTS, p, Room, Slot } from './data'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const t = (m: number) => { const h = Math.floor(m / 60); return `${h % 12 || 12}:${String(m % 60).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}` }
type Complaint = { id: number; room: string; cat: string; txt: string; st: 'Pending' | 'In Progress' | 'Resolved' }
const CATS = ['AV/Projector Issue', 'AC/Heating', 'Locked Room', 'Schedule Mismatch', 'Overcrowding']

export default function App() {
  const [dark, setDark] = useState(true)
  const [role, setRole] = useState<'Student' | 'Staff' | 'Admin'>('Student')
  const [sim, setSim] = useState(false)
  const [now, setNow] = useState(new Date())
  const [simDay, setSimDay] = useState(1)
  const [simMin, setSimMin] = useState(p('15:00'))
  const [slots, setSlots] = useState<Slot[]>(S0)
  const [merged, setMerged] = useState(true)
  const [from, setFrom] = useState(new URLSearchParams(location.search).get('from') || 'entrance')
  const [target, setTarget] = useState<string | null>(null)
  const [mat, setMat] = useState('')
  const [me, setMe] = useState<string | null>(null)
  const [need, setNeed] = useState(0)
  const [flipped, setFlipped] = useState<string | null>(null)
  const [freeOnly, setFreeOnly] = useState(false)
  const [prof, setProf] = useState('')
  const [cs, setCs] = useState<Complaint[]>([{ id: 1, room: 'r204', cat: 'AV/Projector Issue', txt: 'Projector flickers', st: 'In Progress' }])
  const [form, setForm] = useState({ room: 'r202', cat: CATS[0], txt: '' })

  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i) }, [])
  useEffect(() => { document.documentElement.dataset.t = dark ? 'dark' : 'light' }, [dark])

  const day = sim ? simDay : now.getDay()
  const min = sim ? simMin : now.getHours() * 60 + now.getMinutes()
  const cap = (r: Room) => (r.id === 'room2' ? (merged ? 50 : 25) : r.cap)
  const cur = (r: Room) => slots.find(s => s.room === r.id && s.day === day && min >= s.s && min < s.e)
  const mine = useMemo(() => {
    const st = me ? STUDENTS[me] : null
    if (!st) return null
    const today = slots.filter(s => s.day === day && st.courses.includes(s.course)).sort((a, b) => a.s - b.s)
    const c = today.find(s => min >= s.s && min < s.e), n = today.find(s => s.s > min)
    const s = c || n
    return { st, slot: s, text: c ? `In Progress — Started ${min - c.s} mins ago` : n ? `Upcoming — Starts in ${n.s - min} mins` : 'No more classes today' }
  }, [me, slots, day, min])
  const status = (r: Room) => (mine?.slot?.room === r.id ? 'Yours' : cur(r) ? 'Taken' : 'Free')
  const nextWindow = (r: Room) => {
    const busy = slots.filter(s => s.room === r.id && s.day === day).sort((a, b) => a.s - b.s)
    let c = Math.max(min, 480)
    for (const b of busy) { if (b.e <= c) continue; if (b.s > c && c < 1200 && b.s > min) return `Free ${t(c)} – ${t(b.s)}`; c = Math.max(c, b.e) }
    return c < 1200 ? `Free from ${t(c)} – ${t(1200)}` : 'No more free time today'
  }
  const route = useMemo(() => {
    const r = ROOMS.find(x => x.id === target); if (!r) return null
    const [sx, sy] = STARTS[from].p, [dx, dy] = r.door
    const pts = [[sx, sy], [dx, 210], [dx, dy]]
    const m = Math.round(Math.abs(dx - sx) / 10)
    return { pts: pts.map(q => q.join(',')).join(' '), steps: [
      `Start at ${STARTS[from].n}.`, `Walk ${dx >= sx ? 'east' : 'west'} along the main corridor for about ${m} m.`,
      `Turn ${dy < 210 ? 'left' : 'right'} at ${r.name} and enter the door.`] }
  }, [target, from])
  const recommended = need > 45 ? ['room2', 'theater'] : []
  const shown = ROOMS.filter(r => (!freeOnly || !cur(r)) && (!need || cap(r) >= need || recommended.includes(r.id)))
  const go = (id: string) => setTarget(id)
  const lookup = (v: string) => { setMat(v); setMe(STUDENTS[v.trim().toUpperCase()] ? v.trim().toUpperCase() : null) }

  return (<>
    <header className="top">
      <div className="logo"><b>UE</b>Campus Portal</div>
      <select value={role} onChange={e => setRole(e.target.value as any)}>{['Student', 'Staff', 'Admin'].map(r => <option key={r}>{r}</option>)}</select>
      <div className="sp" />
      <b>{sim ? `${DAYS[simDay - 1]} ${t(simMin)}` : now.toLocaleTimeString()}</b>
      <button className={sim ? 'on' : ''} onClick={() => setSim(!sim)}>{sim ? 'Simulate Day & Time' : 'Live Clock'}</button>
      {sim && <>
        <select value={simDay} onChange={e => setSimDay(+e.target.value)}>{DAYS.map((d, i) => <option key={d} value={i + 1}>{d}</option>)}</select>
        <input type="range" min={480} max={1200} step={5} value={simMin} onChange={e => setSimMin(+e.target.value)} />
      </>}
      <button onClick={() => setDark(!dark)}>{dark ? '☀ Light' : '🌙 Dark'}</button>
    </header>

    {role === 'Student' && <div className="hero">
      <input placeholder="Matriculation number" value={mat} onChange={e => lookup(e.target.value)} />
      {Object.keys(STUDENTS).map(k => <button key={k} className="chip" onClick={() => lookup(k)}>{k}</button>)}
      <input type="number" placeholder="Group size" style={{ width: 110 }} onChange={e => setNeed(+e.target.value)} />
      <label><input type="checkbox" checked={freeOnly} onChange={e => setFreeOnly(e.target.checked)} /> Free only</label>
    </div>}

    {role === 'Student' && <main className="grid">
      <section>
        {mine && <div className="card" style={{ marginBottom: 12 }}>
          <h4>Hi {mine.st.name} — My Class</h4>
          {mine.slot ? <div>{ROOMS.find(r => r.id === mine.slot!.room)!.name} · <b>{mine.slot.course}</b> · {mine.slot.prof}</div> : null}
          <div className="mut">{mine.text}</div>
          {mine.slot && <button className="pri" onClick={() => go(mine.slot!.room)}>Navigate to My Class</button>}
        </div>}
        {need > 45 && <div className="card" style={{ marginBottom: 12 }}><span className="badge">Recommended</span> {need}+ people: Room 2 merges two classrooms into one to fit 45+ students{!merged && ' (currently split — ask Admin to merge)'}. The Theater Room also fits large lectures.</div>}
        <div className="card">
          <div className="row"><b>You are here:</b>
            <select value={from} onChange={e => setFrom(e.target.value)}>{Object.entries(STARTS).map(([k, v]) => <option key={k} value={k}>{v.n}</option>)}</select>
            {target && <button onClick={() => setTarget(null)}>Clear route</button>}</div>
          <svg className="map" viewBox="0 0 800 400">
            <rect x="0" y="180" width="800" height="60" fill="var(--bd)" />
            {ROOMS.map(r => { const s = status(r); return <g key={r.id} className="room" onClick={() => go(r.id)}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="12" fill={`var(--${s === 'Free' ? 'free' : s === 'Taken' ? 'busy' : 'mine'})`} fillOpacity=".55" stroke={recommended.includes(r.id) ? '#facc15' : 'var(--tx)'} strokeWidth={recommended.includes(r.id) ? 4 : 1} />
              {r.id === 'room2' && !merged && <line x1={r.x + r.w / 2} y1={r.y} x2={r.x + r.w / 2} y2={r.y + r.h} stroke="var(--tx)" strokeDasharray="6" />}
              <text x={r.x + 10} y={r.y + 24} fill="var(--tx)" fontSize="13" fontWeight="700">{r.name}</text></g> })}
            {route && <polyline className="route" points={route.pts} />}
            <circle className="pulse" cx={STARTS[from].p[0]} cy={STARTS[from].p[1]} r="10" fill="var(--mine)" />
            <circle cx={STARTS[from].p[0]} cy={STARTS[from].p[1]} r="6" fill="var(--mine)" stroke="#fff" strokeWidth="2" />
          </svg>
          {route && <ol>{route.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>}
        </div>
        <div className="cards">{shown.map(r => { const c = cur(r), s = status(r); return (
          <div key={r.id} className={`flip ${flipped === r.id ? 'f' : ''}`} onClick={() => { setFlipped(flipped === r.id ? null : r.id); go(r.id) }}>
            <div className="fi">
              <div className="fa"><div className="ic">{r.icon}</div><b>{r.name}</b> <span className={`pill ${s}`}>{s === 'Taken' ? 'Taken' : s}</span>
                {recommended.includes(r.id) && <span className="badge"> Best match</span>}
                {c ? <><div className="mut">{c.course} · {c.prof}</div><div className="bar"><i style={{ width: `${((min - c.s) / (c.e - c.s)) * 100}%` }} /></div><small>{t(c.s)}–{t(c.e)} · Free in {c.e - min} mins</small></> : null}
                <div><small>{nextWindow(r)}</small></div></div>
              <div className="fb"><b>Capacity {cap(r)}</b>{r.id === 'room2' && <div>{merged ? 'Merged: 2-in-1' : 'Split: 2 rooms'}</div>}
                <div>{r.av.join(' · ')}</div><div className="mut">🔊 {r.noise}</div></div>
            </div></div>) })}</div>
      </section>
      <aside>
        <div className="card"><h4>Live floor info</h4>
          <div>{ROOMS.filter(r => cur(r)).length} occupied · {ROOMS.filter(r => !cur(r)).length} available</div></div>
        <div className="card" style={{ marginTop: 12 }}><h4>Campus notices & facility alerts</h4>
          {cs.filter(c => c.st !== 'Resolved').map(c => <div key={c.id}>⚠ {ROOMS.find(r => r.id === c.room)?.name}: {c.cat} <small className="mut">({c.st})</small></div>)}
          <h4 style={{ marginTop: 12 }}>Report an issue</h4>
          <div className="row">
            <select value={form.room} onChange={e => setForm({ ...form, room: e.target.value })}>{ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
            <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
            <textarea placeholder="Short description" value={form.txt} onChange={e => setForm({ ...form, txt: e.target.value })} />
            <button className="pri" onClick={() => { setCs([...cs, { id: Date.now(), ...form, st: 'Pending' }]); setForm({ ...form, txt: '' }) }}>Submit</button></div></div>
      </aside>
    </main>}

    {role === 'Staff' && <main style={{ padding: 20 }} className="card"><h3>Staff / Professor view</h3>
      <select value={prof} onChange={e => setProf(e.target.value)}><option value="">All professors</option>{[...new Set(slots.map(s => s.prof))].map(x => <option key={x}>{x}</option>)}</select>
      <table><tbody>{slots.filter(s => !prof || s.prof === prof).sort((a, b) => a.day - b.day || a.s - b.s).map(s => <tr key={s.id}>
        <td>{DAYS[s.day - 1]}</td><td>{t(s.s)}–{t(s.e)}</td><td>{s.course}</td><td>{ROOMS.find(r => r.id === s.room)!.name}</td>
        <td>{day === s.day && min >= s.s && min < s.e ? '🔴 Live' : ''}</td>
        <td><button onClick={() => setCs([...cs, { id: Date.now(), room: s.room, cat: 'Schedule Mismatch', txt: 'Delay / equipment need reported by staff', st: 'Pending' }])}>Report delay</button></td></tr>)}</tbody></table></main>}

    {role === 'Admin' && <main style={{ padding: 20, display: 'grid', gap: 12 }}>
      <div className="card"><h3>Mergeable classroom</h3><button className="pri" onClick={() => setMerged(!merged)}>{merged ? 'Merged Mode (45+ Capacity) → switch to Split' : 'Split Mode (2 Rooms) → switch to Merged'}</button>
        <p className="mut">Live occupancy: {ROOMS.filter(r => cur(r)).length}/{ROOMS.length} rooms in use.</p></div>
      <div className="card"><h3>Weekly schedule</h3><table><tbody>{slots.map(s => <tr key={s.id}>
        <td>{DAYS[s.day - 1]}</td><td>{t(s.s)}–{t(s.e)}</td><td>{s.course}</td>
        <td><select value={s.room} onChange={e => setSlots(slots.map(x => x.id === s.id ? { ...x, room: e.target.value } : x))}>{ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></td>
        <td><input value={s.prof} onChange={e => setSlots(slots.map(x => x.id === s.id ? { ...x, prof: e.target.value } : x))} /></td></tr>)}</tbody></table>
        <button onClick={() => setSlots([...slots, { id: Date.now(), day: 1, s: p('08:00'), e: p('09:30'), room: 'r202', course: 'New Course', prof: 'TBA' }])}>+ Add class</button></div>
      <div className="card"><h3>Student complaints</h3><table><tbody>{cs.map(c => <tr key={c.id}><td>{ROOMS.find(r => r.id === c.room)?.name}</td><td>{c.cat}</td><td>{c.txt}</td>
        <td><select value={c.st} onChange={e => setCs(cs.map(x => x.id === c.id ? { ...x, st: e.target.value as Complaint['st'] } : x))}>{['Pending', 'In Progress', 'Resolved'].map(s => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div>
    </main>}
    <Chat rooms={ROOMS} cur={cur} nextWindow={nextWindow} />
  </>)
}

function Chat({ rooms, cur, nextWindow }: { rooms: Room[]; cur: (r: Room) => Slot | undefined; nextWindow: (r: Room) => string }) {
  const [open, setOpen] = useState(false), [q, setQ] = useState(''), [log, setLog] = useState<string[]>(['Hi! I\'m the UE Campus Helper.'])
  const ask = () => {
    const s = q.toLowerCase(); let a = 'Try: "Where is Room 202?", "Which rooms are free?" or "Where can 50 students study?"'
    const n = s.match(/(\d+)\s*students|(\d+)\s*people/)
    if (n) { const k = +(n[1] || n[2]); a = k > 45 ? 'Room 2 (Grand Mergeable, 2-in-1) or the Theater Room.' : rooms.filter(r => r.cap >= k).map(r => r.name).join(', ') }
    else if (s.includes('free')) a = rooms.filter(r => !cur(r)).map(r => `${r.name} (${nextWindow(r)})`).join('; ')
    else { const r = rooms.find(r => s.includes(r.name.toLowerCase().replace(/ ·.*/, '')) || s.includes(r.id)); if (r) a = `${r.name}: along the main corridor, ${r.door[1] < 210 ? 'north' : 'south'} side.` }
    setLog([...log, '🧑 ' + q, '🤖 ' + a]); setQ('')
  }
  return <div className="chat card">{open ? <><div className="row"><b>UE Campus Helper</b><span className="sp" /><button onClick={() => setOpen(false)}>×</button></div>
    <div className="msgs">{log.map((l, i) => <div key={i}>{l}</div>)}</div>
    <div className="row"><input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} /><button className="pri" onClick={ask}>Send</button></div></> : <button onClick={() => setOpen(true)}>💬 Campus Helper</button>}</div>
}
