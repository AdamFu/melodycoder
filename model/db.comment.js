/**
 * @fileoverview 对评论的操作
 * @version 2012.10.04
 */

var async = require('async'), utils = require('../utils');

/**
 * @description 获取某个文章的所有评论
 * @param {string} pid 需要获取评论数目的文章的id
 */
exports.getComments = function(pid) {
  var Comment = db.models.Comment;
  Comment.find({
    pid : pid
  }, function(error, comments) {

  });
};

/**
 * @description 保存评论
 * @param {Object} author 用户名
 * @param {Object} webside
 * @param {Object} mail
 * @param {Object} comment
 */
exports.addComment = function(cmt, callback) {
  var Comment = db.models.Comment;

  async.parallel({

    // 是否存在未通过的相同的评论，否则无法继续
    hasComment : function(callback) {
      Comment.find({
        name : cmt.author,
        content : cmt.comment,
        approved : false
      }, callback);
    },
    hasApproved : function(callback) {
      Comment.find({
        name : cmt.author
      }, callback);
    }
  }, function(error, result) {
    if (error)
      throw Error();

    if (result.hasComment.length) {
      callback(0, null, '请不要重复发表评论！');
    } else {
      var isApproved = false, comments = result.hasApproved;
      if (comments.length !== 0) {
        for (var i in comments) {
          var tmpCmt = comments[i];
          if (tmpCmt.approved) {
            isApproved = true;
            break;
          }
        }
      }

      var c = new Comment({
        pid : cmt.postId,
        name : cmt.author,
        email : cmt.mail,
        webside : cmt.webside,
        content : cmt.comment,
        date : new Date(),
        approved : isApproved
      });
      c.save(function(error, commentHook) {
        if (error) {
          callback(0, isApproved, error);
        } else {
          if (commentHook.id) {
            callback(1, isApproved);
          }
        }
      });
    }
  });
};

/**
 * 获取当钱网站未被批准的评论的具体信息。
 */
exports.getRemainedComments = function(callback) {
  var Comment = db.models.Comment;
  Comment.find({
    approved : false
  }, 'pid content name date email', callback);
};

/**
 * 批准评论
 */
exports.approveComment = function(commentId, callback) {
  var Comment = db.models.Comment;
  Comment.update({
    '_id' : commentId
  }, {
    'approved' : true
  }, callback);
};

/**
 * 获取最近的最新评论
 */
exports.getrRectCmt = function(callback) {
  var Comment = db.models.Comment;
  Comment.find({
    approved : true
  }).limit(10).sort({
    date : -1
  }).exec(function(error, Comments) {
    for (var i in Comments) {
      var content = Comments[i].content;
      content = content.replace(/<a href="javascript:;">/g, '').replace(/<\/a>/g, ' ');
      Comments[i].content = content;
      Comments[i].briefContent = content && (utils.countChars(content, 18));
    }
    callback(error, Comments);
  });
};

