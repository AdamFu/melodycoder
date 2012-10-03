
/**
 * For the database connection
 */

var mongoose = require('mongoose'),
    config = require('../config').config,
    EventProxy = require('eventproxy').EventProxy;

exports.initialize = function() { 
    var db = mongoose.createConnection(config.db.DB_HOST, config.db.DB_NAME);
    global.db = db;
    
    var menuSchema = mongoose.Schema({title: String, url: String});
    db.model('Menu', menuSchema);

    var postSchema = mongoose.Schema({date: Date, author: String, title: String, content: String});
    db.model('Post', postSchema);

    var linkSchema = mongoose.Schema({title: String, url: String});
    db.model('Link', linkSchema);

    var categorySchema = mongoose.Schema({pid: String, title: String});
    db.model('Category', categorySchema);

    var tagSchema = mongoose.Schema({pid: String, title: String});
    db.model('Tag', tagSchema);

    var commentSchema = mongoose.Schema({pid: String});
    db.model('Comment', commentSchema);

    var self = this;
    return function initialize(req, resp, next) {

        // 如果是静态文件则跨过数据库层
        var staticExts = ['jpg', 'png', 'gif', 'js', 'css'];
        var ext = req.url.split('.').pop();

        if (staticExts.indexOf(ext) == -1) {
            var proxy = new EventProxy();
            var eventHooks = ['getPosts', 'getMenus', 'getLinks'];
            proxy.assign(eventHooks, next);
            
            // 存放预处理的所有的公共数据，菜单，所有的文章，etc.
            var dh = req.dataHandler = {};
            self.getAllMenus(function(menus) {
                dh.menus = menus;
                proxy.trigger('getPosts');
            });
            self.getAllPosts(function(posts, categories, tags) {
                dh.posts = posts;
                dh .categories = categories;
                dh.tags = tags;
                proxy.trigger('getMenus');
            });
            self.getLinks(function(links) {
                dh.links = links;
                proxy.trigger('getLinks');
            })
        } else {
            req.dataHandler = {};
            next();
        }
    }
}

var dbMenu = require('./db.menu'),
    dbPost = require('./db.post'),
    dbLink = require('./db.link');

// 获取所有的菜单选项
exports.getAllMenus = function(callback) {
    dbMenu.getAllMenus(callback);
}

// 获取所有的文章列表
exports.getAllPosts = function(callback) {
    dbPost.getAllPosts(callback);
}

// 获取所有的链接的列表
exports.getLinks = function(callback) {
    dbLink.getLinks(callback);
}