var indexController 	= require('../controllers/indexController');
var indexRouter 		= require('express').Router();

module.exports = function(){

	indexRouter.route('/homepage').get(indexController.homepage);

	indexRouter.route('/login').get(indexController.login);
	
	indexRouter.route('/reg').get(indexController.reg);

	indexRouter.route('/logout').get(indexController.logout);

	indexRouter.route('/editPost').get(indexController.editPost);

	indexRouter.route('/userCenter').get(indexController.userCenter);

	indexRouter.route('/userPage').get(indexController.userPage);

	indexRouter.route('/post/:postid').get(indexController.postContent);


	return indexRouter;
}


