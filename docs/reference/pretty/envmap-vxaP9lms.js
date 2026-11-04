import { t as e } from "./rolldown-runtime-DK3Fl9T5.js";
import { A as t, B as n, F as r, L as i, R as a, U as o, X as s, s as c } from "./three-BbSp8N3g.js";
var l = e({ RoomEnvironment: () => u }),
  u = class extends s {
    constructor() {
      (super(), (this.name = `RoomEnvironment`), (this.position.y = -3.5));
      let e = new c();
      e.deleteAttribute(`uv`);
      let i = new a({ side: 1 }),
        s = new a(),
        l = new o(16777215, 900, 28, 2);
      (l.position.set(0.418, 16.199, 0.3), this.add(l));
      let u = new r(e, i);
      (u.position.set(-0.757, 13.219, 0.717), u.scale.set(31.713, 28.305, 28.591), this.add(u));
      let f = new t(e, s, 6),
        p = new n();
      (p.position.set(-10.906, 2.009, 1.846),
        p.rotation.set(0, -0.195, 0),
        p.scale.set(2.328, 7.905, 4.651),
        p.updateMatrix(),
        f.setMatrixAt(0, p.matrix),
        p.position.set(-5.607, -0.754, -0.758),
        p.rotation.set(0, 0.994, 0),
        p.scale.set(1.97, 1.534, 3.955),
        p.updateMatrix(),
        f.setMatrixAt(1, p.matrix),
        p.position.set(6.167, 0.857, 7.803),
        p.rotation.set(0, 0.561, 0),
        p.scale.set(3.927, 6.285, 3.687),
        p.updateMatrix(),
        f.setMatrixAt(2, p.matrix),
        p.position.set(-2.017, 0.018, 6.124),
        p.rotation.set(0, 0.333, 0),
        p.scale.set(2.002, 4.566, 2.064),
        p.updateMatrix(),
        f.setMatrixAt(3, p.matrix),
        p.position.set(2.291, -0.756, -2.621),
        p.rotation.set(0, -0.286, 0),
        p.scale.set(1.546, 1.552, 1.496),
        p.updateMatrix(),
        f.setMatrixAt(4, p.matrix),
        p.position.set(-2.193, -0.369, -5.547),
        p.rotation.set(0, 0.516, 0),
        p.scale.set(3.875, 3.487, 2.986),
        p.updateMatrix(),
        f.setMatrixAt(5, p.matrix),
        this.add(f));
      let m = new r(e, d(50));
      (m.position.set(-16.116, 14.37, 8.208), m.scale.set(0.1, 2.428, 2.739), this.add(m));
      let h = new r(e, d(50));
      (h.position.set(-16.109, 18.021, -8.207), h.scale.set(0.1, 2.425, 2.751), this.add(h));
      let g = new r(e, d(17));
      (g.position.set(14.904, 12.198, -1.832), g.scale.set(0.15, 4.265, 6.331), this.add(g));
      let _ = new r(e, d(43));
      (_.position.set(-0.462, 8.89, 14.52), _.scale.set(4.38, 5.441, 0.088), this.add(_));
      let v = new r(e, d(20));
      (v.position.set(3.235, 11.486, -12.541), v.scale.set(2.5, 2, 0.1), this.add(v));
      let y = new r(e, d(100));
      (y.position.set(0, 20, 0), y.scale.set(1, 0.1, 1), this.add(y));
    }
    dispose() {
      let e = new Set();
      this.traverse((t) => {
        t.isMesh && (e.add(t.geometry), e.add(t.material));
      });
      for (let t of e) t.dispose();
    }
  };
function d(e) {
  return new i({ color: 0, emissive: 16777215, emissiveIntensity: e });
}
export { l as t };
