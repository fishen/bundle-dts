const { plugin: BundleDTSPlugin } = require('bundle-dts');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    module: {
        rules: [{ test: /\.ts(x?)$/, loader: "ts-loader" }]
    },
    plugins: [
        new BundleDTSPlugin({ entry: './src/index.ts', outFile: 'index.d.ts' }),
        new BundleDTSPlugin({ entry: './src/main.ts', outFile: 'main.d.ts', module: 'main' }),
    ],
    resolve: {
        extensions: ['.ts']
    }
};
