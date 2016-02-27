// This build file is used by the developer and by Travis to check the source of extension
//  with eslint.
// Usage:
// > gulp: run the check, fails (returns not 0) when the code isn't compliant
// > gulp watch: continuously run the checks on every file save 
// > gulp fix-extension-js: automatically fix the code if the only remaining problems are fixable
// Be careful with automatic fix, it may break the code...

"use strict";

let	gulp = require("gulp"),
	gulpif = require("gulp-if"),
	eslint = require('gulp-eslint');

let mode = {
	watch: false,
};
gulp.task("set-watch-mode", ()=>{
	mode.watch = true;
});

function extensionGlobals(){
	return [
		// libraries
		"$", "jQuery",
		// globale de Chrall
		"chrall",
		// trucs qui seraient mieux en non global mais voyez vous ma bonne dame c'est pas le cas
		"Troll",
		// chrome extension environment
		"chrome",
	].reduce((s,v)=>{s[v]=true; return s;},{});
}

function eslintOptions() {
	return {
		"env": {
			"browser": true,
		},
		"parserOptions": {
			"ecmaVersion": 6,
		},
		"extends": "eslint:recommended",
		"globals": extensionGlobals(),
		"rules": {
			"no-unused-vars": [ 2, {"vars": "all", "args": "none"}],
			"comma-dangle": [ 2, "only-multiline"],
			"complexity": [ 0, 20],
			"dot-location": [ 2, "property"],
			"no-extra-label": [ 2 ],
			"indent": [ 2, "tab" ],
			"linebreak-style": [ 2,	"unix" ],
			"brace-style": [ 2, "1tbs" ],
			"dot-location": [2, "property"],
			"no-use-before-define": 0,
			"no-lonely-if": 0,
			"dot-location": [2, "property"],
			"no-eval": 0, // some day I'll remove JSONP. Not today...
			"no-caller": 2,
			"no-extra-bind": 2,
			"no-extra-label": 2,
			"no-console": 0,
			"quotes": 0,
			"comma-spacing": [ 2, {"before": false, "after": true} ],
			"comma-style": 2,
			"no-trailing-spaces": [ 2, { "skipBlankLines": true } ],
			"no-restricted-syntax": [ 2, "WithStatement" ],
			"keyword-spacing": 2,
			"new-cap": 2,
			"no-throw-literal": 2,
			"no-useless-call": 2,
			"no-void": 2,
			"max-depth": [ 2, 8], 
			"no-unneeded-ternary": 2,
			"operator-assignment": [ 2, "always" ],
			"space-before-function-paren": [ 2, "never" ],
			"space-before-blocks": [2, { "functions": "never", "keywords": "always", classes: "never" }],
			"no-lonely-if": 0,
			"no-fallthrough": 0,
		}
	};
}

gulp.task("lint-extension-js", ()=>
	gulp.src([
		"chrome/chrall/*.js",
		// exclusions:
		"!**/*.min.js", "!**/date-fr-FR.js",
	])
	.pipe(eslint(eslintOptions()))
	.pipe(eslint.format())
	.pipe(gulpif(!mode.watch, eslint.failAfterError()))
);

gulp.task("fix-extension-js", ()=> {
	let options = eslintOptions();
	options.fix = true;
	options.rules["no-trailing-spaces"] = 0; // because the fix is too unsafe
	return gulp.src([
		"chrome/chrall/*.js",
		// exclusions:
		"!**/*.min.js", "!**/date-fr-FR.js",
	])
	.pipe(eslint(options))
	.pipe(eslint.format())
	.pipe(gulp.dest(function(d){
		return d.base
	}))
});

gulp.task("lint", ["lint-extension-js"]);

gulp.task("watch", ["set-watch-mode", "lint"], ()=>
	gulp.watch(["chrome/chrall/*.js"],["lint-extension-js"])
);

gulp.task("default", ["lint"]);
