import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from './api'
import { Complaint, Slot, State, Student } from './types'
import { buildRoute, capOf, cur, nextWindow } from './lib/engine'
import Header from './components/Header'
import FloorMap from './components/FloorMap'
import RoomCards from './components/RoomCards'
import RoomPreview from './components/RoomPreview'
import Sidebar from './components/Sidebar'
import StaffPanel from './components/StaffPanel'
import AdminPanel from './components/AdminPanel'
import Chat from './components/Chat'

const EMPTY: State = { rooms: [], starts: {}, slots: [], merged: true, complaints: [] }
const SAMPLES = ['UE-2024-1001', 'UE-2024-1002', 'UE-2024-1003']

export default function App() {
  const [data, setData] = useState<State | null>(null)
  const [dark, setDark] = useState(true)
  const [role, setRole] = useState<'Student' | 'Staff' | 'Admin'>('Student')
  const [sim, setSim] = useState(false)
  const [now, setNow] = useState(new Date())
  const [simDay, setSimDay] = useState(1)
  const [simMin, setSimMin] = useState(900)
  const [from, setFrom] = useState(new URLSearchParams(location.search).get('from') || 'entrance')
  const [target, setTarget] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [mat, setMat] = useState('')
  const [me, setMe] = useState<Student | null>(null)
  const [need, setNeed] = useState(0)
  const [freeOnly, setFreeOnly] = useState(false)

  const load = useCallback(() => api.state().then(setData).catch(() => {}), [])
  useEffect(() => { load(); const i = setInterval(load, 15000); return () => clearInterval(i) }, [load])
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i) }, [])
  useEffect(() => { document.documentElement.dataset.t = dark ? 'dark' : 'light' }, [dark])

  const { rooms, starts, slots, merged, complaints } = data ?? EMPTY
  const day = sim ? simDay : now.getDay()
  const min = sim ? simMin : now.getHours() * 60 + now.getMinutes()
  const curOf = (r: { id: string }) => cur(slots, r.id, day, min)
  const winOf = (r: { id: string }) => nextWindow(slots, r.id, day, min)
  const mine = useMemo(() => {
    if (!me) return null
    const today = slots.filter(s => s.day === day && me.courses.includes(s.course)).sort((a, b) => a.s - b.s)
    const c = today.find(s => min >= s.s && min < s.e), n = today.find(s => s.s > min)
    return { slot: c || n, text: c ? `In Progress — Started ${min - c.s} mins ago` : n ? `Upcoming — Starts in ${n.s - min} mins` : 'No more classes today' }
  }, [me, slots, day, min])
  const status = (r: { id: string }) => (mine?.slot?.room === r.id ? 'Yours' : curOf(r) ? 'Taken' : 'Free')
  const route = useMemo(() => { const r = rooms.find(x => x.id === target); return r && starts[from] ? buildRoute(r, starts[from]) : null }, [target, from, rooms, starts])
  const recommended = need > 45 ? ['room2', 'theater'] : []
  const shown = rooms.filter(r => (!freeOnly || !curOf(r)) && (!need || capOf(r, merged) >= need || recommended.includes(r.id)))
  const occupied = rooms.filter(r => curOf(r)).length
  const pv = rooms.find(r => r.id === preview)

  const lookup = (v: string) => { setMat(v); const id = v.trim().toUpperCase(); api.student(id).then(setMe).catch(() => setMe(null)) }
  const setSlots = (s: Slot[]) => { setData({ ...data!, slots: s }); api.putSlots(s) }
  const setMerged = (b: boolean) => { setData({ ...data!, merged: b }); api.setMerged(b) }
  const addComplaint = (c: Omit<Complaint, 'id' | 'st'>) => api.addComplaint(c).then(load)
  const setStatus = (id: number, st: Complaint['st']) => { setData({ ...data!, complaints: complaints.map(c => (c.id === id ? { ...c, st } : c)) }); api.setComplaint(id, st) }

  if (!data) return <p style={{ padding: 20 }}>Loading campus data…</p>
  return <>
    <Header {...{ role, setRole, sim, setSim, now, simDay, setSimDay, simMin, setSimMin, dark, setDark }} />
    {role === 'Student' && <>
      <div className="hero">
        <input placeholder="Matriculation number" value={mat} onChange={e => lookup(e.target.value)} />
        {SAMPLES.map(k => <button key={k} className="chip" onClick={() => lookup(k)}>{k}</button>)}
        <input type="number" placeholder="Group size" style={{ width: 110 }} onChange={e => setNeed(+e.target.value)} />
        <label><input type="checkbox" checked={freeOnly} onChange={e => setFreeOnly(e.target.checked)} /> Free only</label>
      </div>
      <main className="grid"><section>
        {me && <div className="card" style={{ marginBottom: 12 }}><h4>Hi {me.name} — My Class</h4>
          {mine?.slot && <div>{rooms.find(r => r.id === mine.slot!.room)?.name} · <b>{mine.slot.course}</b> · {mine.slot.prof}</div>}
          <div className="mut">{mine?.text}</div>
          {mine?.slot && <button className="pri" onClick={() => setTarget(mine.slot!.room)}>Navigate to My Class</button>}</div>}
        {need > 45 && <div className="card" style={{ marginBottom: 12 }}><span className="badge">Recommended</span> {need}+ people: Room 2 merges two classrooms into one to fit 45+ students{!merged && ' (currently split — ask Admin to merge)'}. The Theater Room also fits large lectures.</div>}
        <FloorMap {...{ rooms, starts, from, setFrom, route, merged, recommended, status }} onPick={setPreview} onClear={() => setTarget(null)} />
        <RoomCards rooms={shown} status={status} cur={curOf} win={winOf} cap={r => capOf(r, merged)} recommended={recommended} min={min} merged={merged} onPick={setPreview} />
      </section>
      <Sidebar rooms={rooms} occupied={occupied} complaints={complaints} onSubmit={addComplaint} /></main></>}
    {role === 'Staff' && <StaffPanel slots={slots} rooms={rooms} day={day} min={min} onReport={room => addComplaint({ room, cat: 'Schedule Mismatch', txt: 'Delay / equipment need reported by staff' })} />}
    {role === 'Admin' && <AdminPanel {...{ rooms, slots, setSlots, merged, setMerged, complaints, setStatus, occupied }} />}
    {pv && <RoomPreview room={pv} status={status(pv)} slot={curOf(pv)} cap={capOf(pv, merged)} win={winOf(pv)} onClose={() => setPreview(null)} onNavigate={() => setTarget(pv.id)} />}
    <Chat rooms={rooms} cur={curOf} win={winOf} />
  </>
}
