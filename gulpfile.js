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

const gulpif = require('gulp-if');
const argv = require('yargs').argv;

function html() {
  return src('./src/*.html')
    .pipe(changed('./docs/', { hasChanged: changed.compareContents }))
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(gulpif(argv.build, htmlclean()))
    .pipe(dest('./docs/'))
    .pipe(browserSync.stream())
}

function styles() {
  return src('./src/scss/**/*.scss')
    .pipe(changed('./docs/css/*.css'))
    .pipe(gulpif(!argv.build, sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(gulpif(argv.build, groupMedia()))
    .pipe(gulpif(argv.build, autoprefixer({
      "overrideBrowserslist": [
        "last 5 version"
      ],
      cascade: false,
    })))
    .pipe(gulpif(argv.build, csso()))
    .pipe(gulpif(!argv.build, sourcemaps.write('.')))
    .pipe(dest('./docs/css/'))
    .pipe(browserSync.stream())
    .pipe(src('./src/css/vendor/*.css'))
    .pipe(changed('./docs/css/'))
    .pipe(dest('./docs/css/'))
    .pipe(browserSync.stream())
}

function scripts() {
  return src('./src/js/components/*.js')
    .pipe(changed('./docs/js/'))
    .pipe(concat('main.js'))
    .pipe(gulpif(argv.build, babel({
      presets: ['@babel/env']
    })))
    .pipe(gulpif(argv.build, uglify()))
    .pipe(dest('./docs/js/'))
    .pipe(browserSync.stream())
    .pipe(src('./src/js/vendor/*.js'))
    .pipe(changed('./docs/js/'))
    .pipe(concat('vendor.js'))
    .pipe(dest('./docs/js/'))
    .pipe(browserSync.stream())
}

function images() {
  return src('./src/images/*')
    .pipe(changed('./docs/images/'))
    .pipe(webp())
    .pipe(dest('./docs/images/'))
    .pipe(src(['./src/images/*', './src/images/svg/*.svg'], { base: './src/images/' }))
    .pipe(changed('./docs/images/'))
    .pipe(gulpif(argv.build, imagemin({ verbose: true })))
    .pipe(dest('./docs/images/'))
    .pipe(browserSync.stream())
}

function svgSprites() {
  return src('./src/images/svg/sprite/*.svg')
    .pipe(gulpif(argv.build, imagemin({ verbose: true })))
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }))
    .pipe(dest('./docs/images/'))
    .pipe(browserSync.stream())
}

function fonts() {
  return src('./src/fonts/**/*')
    .pipe(changed('./docs/fonts/'))
    .pipe(ttf2woff())
    .pipe(dest('./docs/fonts/'))
    .pipe(src('./src/fonts/**/*'))
    .pipe(changed('./docs/fonts/'))
    .pipe(ttf2woff2())
    .pipe(dest('./docs/fonts/'))
    .pipe(browserSync.stream())
}

function cleanDocs() {
  return src('./docs/')
    .pipe(clean())
    .pipe(dest('./docs/'))
}

function watching() {
  browserSync.init({
    server: {
      baseDir: './docs/'
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

exports.default = series(cleanDocs, parallel(html, styles, scripts, images, fonts, svgSprites), watching);
exports.build = series(cleanDocs, parallel(html, styles, scripts, images, fonts, svgSprites));
