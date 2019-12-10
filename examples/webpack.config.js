const { plugin: BundleDTSPlugin } = require('bundle-dts');

module.exports = {
    mode: 'development',
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
