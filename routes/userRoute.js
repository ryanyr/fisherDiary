var userController 	= require('../controllers/userController');
var userRouter 		= require('express').Router();

module.exports = function(){

	userRouter.route('/reg').post(userController.doReg);

	userRouter.route('/login').post(userController.doLogin);

	
	return userRouter;
}
