import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from "postcss-csso"
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import rename from "gulp-rename";
import htmlmin from "gulp-htmlmin";
import terser from "gulp-terser";
import svgo from "gulp-svgmin";
import svgstore from "gulp-svgstore";
import squoash from "gulp-libsquoosh"
// import del from "del";



// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    // .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML
export const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'))
}

// Scripts
export const script = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'))
}

// Images
export const images = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoash())
  .pipe(gulp.dest('build/img'))
}

export const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'))
}

// WebP
export const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoash({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'))
}


// SVG

export const svg = () => {
  return gulp.src('source/img/**/*.svg','!source/img/**/icons/*.svg' )
  .pipe(gulp.svgo())
  .pipe(gulp.dest('build/img'))
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}


export default gulp.series(
  html,styles, script, images, createWebp, server, watcher
);
