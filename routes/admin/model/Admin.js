const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
	username: {
		type: String,
		trim: true,
		required: true,
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	adminCreated: {
		type: Date,
		default: new Date(),
	},
});

module.exports = mongoose.model("admin", AdminSchema);
