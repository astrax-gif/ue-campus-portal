import express from 'express'
import { ROOMS, STARTS, SLOTS, STUDENTS } from './data'
import { Complaint, Slot } from './types'

// In-memory store (resets on cold start). Swap for Postgres/Redis for persistence.
let slots: Slot[] = [...SLOTS]
let merged = true
let complaints: Complaint[] = [{ id: 1, room: 'r204', cat: 'AV/Projector Issue', txt: 'Projector flickers', st: 'In Progress' }]
const STATUSES = ['Pending', 'In Progress', 'Resolved']

const app = express()
app.use(express.json())
app.get('/api/state', (_q, r) => r.json({ rooms: ROOMS, starts: STARTS, slots, merged, complaints }))
app.get('/api/students/:id', (q, r) => {
  const s = STUDENTS[q.params.id.toUpperCase()]
  s ? r.json(s) : r.status(404).json({ error: 'Unknown matriculation number' })
})
app.post('/api/complaints', (q, r) => {
  const { room, cat, txt } = q.body || {}
  if (!ROOMS.some(x => x.id === room) || !cat) return r.status(400).json({ error: 'room and cat required' })
  const c: Complaint = { id: Date.now(), room, cat: String(cat), txt: String(txt || '').slice(0, 300), st: 'Pending' }
  complaints = [...complaints, c]
  r.status(201).json(c)
})
app.patch('/api/complaints/:id', (q, r) => {
  if (!STATUSES.includes(q.body?.st)) return r.status(400).json({ error: 'invalid status' })
  complaints = complaints.map(c => (c.id === +q.params.id ? { ...c, st: q.body.st } : c))
  r.json(complaints)
})
app.put('/api/slots', (q, r) => { if (!Array.isArray(q.body)) return r.status(400).end(); slots = q.body; r.json(slots) })
app.put('/api/config', (q, r) => { merged = !!q.body?.merged; r.json({ merged }) })
export default app
