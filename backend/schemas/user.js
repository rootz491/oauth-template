const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3,
		},
		password: {
			type: String,
			trim: true,
			minlength: 3,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3,
		},
		githubId: {
			type: String,
			unique: true,
			sparse: true,
		},
		googleId: {
			type: String,
			unique: true,
			sparse: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
