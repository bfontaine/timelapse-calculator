/*jslint esnext:true*/
class View {
  constructor(prefix) {
    this.els = {};
    this.listeners = [];
    [].forEach.call(document.querySelectorAll(`[data-${prefix}]`), (e) => {
      let name = e.getAttribute(`data-${prefix}`);
      this.els[name] = e;
      e.addEventListener("change", (ev) => {
        this._onchange(name, e, ev);
      }, false);
    });
  }

  apply(vals) {
    for (let k in vals) {
      let e = this.els[k];
      if (e) {
        e.value = vals[k];
      }
    }
  }

  _onchange(name, e, ev) {
    this.listeners.forEach((l) => {
      l.call(v, name, e.value);
    });
  }

  onchange(callback) {
    this.listeners.push(callback);
  }
}

class Model {
  constructor(d) {
    this.vals = d;
    this.bindings = {};
  }

  set(name, v) {
    this.vals[name] = v;
    this._refresh(name);
  }

  bind(name, deps, fn) {
    this.bindings[name] = [deps, fn];
  }

  _refresh(name) {
    // not optimized for now
    for (let k in this.bindings) {
      let [deps, fn] = this.bindings[k];
      if (deps.indexOf(name) == -1) { return; }

      this.vals[k] = fn.apply(null, deps.map(d => this.vals[d]));
    }
  }
}

class Controller {
  constructor(m, v) {
    this.model = m;
    this.view = v;

    this.view.onchange((n, v) => this.onchange(n, v));
  }

  onchange(name, value) {
    this.model.set(name, value);
    this.refresh();
  }

  refresh() {
    this.view.apply(this.model.vals);
  }
}

function time2number(t) {
  let [h, m, s] = t.split(":");
  let n = parseInt(h, 10) * 3600 + parseInt(m, 10) * 60;

  if (s > 0) {
    n += s;
  }

  return n;
}

function number2time(n) {
  let h, m, s, t;
  s = n%60;
  m = (0|n/60)%60;
  h = (0|n/3600);

  t  = (h < 10 ? "0" : "") + h + ":";
  t += (m < 10 ? "0" : "") + m + ":";
  t += (s < 10 ? "0" : "") + s;
  return t;
}

let m = new Model({
      wait: "00:00:15",
      fps: 24,
      "final": "00:00:30",
    }),
    v = new View("b"),
    c = new Controller(m, v);

m.bind("repr", ["wait", "fps"], (wait, fps) =>
  number2time(time2number(wait) * fps));

m.bind("finalrepr", ["repr", "final"], (repr, finl) =>
  number2time(time2number(finl) * repr));

/*
m.bind("imgs", ["final", "fps"], (finl, fps) =>
  number2time(time2number(finl) * fps));
*/

c.refresh();
