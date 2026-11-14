import { Complaint, Slot, State, Student } from './types'
const j = (url: string, method = 'GET', body?: unknown) =>
  fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }).then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json() })
export const api = {
  state: (): Promise<State> => j('/api/state'),
  student: (id: string): Promise<Student> => j(`/api/students/${id}`),
  addComplaint: (c: Omit<Complaint, 'id' | 'st'>): Promise<Complaint> => j('/api/complaints', 'POST', c),
  setComplaint: (id: number, st: Complaint['st']) => j(`/api/complaints/${id}`, 'PATCH', { st }),
  putSlots: (s: Slot[]) => j('/api/slots', 'PUT', s),
  setMerged: (merged: boolean) => j('/api/config', 'PUT', { merged }),
}
