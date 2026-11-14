export type Room = { id: string; name: string; x: number; y: number; w: number; h: number; cap: number; door: [number, number]; av: string[]; noise: string; icon: string; photo: string }
export type Slot = { id: number; day: number; s: number; e: number; room: string; course: string; prof: string }
export type Start = { n: string; p: [number, number] }
export type Complaint = { id: number; room: string; cat: string; txt: string; st: 'Pending' | 'In Progress' | 'Resolved' }
export type State = { rooms: Room[]; starts: Record<string, Start>; slots: Slot[]; merged: boolean; complaints: Complaint[] }
export type Student = { name: string; courses: string[] }
