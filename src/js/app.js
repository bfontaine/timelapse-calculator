/*jslint esnext:true*/
let React = require("react/addons");

var TimelapseCalculator = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: () => ({
    wait_hh: 0,
    wait_mm: 0,
    wait_ss: 0,

    /*
    interval: new time.Interval(),
    fps: {value: 0},
    real_duration_1s: new time.Duration(),
    total_images: {value: 0},
    final_duration: new time.Duration(0, 0, 30),
    final_real_duration: new time.Duration(0, 0, 0),
    img_size: new FileSize(0),
    final_size: new FileSize(0),
*/
  }),

  // WIP
  render: function() {
    return (
    <div class="calculator">
      <p>
        Waiting <input type="number" class="duration duration-hh"
                       valueLink={this.linkState("wait_hh")} /> hours,
                <input type="number" class="duration duration-mm"
                       valueLink={this.linkState("wait_mm")} /> minutes,
                <input type="number" class="duration duration-ss"
                       valueLink={this.linkState("wait_ss")} /> seconds
        between each image means:
      </p>
      <ul>
        <li>
          One second of video at <input type="number" class="fps"
                                        valueLink={this.linkState("fps")} />
          fps will represent
            <input type="number" class="duration duration-hh"
                   valueLink={this.linkState("equiv1sec_hh")} /> hours,
            <input type="number" class="duration duration-mm"
                   valueLink={this.linkState("equiv1sec_mm")} /> minutes,
            <input type="number" class="duration duration-ss"
                   valueLink={this.linkState("equiv1sec_ss")} /> seconds.
        </li>
      </ul>
    </div>
    )
  }
});

React.render(<TimelapseCalculator/>, document.getElementById("app"));
