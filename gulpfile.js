var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    htmlreplace = require("gulp-html-replace"),
    source = require("vinyl-source-stream"),
    browserify = require("browserify"),
    watchify = require("watchify"),
    streamify = require("gulp-streamify"),
    babelify = require("babelify"),
    sass     = require("gulp-sass");


var path = {
  HTML: "src/index.html",
  SASS_SRC: "src/sass/**/*.scss",
  JSMIN: "tc.min.js",
  JS: "tc.js",
  DEST: "dist",
  DEST_BUILD: "dist/build",
  DEST_SRC: "dist/src",
  ENTRY_POINT: "./src/js/app.js"
};

gulp.task("style", function() {
  gulp.src(path.SASS_SRC)
      .pipe(sass().on("error", sass.logError))
      .pipe(gulp.dest("./dist/"));
});

gulp.task("copy", function() {
  gulp.src(path.HTML)
      .pipe(gulp.dest(path.DEST));
});

gulp.task("watch", function() {
  gulp.watch(path.HTML, ["copy"]);
  gulp.watch(path.SASS_SRC, ["style"]);

  var w = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [babelify],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  }));

  w.on("update", function() {
    w
     .bundle()
     .pipe(source(path.JS))
     .pipe(gulp.dest(path.DEST_SRC));
    console.log("Updated.");
  })
    .bundle()
    .pipe(source(path.JS))
    .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task("build", function() {
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [babelify]
  })
    .bundle()
    .pipe(source(path.JSMIN))
    .pipe(streamify(uglify(path.JSMIN)))
    .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task("replaceHTML", function() {
  gulp.src(path.HTML)
      .pipe(htmlreplace({
        "js": "build/" + path.JSMIN
      }))
      .pipe(gulp.dest(path.DEST));
});

gulp.task("default", ["watch"]);
gulp.task("production", ["replaceHTML", "build", "style"]);
