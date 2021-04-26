const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
    try {
        let genSalt = await bcrypt.genSalt(12);
        let hashedPassword = await bcrypt.hash(req.body.password, genSalt);

        let createdUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
        });

        let savedCreatedUser = await createdUser.save();

        res.json({
            message: "User Created",
            user: savedCreatedUser,
        })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

const login = async (req, res) => {
    try {
        let foundUser = await User.findOne({ email: req.body.email });

        if (!foundUser) { 
            throw { message: "User not found! Please go sign up!" };
        }
        
        let comparedPassword = await bcrypt.compare(
            req.body.password,
            foundUser.password
        );

        if (!comparedPassword) {
            throw {message: "Please check your email and password!"}
        }

        let jwtToken = jwt.sign(
            {
                email: foundUser.email,
                username: foundUser.username,
            },
            process.env.JWT_SECRET_STRING,
            {
                expiresIn: "1d",
            }
        );

        res.json({
            jwtToken,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const updateProfile = (req, res) => {
    try {
        res.json({ 
            message: "Update Route Success",
            user: req.user,
        });
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = {
    signUp,
    login,
    updateProfile
}