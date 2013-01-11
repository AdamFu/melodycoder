/**
 * Melodycoder
 * http://botobe.net/
 * 网站上线自动打包部署脚本，包括压缩合并css等等。
 *
 * Copyright (c) 2013 Kai.XU
 * Licensed under the MIT license.
 */

// 预定义变量
var SOURCE_FOLD = './public';
var TARGET_FOLD = './dist';
var LOG_FILE = TARGET_FOLD + '/deploy.log';

// 使用基础包
var fs = require('fs'), path = require('path');

// 调用压缩css和js的工具包
var uglifyJS = require('uglify-js'), cleanCSS = require('clean-css');

// main
var targetPath = path.resolve(TARGET_FOLD), sourcePath = path.resolve(SOURCE_FOLD);

if (!fs.existsSync(path.resolve(LOG_FILE))) {
	console.error('文件目录结构不正确！部署失败！');
	process.exit();
}

var currentVersion = 'v' + new Date().getTime();
targetPath = targetPath + '/' + currentVersion;
fs.mkdirSync(targetPath);
fs.appendFileSync(path.resolve(LOG_FILE), '------ VERSION: ' + currentVersion + ' ------\n');

// css归并压缩，合并成home.css文件
var cssFiles = [];
var getCssFiles = function(path) {
	var contentList = fs.readdirSync(path);
	for (var i in contentList) {
		if (contentList[i] == 'ugc')
			return;
		
		var name = path  + '/'　+ contentList[i];
		var isDir = fs.statSync(name).isDirectory();
		if (isDir) {
			getCssFiles(name);
		} else {
			if (name.substr(-3) == 'css')
				cssFiles.push(name);
		}
	}
}
getCssFiles(sourcePath + '/css');

fs.mkdirSync(targetPath + '/css');
for(var i in cssFiles) {
	var cssName = cssFiles[i];
	var cssContent = fs.readFileSync(cssName);	cssContent = cleanCSS.process(cssContent.toString(), {keepBreaks: true});
	fs.appendFileSync(targetPath + '/css/home.css', cssContent);
}



console.log('部署成功！');


















