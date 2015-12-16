var postController 	= require('../controllers/postController');
var postRouter 		= require('express').Router();

module.exports = function(){

	postRouter.route('/editPost').post(postController.postArticle);

	postRouter.route('/edit/postid').post(postController.editArticle);

	/*app.delete('/admin/content/:post_id', admin.delete);*/

	return postRouter;
}




