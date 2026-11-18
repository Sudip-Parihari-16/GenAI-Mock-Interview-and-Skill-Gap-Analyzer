const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");
/**
 * @name registerUserController
 * @description Controller to handle user registration
 * @route POST /api/auth/register
 * @access Public
 */
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password",
            });
        }

        const isUserAlreadyExist = await userModel.findOne({
            $or: [{ email }, { username }],
        });

        if (isUserAlreadyExist) {
            return res.status(400).json({
                message: "User already exists with this email or username",
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hash,
        });

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

/**
 * @name loginUserController
 * @description Controller to handle user login
 * @route POST /api/auth/login
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
        });

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}




async function logoutUserController(req, res) {
    console.log("Cookies:", req.cookies);

    const token = req.cookies.token;
    console.log("Token:", token);

    if (token) {
        await tokenBlacklistModel.create({ token });
        console.log("Saved in blacklist");
    }

    res.clearCookie("token");

    res.status(200).json({
        message: "User logged out successfully"
    });
}



/*
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 * 
 *  * @param {*} res 
 */



/**
 * @name getMeController
 * @description get the currently logged-in user's information
 * @route GET /api/auth/get-me
 * @access Private
 */

async function getMeController(req, res){
    const user = await userModel.findById(req.user.id);

   res.status(200).json({
    message: "User information retrieved successfully",
    user:{
        id: user._id,
        username: user.username,
        email: user.email,
    }
});
}
module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}