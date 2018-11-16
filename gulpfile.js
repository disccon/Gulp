const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const image = require('gulp-image');

const cssFiles = [
    './src/css/fonts/fonts.css',
    './src/css/reset.css',
    './src/css/style.css',
    './src/css/media.css'
]
function imgs() {
    return gulp.src('./src/img/**/*')
        .pipe(image())
        .pipe(gulp.dest('./build/img'));
};

function scss() {
    return gulp.src('./src/css/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./src/css'))
        .pipe(browserSync.stream());

};

function styles() {
    return gulp.src(cssFiles)
                .pipe(concat('all.css'))
                .pipe(autoprefixer({
                    browsers: ['> 0.1%'],
                    cascade: false
                }))
                .pipe(cleanCSS({
                    level: 2
                }))
                .pipe(gulp.dest('./build/css'))
                .pipe(browserSync.stream());
}
const jsFiles = [
    './src/js/main.js'
]
function scripts(){
    return gulp.src(jsFiles)
        .pipe(concat('all.js'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}
function watch(){
    browserSync.init({
        server: {
            baseDir: "./",
        },
    });
    gulp.watch('./src/css/**/*.scss',scss);
    gulp.watch('./src/css/**/*.css', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./*.html').on('change', browserSync.reload);
}
function clean(){
    return del(['build/*'])
}

gulp.task('imgs',imgs);
gulp.task('scss',scss);
gulp.task('styles',styles);
gulp.task('scripts',scripts);
gulp.task('watch',watch);
gulp.task('clean',clean);

gulp.task('build', gulp.series( clean,scss,imgs,
                        gulp.parallel(styles,scripts)
                         ));

gulp.task('default', gulp.series('build','watch'))