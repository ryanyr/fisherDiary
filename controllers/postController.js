var Post = require('../modules/postModule');
var markdown = require('markdown').markdown;

module.exports = {

	postArticle: function(req, res) {
		console.log('post? oh good..');
		var postTitle = req.body.postTitle;
		var postMarkdown = req.body.postMarkdown;
		var html = markdown.toHTML(postMarkdown);
		var authorid = req.session.user._id;
		var authorname = req.session.user.nickn;
		var postdata = {
			postTitle: postTitle,
			postMarkdown: postMarkdown,
			html: html,
			authorid: authorid,
			authorname: authorname
		};
		var post = new Post(postdata);
		console.log(post);
		post.save(function(err, doc) {
			if (err) return console.error(err);
			req.flash('success', '好的,记住了');
			console.log('now post data saved');
			return res.redirect('/editPost');
		});

	}

	,
	editArticle: function(req, res) {
		console.log('post? oh good..');
		var postTitle = req.body.postTitle;
		var postMarkdown = req.body.postMarkdown;
		var html = markdown.toHTML(postMarkdown);
		var authorid = req.session.user._id;
		var authorname = req.session.user.nickn;
		var postdata = {
			postTitle: postTitle,
			postMarkdown: postMarkdown,
			html: html,
			authorid: authorid,
			authorname: authorname
		};
		var post = new Post(postdata);
		console.log(post);
		post.save(function(err, doc) {
			if (err) return console.error(err);
			req.flash('success', '好的,记住了');
			console.log('now post data saved');
			return res.redirect('/editPost');
		});

	}
	

};