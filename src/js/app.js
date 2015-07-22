/*jslint esnext:true*/

class State {
  constructor() {
    this.vals = {};
  }

  set(k, v) {
    this.vals[k] = v;
  }

  get(k) {
    return this.vals[k];
  }

  getAll() {
    return this.vals;
  }

  refresh() {
    this.set("repr", this.get("fps") * this.get("wait"));
    this.set("imgs", this.get("fps") * 30);
    this.set("finalrepr", this.get("repr") * 30);
  }
}

class View {
  constructor(prefix="b") {
    let attr = `data-${prefix}`;
    this.els = {};

    [].forEach.call(document.querySelectorAll(`[${attr}]`), (e) => {
      this.els[e.getAttribute(attr)] = e;
    });
  }

  update(vals) {
    for (let k in vals) {
      if (!vals.hasOwnProperty(k)) { continue; }
      let el = this.els[k];
      if (!el) { continue; }
      let v = vals[k];

      if (el.type == "time") {
        let h, m, s, t;
        s = v%60;
        m = (0|v/60)%60;
        h = (0|v/3600);

        t  = (h < 10 ? "0" : "") + h + ":";
        t += (m < 10 ? "0" : "") + m + ":";
        t += (s < 10 ? "0" : "") + s;
        v = t;
      }

      el.value = v;
    }
  }

  get(k) {
    let el = this.els[k];
    if (!el) { return 0; }

    let v = el.value;

    if (el.type == "time") {
      let [h, m, s] = v.split(":");
      v = parseInt(h, 10) * 3600 + parseInt(m, 10) * 60;

      if (s > 0) {
        v += s;
      }
    }

    return +v;
  }
}

class Controller {
  constructor(viewPrefix="b") {
    this.state = new State();
    this.view = new View(viewPrefix);
  }

  read(k) {
    this.state.set(k, this.view.get(k));
  }

  update(k=null) {
    if (k) {
      this.read(k);
    }

    this.state.refresh();
    this.view.update(this.state.getAll());
  }

  init() {
    this.state.set("wait", 15);
    this.state.set("fps", 24);
    this.update();
    return this;
  }
}

let c = new Controller("b").init();

["wait", "fps"].forEach(k =>
  document.getElementById(k).addEventListener("change", () => c.update(k), false));
