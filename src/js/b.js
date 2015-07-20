/*jslint esnext:true*/
class B {
  constructor() {
    this.elements = {};
    this.deps = {}; // dependencies
    this.revdeps = {}; // dependencees
    this.fns = {};

    this._digest = {};
  }

  _get(name) {
    let el = this.elements[name];
    if (!el) {
      console.log("unknown", name);
      return 0;
    }

    console.log("get", name, el.value);

    if (el.type == "time") {
      let [h, m, s] = el.value.split(":");
      if (h === "") {
        // XXX shouldn't happen
        return 1;
      }
      console.log("-->", 3600*parseInt(h, 10) + 60*parseInt(m, 10) + parseInt(s, 10));
      return 3600*parseInt(h, 10) + 60*parseInt(m, 10) + parseInt(s, 10);
    }

    console.log("-->", +el.value);
    return +el.value;
  }

  _set(name, v) {
    console.log("set", name, v);
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
    if (this._digest[name]) {
      console.log(`not recomputing ${name}, already done`);
      return;
    }

    console.log("recompute", name, "<=", this.deps[name]);
    if (n > 10) {
      throw `max recomputations number exhausted on ${name}`;
    }

    let deps = this.deps[name] || [];
    let vals = deps.map((d) => this._get(d));
    let newval = this.fns[name].apply(null, vals);
    let before = this._get(name);

    this._digest[name] = true;

    if (before != newval) {
      this._set(name, newval);
      this._changed(name, n+1);
    }
  }

  _changed(name, n) {
    console.log("changed", name, "=>", this.revdeps[name]);
    let revdeps = this.revdeps[name] || [];
    revdeps.forEach((rd) => this._recompute(rd, n));
  }

  digest(name) {
    this._digest = {};
    this._digest[name] = true;
    this._changed(name, 0);
    this._digest = {};
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
    let t = this;

    [].forEach.call(document.querySelectorAll("[data-b]"), (el) => {
      let name = el.getAttribute("data-b");
      this.elements[name] = el;

      el.addEventListener("change",
        (e) => setTimeout(() => t.digest(name), 0),
        false
      );
    });
  }
}

exports.b = new B();
