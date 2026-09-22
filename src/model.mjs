export const SERAT = [
  ['Asih', 'Welas asih', 'Langkah Cepat'], ['Sabar', 'Kesabaran', 'Pelita: Sorot'],
  ['Jujur', 'Kejujuran', 'Pelita: Baca'], ['Wani', 'Keberanian', 'Pijakan Cahaya'],
  ['Andhap', 'Kerendahan hati', 'Pelita: Kibas'], ['Setya', 'Kesetiaan', 'Terjang Kabut'],
  ['Wicaksana', 'Kebijaksanaan', 'Sorot Jauh']
];
export const RELIEF = [
  { id: 'putri', title: 'Putri di Dhaha', text: 'Candra Kirana hidup di lingkungan kedaton.' },
  { id: 'kutukan', title: 'Keong keemasan', text: 'Kutukan mengubah sang putri menjadi keong emas.' },
  { id: 'mbok', title: 'Pertolongan Mbok', text: 'Mbok Rondo menemukan dan merawat keong itu.' },
  { id: 'pulang', title: 'Cahaya yang pulang', text: 'Kebaikan membuka jalan bagi sang putri untuk kembali.' }
];
export function createState(saved) {
  const s = { version: 1, scene: 'Petirtaan', pelita: false, serat: ['Asih'], kidung: [],
    levers: [false, false, false], water: 0, waiting: 0, sabar: false, jujur: false,
    drained: false, oil: 100, checkpoint: 0, completed: false, attempts: 0 };
  if (saved && saved.version === 1 && saved.scene === s.scene) {
    s.pelita = saved.pelita === true;
    s.sabar = saved.sabar === true; s.jujur = s.sabar && saved.jujur === true;
    s.drained = s.sabar && saved.drained === true;
    s.serat = ['Asih', ...(s.sabar ? ['Sabar'] : []), ...(s.jujur ? ['Jujur'] : [])];
    s.kidung = Array.isArray(saved.kidung) ? [...new Set(saved.kidung.filter(n => n === 4 || n === 5))] : [];
    s.levers = Array.isArray(saved.levers) && saved.levers.length === 3 ? saved.levers.map(v => v === true) : s.levers;
    s.water = s.sabar ? 1 : 0; s.checkpoint = [0,1,2].includes(saved.checkpoint) ? saved.checkpoint : 0;
    s.oil = Number.isFinite(saved.oil) ? Math.max(25, Math.min(100,saved.oil)) : 100;
    s.completed = s.jujur && saved.completed === true;
  }
  return s;
}
export function stepWater(s, dt, stillAtBasin) {
  const filling = s.levers[0] && !s.levers[1] && s.levers[2];
  if (!s.sabar) {
    s.water = Math.max(0, Math.min(1, s.water + (filling ? dt / 8 : -dt / 4)));
    s.waiting = filling && stillAtBasin ? s.waiting + dt : 0;
    if (s.water >= 1 && s.waiting >= 8) {
      s.sabar = true; s.serat.push('Sabar'); s.oil = 100; return 'sabar';
    }
  } else if (!s.levers[0] && s.levers[1] && !s.levers[2]) s.drained = true;
  return null;
}
export function solveRelief(s, order) {
  if (!s.sabar || !s.drained) return 'locked';
  if (order.length === 4 && RELIEF.every((r,i) => r.id === order[i])) {
    if (!s.jujur) s.serat.push('Jujur');
    s.jujur = true; s.oil = 100; return 'solved';
  }
  s.attempts++; return 'flood';
}
export function stepOil(s, dt, shining, inFog, atDamar) {
  s.oil = Math.max(0, Math.min(100, s.oil + (atDamar ? 48 : -(shining ? 3 : 0) - (inFog ? 7 : 0)) * dt));
  return s.oil;
}
export function isLit(px, py, facing, x, y, radius, shining) {
  const dx=x-px, dy=y-py;
  return shining && Math.hypot(dx,dy) <= radius && (Math.abs(dx)<24 || dx*facing >= 0) && Math.abs(dy) < 65;
}
