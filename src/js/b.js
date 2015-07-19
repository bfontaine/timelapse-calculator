/*jslint esnext:true*/
class B {
  constructor() {
    this.elements = {};
    this.deps = {}; // dependencies
    this.revdeps = {}; // dependencees
    this.fns = {};
  }

  _get(name) {
    let el = this.elements[name];
    if (!el) {
      return 0;
    }

    if (el.type == "time") {
      let [h, m, s] = el.value.split(":");
      if (h === "") {
        // XXX shouldn't happen
        return 1;
      }
      return 3600*parseInt(h, 10) + 60*parseInt(m, 10) + parseInt(s, 10);
    }

    return +el.value;
  }

  _set(name, v) {
    let el = this.elements[name];
    if (!el) {
      return;
    }

    if (el.type == "time") {
      let s = 0|(v%60),
          m = (0|v/60)%60,
          h = (0|v/3600);

      s = s < 10 ? `0${s}` : `${s}`;
      m = m < 10 ? `0${m}` : `${m}`;
      h = h < 10 ? `0${h}` : `${h}`;

      el.value = `${h}:${m}:${s}`;
      return;
    }

    el.value = v;
  }

  _recompute(name, n) {
    if (n > 1000) {
      throw `max recomputations number exhausted on ${name}`;
    }

    let deps = this.deps[name] || [];
    let vals = deps.map((d) => this._get(d));
    let newval = this.fns[name](vals);
    let before = this._get(name);

    if (before != newval) {
      this._set(name, this.fns[name](vals));
      this._changed(name, n+1);
    }
  }

  _changed(name, n) {
    let revdeps = this.revdeps[name] || [];
    revdeps.forEach((rd) => this._recompute(rd, n));
  }

  bind(binded, deps, fn) {
    this.deps[binded] = deps;

    deps.forEach((d) => {
      if (!(d in this.revdeps)) {
        this.revdeps[d] = [];
      }
      this.revdeps[d].push(binded);
    });

    this.fns[binded] = fn;
  }

  done() {
    [].forEach.call(document.querySelectorAll("[data-b]"), (el) => {
      let name = el.getAttribute("data-b");
      this.elements[name] = el;

      el.addEventListener("change", () => {
        this._changed(name, 0);
      }, false);
    });
  }
}

exports.b = new B();
