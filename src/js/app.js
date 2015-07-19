/*jslint esnext:true*/
let b = require("./b").b;

/*
      <p>
        Waiting
        <input type="time" max="99:59:59" min="00:00:01" data-b="wait"/>
        between each image means:
      </p>
      <ul>
        <li>
          One second of video at
          <input type="number" data-b="fps">
          fps will represent
          <input type="time" data-b="repr" />.
        </li>

        <li>
          <input type="time" min="00:00:01" value="00:00:30" data-b="final"/>
          of video will need
          <input type="number" data-b="imgs"/>
          images and represent
          <input type="time" min="00:00:01" data-b="finalrepr"/>.<br/>
          Assuming an image is
          <input type="number" data-b="imgsize">&nbsp;MB
          that’ll take
          <input type="number" data-b="finalsize"/>&nbsp;MB.
        </li>
      </ul>
*/



b.bind("repr", ["wait", "fps"], (wait, fps) => fps / wait);
b.bind("fps", ["wait", "repr"], (wait, repr) => repr / wait);

b.bind("imgs", ["final", "fps", "wait"], (finl, fps) => finl * fps);

b.bind("final", ["imgs", "fps", "wait"], (imgs, fps) => imgs / fps);

b.bind("finalsize", ["imgs", "imgsize"], (n, s) => n * s);

b.done();
