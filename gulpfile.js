const { src, dest, watch, parallel, series } = require('gulp');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const changed = require('gulp-changed');

const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');

const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const groupMedia = require('gulp-group-css-media-queries');

const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');

const svgSprite = require('gulp-svg-sprite');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;

// сборка в режиме разработки

function html() {
  return src('./src/*.html')
    .pipe(changed('./dev/', { hasChanged: changed.compareContents }))
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest('./dev/'))
    .pipe(browserSync.stream())
}

function styles() {
  return src('./src/scss/**/*.scss')
    .pipe(changed('./dev/css/*.css'))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dev/css/'))
    .pipe(browserSync.stream())
}

function scripts() {
  return src('./src/js/components/*.js')
    .pipe(changed('./dev/js/'))
    .pipe(concat('main.js'))
    .pipe(dest('./dev/js/'))
    .pipe(browserSync.stream())
    .pipe(src('./src/js/vendor/*.js'))
    .pipe(changed('./dev/js/'))
    .pipe(concat('vendor.js'))
    .pipe(dest('./dev/js/'))
    .pipe(browserSync.stream())
}

function images() {
  return src('./src/images/*')
    .pipe(changed('./dev/images/'))
    .pipe(webp())
    .pipe(dest('./dev/images/'))
    .pipe(src(['./src/images/*', './src/images/svg/*.svg'], { base: './src/images/' }))
    .pipe(dest('./dev/images/'))
    .pipe(browserSync.stream())
}

function svgSprites() {
  return src('./src/images/svg/sprite/*.svg')
    .pipe(changed('./dev/images/sprite.svg'))
    .pipe(imagemin({ verbose: true }))
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }))
    .pipe(dest('./dev/images/'))
    .pipe(browserSync.stream())
}

function fonts() {
  return src('./src/fonts/**/*')
    .pipe(changed('./dev/fonts/'))
    .pipe(ttf2woff())
    .pipe(dest('./dev/fonts/'))
    .pipe(src('./src/fonts/**/*'))
    .pipe(changed('./dev/fonts/'))
    .pipe(ttf2woff2())
    .pipe(dest('./dev/fonts/'))
    .pipe(browserSync.stream())
}

function cleanDev() {
  return src('./dev/')
    .pipe(clean())
    .pipe(dest('./dev/'))
}

function watching() {
  browserSync.init({
    server: {
      baseDir: './dev/'
    },
  });
  watch('./src/*.html', html)
  watch('./src/partials/*.html', html)
  watch('./src/scss/**/*.scss', styles)
  watch('./src/js/**/*.js', scripts)
  watch(['./src/images/*', './src/images/svg/*'], images)
  watch('./src/images/svg/sprite/*.svg', svgSprites)
  watch('./src/fonts/**/*', fonts)
}

exports.default = series(cleanDev, parallel(html, styles, scripts, images, fonts, svgSprites), watching);

// продакшн-сборка

function htmlDocs() {
  return src('./dev/*.html')
    .pipe(htmlclean())
    .pipe(dest('./docs/'))
}

function stylesDocs() {
  return src('./dev/css/main.css')
    .pipe(groupMedia())
    .pipe(autoprefixer({
      "overrideBrowserslist": [
        "last 5 version"
      ],
      cascade: false,
    }))
    .pipe(csso())
    .pipe(dest('./docs/css/'))
    .pipe(src('./dev/css/vendor.css'))
    .pipe(csso())
    .pipe(dest('./docs/css/'))
}

function scriptsDocs() {
  return src('./dev/js/main.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(dest('./docs/js/'))
    .pipe(src('./dev/js/vendor.js'))
    .pipe(dest('./docs/js/'))
}

function imagesDocs() {
  return src(['./dev/images/*', '!./dev/images/*.webp', './dev/images/svg/*.svg'], { base: './dev/images/' })
    .pipe(imagemin({ verbose: true }))
    .pipe(dest('./docs/images/'))
}

function copyImg() {
  return src('./dev/images/*.webp')
    .pipe(dest('./docs/images/'))
}

function copyFonts() {
  return src('./dev/fonts/*')
    .pipe(dest('./docs/fonts/'))
}

function cleanDocs() {
  return src('./docs/')
    .pipe(clean())
    .pipe(dest('./docs/'))
}

exports.build = series(cleanDocs, htmlDocs, stylesDocs, scriptsDocs, imagesDocs, copyImg, copyFonts);
