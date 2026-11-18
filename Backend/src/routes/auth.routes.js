const {Router} = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authRouter = Router();


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUserController);
    // Implementation for user registration
/**
 * @route POST /api/auth/login
 * @desc Login a user with email and password
 * @access Public
 */


authRouter.post('/login', authController.loginUserController);



/**
 * @route get /api/auth/logout
 * @description clear the token from the client side and add it to the blacklist
 * @access public
 */



authRouter.get('/logout', authController.logoutUserController);


/*
    * @route get /api/auth/get-me
    * @description Get the currently logged-in user's information
    * @access Private
 */
authRouter.get('/get-me', authMiddleware.authUser, authController.getMeController);

module.exports = authRouter