/**
 * @fileOverview Melody coder 文章的发布器，包括了对文章的读取，分析，以及最后的发布一套流程
 * @author <a href="mailto:xukai.ken@gmail.com">(XU Kai)xukai.ken@gmail.com</a>
 * @version 0.1
 *
 */

var fs = require('fs'), parser = require('./parser'), log = require('./logger');

var Logger = log.Logger;

var Publisher = function(opts) {
	this.opts = opts || {};
	this.init();
};

var pFn = Publisher.prototype;
pFn.init = function() {
	var articles = [], isSuccess = false;
	;

	// 查找统计目录中扩展名为.json的文件
	var files = fs.readdirSync('./');
	for (var j = 0; j < files.length; j++) {
		var fName = files[j];
		var extName = fName.split('.').pop();
		if (extName == 'json') {
			articles.push({
				name : fName
			});
		}
	}

	// 分析该文件的结构是否合法
	for (var j = 0; j < articles.length; j++) {
		var article = articles[j];

		try {
			var content = fs.readFileSync(article.name);
			var flag = this.opts.parser.parse(content);
		} catch (e) {
			Logger.log('Error getting the content for the file.');
		}
	}

	if (isSuccess)
		Logger.error('Publish error !');
	else
		Logger.success('Publish success !');
};

var Parser = parser.Parser;
new Publisher({
	parser : new Parser('BASIC')
});
