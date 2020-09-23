const through2 = require("through2");
const path = require('path');
const os = require('os');
const fs = require('fs');
const Vinyl = require('vinyl');

const IMPORTED_REGEXP = /(export|import)\s+(.+?)\s+from\s+(['|\"])(?<relative>\..+?)\3;?$/gm;
const IMPORTED_ALL_REGEXP = /import\s+(['|\"])\.{1,2}\/.+\1;?\n?/gm;

function format(module, contents) {
    return `declare module "${module}" {
${contents}}`;
}

function getDeclarationFiles(rootFiles, compilerOptions, ts) {
    ts = ts || require('typescript');
    compilerOptions = Object.assign({
        target: ts.ScriptTarget && ts.ScriptTarget.Latest,
    }, compilerOptions, {
        declaration: true,
        emitDeclarationOnly: true
    });
    const createdFiles = {};
    const host = ts.createCompilerHost(compilerOptions);
    host.writeFile = (fileName, contents) => createdFiles[fileName] = contents;
    // Prepare and emit the d.ts files
    const program = ts.createProgram(rootFiles, compilerOptions, host);
    program.emit().diagnostics.filter(d => d.file && d.messageText).forEach(d => {
        console.error(d.file.fileName, d.messageText);
    });
    return createdFiles;
}

function getModuleName(cwd) {
    const packageFile = path.join(cwd, './package.json');
    if (fs.existsSync(packageFile)) {
        const contents = fs.readFileSync(packageFile, 'utf8');
        try {
            const json = JSON.parse(contents);
            if (json.name) {
                return json.name;
            }
        } catch {
            console.warn("Invalid package.json file.")
        }
    }
    return 'defaultModuleName';
}

module.exports = function (options = {}) {
    options.outFile = options.outFile || 'index.d.ts';
    return through2.obj(function (file, enc, callback) {
        const contents = generate(Object.assign(options, { entry: file.path, cwd: file.cwd }, options));
        this.push(new Vinyl({ contents: Buffer.from(contents), path: options.outFile }));
        callback();
    });
}

function generate(options) {
    const { entry, compilerOptions, ts, cwd, } = Object.assign({
        cwd: path.resolve('.'),
    }, options);
    const module = options.module || getModuleName(cwd);
    const declarations = getDeclarationFiles([entry], compilerOptions, ts);
    const indent = ' '.repeat(4);
    const result = Object.keys(declarations).map((filePath) => {
        let contents = declarations[filePath];
        contents = contents.replace(IMPORTED_ALL_REGEXP, '');
        contents = contents.replace(/^(.+?)$/gm, `${indent}$1`);
        contents = contents.replace(/declare\s+(abstract\s+)?(type|function|class|namespace|interface|enum|const|let|var)/g, '$1$2');
        contents = contents.replace(IMPORTED_REGEXP, function (statement, ...args) {
            const groups = args[args.length - 1];
            const relative = groups.relative;
            const fullpath = path.resolve(path.dirname(filePath), relative);
            const rpath = fullpath.replace(cwd, module).replace(/\\/g, '/')
            return statement.replace(relative, rpath);
        });
        const isEntryFile = path.resolve(filePath.replace('.d.ts', '.ts')) === path.resolve(entry);
        const moduleName = path.join(module, path.relative(cwd, filePath)).replace(/\\/g, '/').replace('.d.ts', '');
        contents = format(isEntryFile ? module : moduleName, contents);
        return contents;
    }).join(os.EOL);
    const package = require(path.resolve(__dirname, "package.json"));
    return `// Generated by "${package.name}@${package.version}" ${package.homepage}."${os.EOL}${result}`;
}

function bundle(options) {
    options = options || {};
    options.outFile = options.outFile || 'index.d.ts';
    const contents = generate(options);
    const callback = (error) => error && console.error(error);
    fs.writeFile(options.outFile, contents, 'utf8', callback);
}

class BundlePlugin {
    constructor(options) {
        this.options = options || {};
    }
    apply(compiler) {
        const done = () => bundle(Object.assign({ entry: compiler.options.entry }, this.options));
        if (compiler.hooks) {
            compiler.hooks.done.tap('BundleDTSPlugin', done);
        } else {
            compiler.plugin('done', done);
        }
    }
};

module.exports.generate = generate;
module.exports.bundle = bundle;
module.exports.plugin = BundlePlugin;