"use strict";

let	gulp = require("gulp"),
	eslint = require('gulp-eslint');

function extensionGlobals(){
	return [
		// libraries
		"$", "jQuery",
		// chrome extension environment
		"chrome",
	].reduce((s,v)=>{s[v]=true; return s;},{});
}


gulp.task("lint-extension-js", ()=>
	gulp.src(["chrome/chrall/*.js"])
	.pipe(eslint({
		"env": {
			"browser": true,
		},
		"extends": "eslint:recommended",
		"globals": extensionGlobals(),
		"rules": {
			"no-unused-vars": [
				2,
				{"vars": "all", "args": "none"}
			],
			"comma-dangle": [
				2,
				"only-multiline"
			],
			"complexity": [
				0,
				20
			],
			"dot-location": [
				2,
				"property"
			],
			"no-extra-label": [
				2
			],
			"indent": [
				2,
				"tab"
			],
			"linebreak-style": [
				2,
				"unix"
			],
			"brace-style": [
				2, // I'll activate this when switching code to ES6
				"1tbs"
			],
			"no-lonely-if": 0,
			"no-eval": 2,
			"no-caller": 2,
			"no-extra-bind": 2,
			"no-extra-label": 2,
			"no-console": 0,
			"quotes": 0,
		}
	}))
	.pipe(eslint.format())
	.pipe(eslint.failAfterError())
);


gulp.task("default", ["lint-extension-js"]);
