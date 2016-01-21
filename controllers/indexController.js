var Post = require('../modules/postModule');
var User = require('../modules/userModule');

module.exports = {

	homepage: function(req, res) {
		var logflag = true;
		if (req.session.user === undefined || req.session.user === null) {
			logflag = false;
		}
		Post.find({}).sort({
			'updated_at': -1
		}).limit(15).exec(function(err, data) {
			var posts = [];
			var users = [];
			if (err) return console.error(err);
			if (data) {
				console.log('find posts.');
				posts = data;
			} else {
				console.log('no posts.');
				posts = [];
			}
			User.find({}).sort({
				'create_at': -1
			}).limit(10).exec(function(err, data) {
				if (err) return console.error(err);
				if (data) {
					console.log('find users.');
					users = data;
					res.render('index', {
						title: '若鱼日记',
						posts: posts,
						users: users,
						liFlag: 1,
						user: req.session.user,
						loged: logflag
					});
				} else {
					console.log('no users.');
				}
			});

		});

	}

	,
	login: function(req, res) {
		var logflag = true;
		if (req.session.user === undefined || req.session.user === null) {
			logflag = false;
		}
		res.render('login', {
			title: '若鱼日记-登录',
			user: req.session.user,
			loged: logflag,
			liFlag: 2,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	}

	,
	reg: function(req, res) {
		var logflag = true;
		if (req.session.user === undefined || req.session.user === null) {
			logflag = false;
		}
		res.render('reg', {
			title: '若鱼日记-注册',
			user: req.session.user,
			loged: logflag,
			liFlag: 3,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	}

	,
	logout: function(req, res) {
		req.session.user = null;
		return res.redirect('/homepage');
	}

	,
	editPost: function(req, res) {
		var logflag = true;
		if (req.session.user === undefined || req.session.user === null) {
			logflag = false;
			res.redirect('/login');
		}
		var userid = req.session.user._id;
		User.findOne({
			_id: userid
		}).exec(function(err, data) {
			var userdata;
			if (err) return console.error(err);
			if (data) {
				console.log('find user info.');
				userdata = data;
				console.log(userdata);
			} else {
				console.log('find no user.');
				res.redirect('/login');
			}
			res.render('edit', {
				title: '若鱼日记-编辑',
				user: userdata,
				loged: logflag,
				liFlag: 5,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});



	}

	,
	userCenter: function(req, res) {
		var logflag = true;
		if (req.session.user === undefined || req.session.user === null) {
			logflag = false;
			res.redirect('/login');
		}
		var userid = req.session.user._id;
		User.findOne({
			_id: userid
		}).exec(function(err, data) {
			var userdata;
			if (err) return console.error(err);
			if (data) {
				console.log('find user info.');
				userdata = data;
			} else {
				console.log('find no user.');
				res.redirect('/login');
			}
			res.render('userCenter', {
				title: '若鱼日记-设置',
				user: userdata,
				loged: logflag,
				liFlag: 6,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});

	}

	,
	userPage: function(req, res) {
		var logflag = true;
		if (req.session.user === undefined || req.session.user === null) {
			logflag = false;
			res.redirect('/login');
		}
		var userid = req.session.user._id;
		var userdata;
		var posts = [];
		User.findOne({
			_id: userid
		}).exec(function(err, data) {
			if (err) return console.error(err);
			if (data) {
				console.log('find user info.');
				userdata = data;
				console.log(userdata);
			} else {
				console.log('find no user.');
				res.redirect('/login');
			}
			Post.find({
				authorid: userid
			}).sort({
				'updated_at': -1
			}).exec(function(err, data) {
				if (err) return console.error(err);
				if (data) {
					console.log('find user posts.');
					posts = data;
				} else {
					console.log('user has no posts.');
					posts = [];
				}
				res.render('userPage', {
					title: '若鱼日记-个人主页',
					loged: logflag,
					user: userdata,
					liFlag: 4,
					posts: posts,
					success: req.flash('success').toString(),
					error: req.flash('error').toString()
				});
			});
		});
	}

	,
	postContent: function(req, res) {
		var logflag = true;
		if (req.session.user === undefined || req.session.user === null) {
			logflag = false;
			res.redirect('/login');
		}
		var postid = req.params.postid;
		console.log(postid);
		var userid = req.session.user._id;
		var postinfo;
		var userdata;
		User.findOne({
			_id: userid
		}).exec(function(err, data) {
			if (err) return console.error(err);
			if (data) {
				console.log('find user info.');
				userdata = data;
				console.log(userdata);
				Post.findOne({
					_id: postid
				}).exec(function(err, post) {
					if (err) return console.error(err);
					if (post) {
						console.log(post);
						postinfo = post;
						User.findOne({
							_id: postinfo.authorid
						}).exec(function(err, author) {
							if (err) return console.error(err);
							res.render('postContent', {
								title: '若鱼日记-' + post.postTitle,
								user: userdata,
								author: author,
								post: postinfo,
								loged: logflag,
								liFlag: 0,
								success: req.flash('success').toString(),
								error: req.flash('error').toString()
							});
						});

					}
				});
			} else {
				console.log('find no user.');
				res.redirect('/login');
			}
		});
	}

	,
	authorPage: function(req, res) {
		var logflag = true;
		if (req.session.user === undefined || req.session.user === null) {
			logflag = false;
			res.redirect('/login');
		}
		var authorid = req.params.authorid;
		console.log(authorid);
		var userid = req.session.user._id;
		var postinfo;
		var userdata;
		var authordata;
		User.findOne({
			_id: authorid
		}).exec(function(err, data) {
			if (err) return console.error(err);
			if (data) {
				console.log('find user info.');
				authordata = data;
				Post.find({
					authorid: authorid
				}).sort({
					'updated_at': -1
				}).exec(function(err, posts) {
					if (err) return console.error(err);
					if (posts) {
						console.log(posts);
						res.render('authorPage', {
							title: '若鱼日记-他',
							user: req.session.user,
							author: authordata,
							posts: posts,
							loged: logflag,
							liFlag: 0,
							success: req.flash('success').toString(),
							error: req.flash('error').toString()
						});
					}
				});
			} else {
				console.log('find no user.');
				res.redirect('/homepage');
			}
		});
	}


	,
	newUsers: function(req, res) {
		var logflag = true;
		if (req.session.user === undefined || req.session.user === null) {
			logflag = false;
			res.redirect('/login');
		}
		var userdatas;
		User.find({}).exec(function(err, data) {
			if (err) return console.error(err);
			if (data) {
				console.log('find user info.');
				userdatas = data;
			} else {
				console.log('find no user.');
				res.redirect('/homepage');
			}
			res.render('newUsers', {
				title: '若鱼日记-用户',
				user: req.session.user,
				users: userdatas,
				loged: logflag,
				liFlag: 0,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	}


};