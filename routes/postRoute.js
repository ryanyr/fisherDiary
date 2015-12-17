var postController 	= require('../controllers/postController');
var postRouter 		= require('express').Router();

module.exports = function(){

	postRouter.route('/editPost').post(postController.postArticle);

	postRouter.route('/edit/:postid').get(postController.editArticle);

	postRouter.route('/delete/:postid').delete(postController.deleteArticle);

	postRouter.route('/edit/:postid').post(postController.updateArticle);

	return postRouter;
}




