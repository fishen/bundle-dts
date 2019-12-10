const gulp = require('gulp');
const bundle = require('bundle-dts');

exports.default = function () {
    return gulp.src('./src/index.ts')
        .pipe(bundle({ ts: require('typescript') }))
        .pipe(gulp.dest('.'))
}