const through2 = require("through2");
const Vinyl = require('vinyl');
const path = require('path');
const os = require('os');
const fs = require('fs');

const IMPORTED_REGEXP = /(export|import)\s+(.+?)\s+from\s+(['|\"])(?<relative>\..+?)\3;?$/gm;
const IMPORTED_ALL_REGEXP = /import\s+(['|\"])\.{1,2}\/.+\1;?\n?/gm;

function format(module, contents) {
    return `declare module "${module}" {
${contents}}`;
}

function getDeclarationFiles(rootFiles, compilerOptions, ts) {
    ts = ts || require('typescript');
    const program = ts.createProgram(rootFiles, compilerOptions);
    const sourceFiles = program.getSourceFiles().filter(f => !f.isDeclarationFile);
    const declarations = {};
    sourceFiles.forEach(f => {
        program.emit(
            f,
            (fileName, data) => declarations[fileName] = data,
            undefined,
            true
        );
    })
    return declarations;
}

function getDefaultModuleName() {
    const packageFile = './package.json';
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

module.exports = function bundle(options = {}) {
    options.module = options.module || getDefaultModuleName();
    options.outFile = options.outFile || 'index.d.ts';
    options.compilerOptions = options.compilerOptions || {};
    return through2.obj(function (file, enc, callback) {
        const declarations = getDeclarationFiles([file.path], options.compilerOptions, options.ts);
        const indent = ' '.repeat(4);
        const contents = Object.keys(declarations).map((filePath) => {
            let contents = declarations[filePath];
            contents = contents.replace(IMPORTED_ALL_REGEXP, '');
            contents = contents.replace(/^(.+?)$/gm, `${indent}$1`);
            contents = contents.replace(/declare\s+(abstract\s+)?(type|function|class|interface|enum|const)/g, '$1$2');
            contents = contents.replace(IMPORTED_REGEXP, function (statement, ...args) {
                const groups = args[args.length - 1];
                const relative = groups.relative;
                const fullpath = path.resolve(path.dirname(filePath), relative);
                return statement.replace(relative, fullpath.replace(file.cwd, options.module));
            });
            const isEntryFile = filePath.replace('.d.ts', '.ts') === file.path;
            const moduleName = filePath.replace(file.cwd, options.module).replace('.d.ts', '');
            contents = format(isEntryFile ? options.module : moduleName, contents);
            return contents;
        }).join(os.EOL);
        this.push(new Vinyl({ contents: Buffer.from(contents), path: options.outFile }));
        callback();
    });
}