
const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const watch = require('gulp-watch')

const { series, src, dest } = gulp

function react() {
    return src('app/*.jsx')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'))
}


gulp.task('default', () => {
    // 回调里面必须接series（）调用
    return watch('app/*.jsx', series(react));
})