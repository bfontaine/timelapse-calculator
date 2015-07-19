var gulp = require("gulp"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    react = require("gulp-react"),
    htmlreplace = require("gulp-html-replace");

var path = {
  HTML: "src/index.html",
  JS: ["src/js/*.js", "src/**/*.js"],
  ALL: ["src/js/*.js", "src/js/**/*.js", "src/index.html"],
  DEST_MIN: "tc.min.js",
  DEST_SRC: "dist/src",
  DEST_BUILD: "dist/build",
  DEST: "dist"
};

gulp.task("transform", function() {
  gulp.src(path.JS)
      .pipe(react())
      .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task("copy", function() {
  gulp.src(path.HTML)
      .pipe(gulp.dest(path.DEST));
});

gulp.task("watch", function() {
  gulp.watch(path.ALL, ["transform", "copy"]);
});

gulp.task("build", function() {
  gulp.src(path.JS)
      .pipe(react())
      .pipe(concat(path.DEST_MIN))
      .pipe(uglify(path.DEST_MIN))
      .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task("replaceHTML", function() {
  gulp.src(path.HTML)
      .pipe(htmlreplace({
        "js": "build/" + path.DEST_MIN
      }))
      .pipe(gulp.dest(path.DEST));
});

gulp.task("default", ["watch"]);
gulp.task("production", ["replaceHTML", "build"]);
