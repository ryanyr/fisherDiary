var User = require('../modules/userModule');

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
	}
};