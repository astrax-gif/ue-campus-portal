import { DAYS, fmt } from '../lib/engine'
type P = { role: string; setRole: (r: any) => void; sim: boolean; setSim: (b: boolean) => void; now: Date; simDay: number; setSimDay: (n: number) => void; simMin: number; setSimMin: (n: number) => void; dark: boolean; setDark: (b: boolean) => void }
export default function Header(x: P) {
  return <header className="top">
    <div className="logo"><b>UE</b>Campus Portal</div>
    <select value={x.role} onChange={e => x.setRole(e.target.value)}>{['Student', 'Staff', 'Admin'].map(r => <option key={r}>{r}</option>)}</select>
    <div className="sp" />
    <b>{x.sim ? `${DAYS[x.simDay - 1]} ${fmt(x.simMin)}` : x.now.toLocaleTimeString()}</b>
    <button className={x.sim ? 'on' : ''} onClick={() => x.setSim(!x.sim)}>{x.sim ? 'Simulate Day & Time' : 'Live Clock'}</button>
    {x.sim && <><select value={x.simDay} onChange={e => x.setSimDay(+e.target.value)}>{DAYS.map((d, i) => <option key={d} value={i + 1}>{d}</option>)}</select>
      <input type="range" min={480} max={1200} step={5} value={x.simMin} onChange={e => x.setSimMin(+e.target.value)} /></>}
    <button onClick={() => x.setDark(!x.dark)}>{x.dark ? '☀ Light' : '🌙 Dark'}</button>
  </header>
}
