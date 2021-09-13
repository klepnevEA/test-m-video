// @ts-nocheck
const paths = {
  src: "./src/", // paths.src
  build: "./build/", // paths.build
};

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps"); /* ?? */
const sassGlob = require("gulp-sass-glob");
const sass = require("gulp-sass");
const groupMediaQueries = require("gulp-group-css-media-queries");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const svgmin = require("gulp-svgmin");
const svgstore = require("gulp-svgstore");
const replace = require("gulp-replace");
const imagemin = require("gulp-imagemin");
const del = require("del");
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const fileinclude = require("gulp-file-include");

function styles() {
  return gulp
    .src(paths.src + "scss/main.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass()) // { outputStyle: 'compressed' }
    .pipe(groupMediaQueries())
    .pipe(autoprefixer({ overrideBrowserslist: ["last 2 version"] }))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("/"))
    .pipe(gulp.dest(paths.build + "css/"));
}

function svgSprite() {
  return gulp
    .src(paths.src + "svg/*.svg")
    .pipe(
      svgmin(function (file) {
        return {
          plugins: [
            {
              cleanupIDs: {
                minify: true,
              },
            },
          ],
        };
      })
    )
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(paths.build + "img/"));
}

function htmls() {
  return gulp
    .src(paths.src + "**/*.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(plumber())
    .pipe(replace(/\n\s*<!--DEV[\s\S]+?-->/gm, ""))
    .pipe(gulp.dest(paths.build));
}

function images() {
  return gulp
    .src(paths.src + "img/**/*.{jpg,jpeg,png,gif,svg}")
    .pipe(imagemin()) // если картинок будет много, то и времени будет уходить много
    .pipe(gulp.dest(paths.build + "img/"));
}

function fonts() {
  return gulp
    .src(paths.src + "fonts/*.*")
    .pipe(gulp.dest(paths.build + "fonts/"));
}

function clean() {
  return del("build/");
}

function scripts() {
  return gulp
    .src(paths.src + "js/modules/*.js")
    .pipe(plumber())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(concat("script.min.js"))
    .pipe(gulp.dest(paths.build + "js/"));
}

function watch() {
  gulp.watch(paths.src + "scss/**/*.scss", styles);
  gulp.watch(paths.src + "**/*.js", scripts);
  gulp.watch(paths.src + "**/*.html", htmls);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: paths.build,
    },
  });
  browserSync.watch(paths.build + "**/*.*", browserSync.reload);
}

exports.styles = styles;
exports.svgSprite = svgSprite;
exports.htmls = htmls;
exports.images = images;
exports.clean = clean;
exports.watch = watch;
exports.fonts = fonts;
exports.scripts = scripts;

gulp.task(
  "default",
  gulp.series(
    clean,
    gulp.parallel(styles, svgSprite, htmls, images, fonts, scripts),
    gulp.parallel(watch, serve)
  )
);
