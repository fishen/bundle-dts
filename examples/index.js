const { generate, bundle } = require('bundle-dts');

// generate and bundle only
const dts = generate({ entry: './src/index.ts' });
console.log(dts);
// generate、 bundle and save to local
bundle({ entry: './src/index.ts', outFile: 'index.d.ts' });