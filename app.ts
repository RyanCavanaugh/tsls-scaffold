import fs = require('fs');
import path = require('path');

eval(fs.readFileSync('./lib/typescriptServices.js', 'utf-8'));


class SampleLanguageServiceHost implements ts.LanguageServiceHost {
	sourceText: string;

	constructor(public inputFiles: string[]) {
		let sourceText = fs.readFileSync('sample.ts', 'utf-8');
	}

    getCompilationSettings(): ts.CompilerOptions {
		return { };
    }
    getScriptFileNames(): string[] {
		return this.inputFiles;
    }

    getScriptVersion(fileName: string): string {
		return '0';
    }

    getScriptSnapshot(fileName: string): ts.IScriptSnapshot {
		return {
			getText() {
				return fs.readFileSync(fileName, 'utf-8');
			},
			dispose: () => { },
			getChangeRange: () => undefined,
			getLength() {
				return fs.readFileSync(fileName, 'utf-8').length;
			}
		};
    }
    getCurrentDirectory(): string {
		return '~/fictional/';
    }
    getDefaultLibFileName(options: ts.CompilerOptions): string {
		return 'lib.d.ts';
    }
}

let inputFiles = ['sample.ts'];
let host = new SampleLanguageServiceHost(inputFiles);
let ls = ts.createLanguageService(host);
let program = ts.createProgram(inputFiles, host.getCompilationSettings());
let checker = program.getTypeChecker();

inputFiles.forEach(fileName => {
	let sourceFile = program.getSourceFile(fileName);
	ts.forEachChild(sourceFile, printExpressionType, children => children.forEach(printExpressionType));

	function printExpressionType(node: ts.Node) {
		let type = checker.getTypeAtLocation(node);
		console.log('Node text = ' + node.getText() + ' has type ' + checker.typeToString(type));

		ts.forEachChild(node, printExpressionType, children => children.forEach(printExpressionType));
	}
});
