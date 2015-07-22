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
    this.els = {};

    [].forEach.call(document.querySelectorAll(`[data-${prefix}]`), (e) => {
      this.els[e.getAttribute(`data-${prefix}`)] = e;
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

  update() {
    this.state.refresh();
    this.view.update(this.state.getAll());
  }
}

let c = new Controller("b");

c.state.set("wait", 15);
c.state.set("fps", 24);
c.update();

function listenForChange(el, callback) {
  el.addEventListener("change", callback, false);
  // add other events here
}

listenForChange(document.getElementById("wait"), () => {
  c.read("wait");
  c.update();
});

listenForChange(document.getElementById("fps"), () => {
  c.read("fps");
  c.update();
});

window.c = c;
