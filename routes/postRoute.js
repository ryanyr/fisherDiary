var postController 	= require('../controllers/postController');
var postRouter 		= require('express').Router();

module.exports = function(){

	postRouter.route('/editPost').post(postController.postArticle);

	return postRouter;
}




