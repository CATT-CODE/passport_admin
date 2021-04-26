const Admin = require("../model/Admin");
const User = require("../../users/model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
	try {
		let genSalt = await bcrypt.genSalt(12);
		let hashedPassword = await bcrypt.hash(req.body.password, genSalt);

		let createdAdmin = new Admin({
			email: req.body.email,
			username: req.body.username,
			password: hashedPassword,
		});

		let savedCreatedAdmin = await createdAdmin.save();

		res.json({
			message: "Admin Created",
			admin: savedCreatedAdmin,
		});
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

const login = async (req, res) => {
	try {
		let foundAdmin = await Admin.findOne({ email: req.body.email });

		if (!foundAdmin) {
			throw { message: "Admin not found! Please go create one!" };
		}

		let comparedPassword = await bcrypt.compare(
			req.body.password,
			foundAdmin.password
		);

		if (!comparedPassword) {
			throw { message: "Please check your email and password!" };
		}

		let jwtToken = jwt.sign(
			{
				email: foundAdmin.email,
				username: foundAdmin.username,
			},
			process.env.ADMIN_JWT_SECRET_STRING,
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
			admin: req.user,
		});
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

const getAllUsersProfile = async (req, res) => {
	try {
		let allUsersProfile = await User.find({});

		res.json({
			message: "Got all users",
			users: allUsersProfile,
		});
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

const createUserUsingAdminRoute = async (req, res) => {
	try {
		let createdUser = new User({
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
		});
		let savedUser = await createdUser.save();

		res.json({
			message: "created user from admin",
			user: savedUser,
		});
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

const deleteUserByIdUsingAdminRoute = async (req, res) => {
	try {
		let deleteUser = await User.findOneAndDelete({ email: req.body.email });

		res.json({
			message: "deleted user from admin",
			user: deleteUser,
		});
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

const updateUserByEmailUsingAdminRoute = async (req, res) => {
	try {
		let updatedUser = await User.findOneAndUpdate(
			{ email: req.body.email },
			req.body,
			{ new: true }
		);

		res.json({
			message: "updated user",
			user: updatedUser,
		});
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

module.exports = {
	signUp,
	login,
	updateProfile,
	getAllUsersProfile,
	createUserUsingAdminRoute,
	deleteUserByIdUsingAdminRoute,
	updateUserByEmailUsingAdminRoute,
};
