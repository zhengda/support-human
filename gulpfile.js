var gulp        = require('gulp');
var gutil       = require('gulp-util');
var coffee      = require('gulp-coffee');
var browserSync = require('browser-sync');
var stylus      = require('gulp-stylus');
var nib         = require('nib');
var jeet        = require('jeet');
var prefix      = require('gulp-autoprefixer');

gulp.task('browser-sync', ['stylus-build', 'coffee-build'], function() {
  browserSync({
    port: 8000,
    server: {
      baseDir: './',
      index: 'index.html'
    }
  });
});

gulp.task('stylus-build', function () {
  return gulp.src('stylus/app.styl')
    .pipe(stylus({
      use: [nib(), jeet()],
      compress: true
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('coffee-build', function() {
  gulp.src('coffee/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('js'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function () {
  gulp.watch('stylus/**/*', ['stylus-build']);
  gulp.watch('coffee/*.coffee', ['coffee-build']);
});

gulp.task('default', ['browser-sync', 'watch']);
