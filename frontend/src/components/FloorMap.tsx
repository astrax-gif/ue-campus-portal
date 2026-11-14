import { Room, Start } from '../types'
type P = { rooms: Room[]; status: (r: Room) => string; recommended: string[]; merged: boolean; route: { pts: string; steps: string[] } | null; starts: Record<string, Start>; from: string; setFrom: (k: string) => void; onPick: (id: string) => void; onClear: () => void }
export default function FloorMap({ rooms, status, recommended, merged, route, starts, from, setFrom, onPick, onClear }: P) {
  const [sx, sy] = starts[from].p
  const col = (s: string) => (s === 'Free' ? 'free' : s === 'Taken' ? 'busy' : 'mine')
  return <div className="card">
    <div className="row"><b>You are here:</b>
      <select value={from} onChange={e => setFrom(e.target.value)}>{Object.entries(starts).map(([k, v]) => <option key={k} value={k}>{v.n}</option>)}</select>
      {route && <button onClick={onClear}>Clear route</button>}</div>
    <svg className="map" viewBox="0 0 800 400">
      <rect x="0" y="180" width="800" height="60" fill="var(--bd)" />
      {rooms.map(r => <g key={r.id} className="room" onClick={() => onPick(r.id)}>
        <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="12" fill={`var(--${col(status(r))})`} fillOpacity=".55" stroke={recommended.includes(r.id) ? '#facc15' : 'var(--tx)'} strokeWidth={recommended.includes(r.id) ? 4 : 1} />
        {r.id === 'room2' && !merged && <line x1={r.x + r.w / 2} y1={r.y} x2={r.x + r.w / 2} y2={r.y + r.h} stroke="var(--tx)" strokeDasharray="6" />}
        <text x={r.x + 10} y={r.y + 24} fill="var(--tx)" fontSize="13" fontWeight="700">{r.name}</text></g>)}
      {route && <polyline className="route" points={route.pts} />}
      <circle className="pulse" cx={sx} cy={sy} r="10" fill="var(--mine)" />
      <circle cx={sx} cy={sy} r="6" fill="var(--mine)" stroke="#fff" strokeWidth="2" />
    </svg>
    {route && <ol>{route.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>}
  </div>
}
