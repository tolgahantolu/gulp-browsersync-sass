const { dest, watch, src, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const GulpClient = require("gulp");
const browsersync = require("browser-sync").create(); // import and create browsersync for prepare to init

// SASS TASK
function sassTask() {
  // ! sırasıyla; src ile task için dosya konumu belirttik, sass olduğunu belirttik, postcss ve cssnano ile minify ettik,
  return src("./app/scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest("dist", { sourcemaps: "." })); // nokta(.) 'nın anlamı aynı location'a kaydet demek...
}

// JS TASK
function jsTask() {
  return src("./app/js/script.js", { sourcemaps: true })
    .pipe(terser())
    .pipe(dest("dist", { sourcemaps: "." })); // nokta(.) 'nın anlamı aynı location'a kaydet demek...
}

// BROWSERSYNC TASKS (2 function: serve and reload)
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// WATCH TASK
function watchTask() {
  watch("*.html", browsersyncReload);
  watch(
    ["./app/scss/**/*.scss", "./app/js/**/*.js"],
    series(sassTask, jsTask, browsersyncReload)
  );
}

// DEFAULT GULP TASK (FOR RUN)
exports.default = series(
  sassTask,
  jsTask,
  browsersyncServe,
  browsersyncReload,
  watchTask
);
