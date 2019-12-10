# bundle-dts
Generate and bundle declaration files to one d.ts file from a **.ts** entry file. It will resolve associated files and modules automatically. In addition, all processes are done **in memory**, no need to generate local declaration files.

# Installation
```sh
npm install -D bundle-dts
```
# Used with gulp
```js
// gulpfile.js
const gulp = require('gulp');
const bundle = require('bundle-dts');

exports.default = function () {
    return gulp.src('./src/index.ts')
        .pipe(bundle())
        .pipe(gulp.dest('.'))
}
```
# Used with webpack
```js
// webpack.config.js
const { plugin: BundleDTSPlugin } = require('bundle-dts');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [{ test: /\.ts(x?)$/, loader: "ts-loader" }]
    },
    plugins: [
        new BundleDTSPlugin()
    ],
    resolve: {
        extensions: ['.ts']
    }
};
```
# Used with node
```js
// index.js
const { generate, bundle } = require('bundle-dts');

// generate and bundle only
const dts = generate({ entry: './src/index.ts' });
console.log(dts);
// generate、 bundle and save to local
bundle({ entry: './src/index.ts', outFile: 'index.d.ts' });
```
# Options
* compilerOptions(object, optional): Compiler options for ts, default is `{ declaration:true }`.
* module(string, optional): The module name for dts, it will try to get name option from *package.json* by default, otherwise return *'defaultModuleName'*.
* ts(ts, optional): TS file compilation object, default use `require('typescript')`.
* cwd(string,optional): Default use `path.resolve('.')`.
* outFile(string, optional): Output file name, default is *index.d.ts*.
* entry(string, optional): Entry file, default use *entry* option when used with webpack.

