const del = require('del');
const browserSync = require('browser-sync');
const gulp = require('gulp');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('gulp-terser');

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const prefix = require('autoprefixer');
const minify = require('cssnano');

const gulpConfig = require('./gulp-config/common');

const arg = (argList => {

  let arg = {}, a, opt, thisOpt, curOpt;
  for (a = 0; a < argList.length; a++) {

    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');

    if (opt === thisOpt) {

      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;

    }
    else {

      // argument name
      curOpt = opt;
      arg[curOpt] = true;

    }

  }

  return arg;

})(process.argv);


function cleanDist(done) {
  del.sync([
    gulpConfig.path.outputDir
  ]);

  return done();
}


function buildScripts(done) {
  const isProduction = arg.production;

  let scriptsPipe = gulp.src(gulpConfig.path.input.scripts)
    .pipe(rollup({
      plugins: [
        babel(),
        resolve(),
        commonjs()
      ]
    }, 'umd'));

  if (isProduction) {
    scriptsPipe = scriptsPipe.pipe(uglify());
  }

  scriptsPipe = scriptsPipe.pipe(gulp.dest(gulpConfig.path.output.scripts));

  return scriptsPipe;
}

function buildStyles(done) {
  const stylesPipe = gulp.src(gulpConfig.path.input.styles)
    .pipe(sass({
      outputStyle: 'expanded',
      sourceComments: true
    }))
    .pipe(postcss([
      prefix({
        cascade: true,
        remove: true
      })
    ]))
    // .pipe(gulp.dest(gulpConfig.path.output.styles))
    // .pipe(rename({suffix: '.min'}))
    .pipe(postcss([
      minify({
        discardComments: {
          removeAll: true
        }
      })
    ]))
    .pipe(gulp.dest(gulpConfig.path.output.styles));

  return stylesPipe;
}


function startServer(done) {
  // if (!gulpConfig.browserSync.reload) return done();

  browserSync.init({
    port: gulpConfig.browserSync.port,
    server: {
      baseDir: gulpConfig.browserSync.baseDir
    }
  });

  return done();
}

// Reload the browser when files change
function reloadBrowser(done) {
  if (!gulpConfig.browserSync.reload) return done();

  browserSync.reload();

  return done();
}

function copyFiles(done) {
  return gulp.src(gulpConfig.path.input.copy)
    .pipe(gulp.dest(gulpConfig.path.outputDir));
}

const COMMON_SERIES = gulp.series(
  cleanDist,
  buildStyles,
  buildScripts,
  copyFiles,
);

function watchSource(done) {
  gulp.watch(
    gulpConfig.path.inputDir,
    gulp.series(COMMON_SERIES, reloadBrowser)
  );

  return done();
}

/** ******* GULP ACTIONS ****** **/

exports.build = COMMON_SERIES;
exports.watch = gulp.series(
  COMMON_SERIES,
  startServer,
  watchSource
);