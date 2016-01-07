var User = require('../modules/userModule');
var Post = require('../modules/postModule');
var formidable = require('formidable');
var moment = require('moment');
var fs = require('fs');
var UPLOAD_FOLDER = '/images/userpic/';

module.exports = {

	doReg: function(req, res) {
		console.log('reg? oh good..');
		var email = req.body.email;
		var user = new User(req.body);
		console.log(user);
		User.findOne({
			email: email
		}, function(err, data) {
			if (data) {
				console.log('this has been ocupied.');
				req.flash('error', email + '已被注册 :-(');
				return res.redirect('/reg');
			} else {
				console.log('this is ok.');
				user.save(function(err, user) {
					if (err) return console.error(err);
					req.flash('success', '注册成功,欢迎');
					console.log('now reg data saved');
					req.session.user = user;
					return res.redirect('/homepage');
				})
			}
		});
	},

	doLogin: function(req, res) {
		console.log('login? oh good..');
		var user = new User(req.body);
		var email = req.body.email;
		var pwd = req.body.password;
		User.findOne({
			email: email
		}, function(err, doc) {
			if (err) return;
			if (!doc) {
				console.log('no user like this');
				req.flash('error', '用户不存在');
				return res.redirect('/login');
			}
			console.log(doc);
			if (pwd != doc.password) {
				req.flash('error', '密码错误');
				return res.redirect('/login');
			}
			req.flash('success', '登录成功');
			console.log('now login success');
			req.session.user = doc;
			return res.redirect('/homepage');
		});
	},

	doUserinfo: function(req, res) {
		console.log('Userinfo edit? oh good..');
		console.log(req.session.user);
		var userid = req.session.user._id;
		var nickn = req.body.nickn;
		var mood = req.body.mood;
		var autograph = req.body.autograph;
		var selfintro = req.body.selfintro;
		var image = req.body.upic;
		console.log(req.body);
		//mongooseModel.update(conditions, update, options, callback);
		var conditions = {
			_id: userid
		};
		var update = {
			$set: {
				nickn: nickn,
				mood: mood,
				autograph: autograph,
				selfintro: selfintro,
				image: image
			}
		};
		var options = {
			upsert: true
		};
		User.update(conditions, update, options, function(err) {
			if (err) {
				console.error(err);
			} else {
				console.log('update ok!');
				User.findOne({
					_id: userid
				}, function(err, doc) {
					if (err) return;
					if (!doc) {
						console.log('no user like this');
						req.flash('error', '用户不存在');
						return res.redirect('/userCenter');
					}
					console.log(doc);
					req.session.user = doc;
					return res.redirect('/userCenter');
				});
			}
		});
		Post.find({
			authorid: userid
		}).exec(function(err, docs) {
			if (err) return console.error(err);
			for (var i = 0; i < docs.length; i++) {
				docs[i].authorname = nickn;
				docs[i].save();
			}
			console.log('post author info updated.');
		});
	},

	doUserPic: function(req, res) {
		console.log('UserPic edit? oh good..');
		var form = new formidable.IncomingForm(); //创建上传表单
		form.encoding = 'utf-8'; //设置编辑
		form.uploadDir = 'public' + UPLOAD_FOLDER; //设置上传目录
		form.keepExtensions = true; //保留后缀
		form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
		form.parse(req, function(err, fields, files) {
			if (err) return console.error(err);
			var file = files.imagefile;
			var fileType = file.type.split('/')[1];
			var avatarName = 'upload_' + moment().format('x') + Math.random().toString().substr(2, 10) + '.' + fileType;
			var newPath = form.uploadDir + avatarName;
			var userpicUrl = UPLOAD_FOLDER + avatarName;
			console.log(newPath);
			fs.renameSync(files.imagefile.path, newPath); //重命名
			res.send({
				fileName:avatarName,
				filePath:userpicUrl
			});
		});

	}

};