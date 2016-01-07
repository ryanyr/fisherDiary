var userController 	= require('../controllers/userController');
var userRouter 		= require('express').Router();

module.exports = function(){

	userRouter.route('/reg').post(userController.doReg);

	userRouter.route('/login').post(userController.doLogin);

	userRouter.route('/user/updateUserinfo').post(userController.doUserinfo);

	userRouter.route('/user/uploadimages').post(userController.doUserPic);

	
	return userRouter;
}

