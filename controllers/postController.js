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
		console.log('edit? oh good..');
		var postid = req.params.postid;
		Post.findOne({
			_id: postid
		}).exec(function(err, post) {
			console.log(post);
			var postid = post._id;
			var postTitle = post.postTitle;
			var postMarkdown = post.postMarkdown;
			var html = post.html;
			var authorid = post.authorid;
			var authorname = post.authorname;
			var postdata = {
				postid: postid,
				postTitle: postTitle,
				postMarkdown: postMarkdown,
				html: html,
				authorid: authorid,
				authorname: authorname
			};
			var userdata = req.session.user;
			var logflag = true;
			if (req.session.user === undefined || req.session.user === null) {
				logflag = false;
				res.redirect('/login');
			}
			res.render('updatePost', {
				title: '若鱼日记-设置',
				user: userdata,
				post: postdata,
				loged: logflag,
				liFlag: 5,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});

	}

	,
	deleteArticle: function(req, res) {
		var postid = req.params.postid;
		console.log('delete? oh good..');
		console.log(postid);
		Post.remove({
			_id: postid
		}, function(err, result) {
			if (err) return console.error(err);
			if (result) {
				res.send('1');
			} else {
				res.send('0');
			}
		});

	}

	,
	updateArticle: function(req, res) {
		console.log('update? oh good..');
		var postid = req.body.postid;
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
		var conditions = {
			_id: postid
		};
		var update = {
			$set: postdata
		};
		var options = {
			upsert: true
		};
		Post.update(conditions, update, options, function(err,post) {
			if (err) return console.error(err);
			req.flash('success', '好的,记住了');
			console.log('now post data saved');
			res.redirect('/post/' + postid);
		});
	}

};