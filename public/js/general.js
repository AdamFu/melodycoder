/**
 * @fileverview 整个站点的入口执行js文件
 * @author xukai.ken@gmail.com
 */

seajs.config({
	alias : {
		'base' : YYMG.staticUrl + '/js/modules/base.js',
		
		// 常用文件的配置
		'interface' : YYMG.staticUrl + '/js/common/interface.js',
		'components' : YYMG.staticUrl + '/js/common/components.js',
		'tpl' : YYMG.staticUrl + '/js/common/tpl.js'
	}
});

YYMG.modules.push('base');
seajs.use(YYMG.modules, function() {
	var arg = arguments, argLen = arg.length;
	for (var i = 0; i < argLen; i++) {
		var module = arg[i];
		if (module && module.init && typeof module.init == 'function')
			module.init();
	}

	// IE6背景半透明修复
	DD_belatedPNG.fix('.pngfix');
});
