# bundle-dts
Generate and bundle declaration files to one d.ts file from a **.ts** entry file. It will resolve associated files and modules automatically.

# Installation
```
npm install -D bundle-dts
```
# Getting started
Create gulp task in gulpfile.js
```
const gulp = require('gulp');
const bundle = require('bundle-dts');

exports.default = function () {
    return gulp.src('index.ts')
        .pipe(bundle())
        .pipe(gulp.dest('.'))
}
```
Run task in terminal.
```
gulp
```
# Options
* compilerOptions(object, optional): Compiler options for ts, default is *{}*.
* module(string, optional): The module name for dts, it will try to get name option from *package.json* by default, otherwise return *'defaultModuleName'*.
* outFile(string, optional): Output file name, default is *index.d.ts*.
* ts(ts, optional): TS file compilation object, default use require('typescript').

