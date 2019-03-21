const gulp = require('gulp');
const bundle = require('bdts');

exports.default = function () {
    return gulp.src('index.ts')
        .pipe(bundle({ ts: require('typescript') }))
        .pipe(gulp.dest('.'))
}