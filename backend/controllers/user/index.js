const axios = require("axios");
const User = require("../../schemas/user");

exports.user = async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId, { password: 0, __v: 0 });
		if (!user) {
			throw {
				status: 400,
				message: "User not found",
			};
		}
		res.status(200).json({
			message: "Successfully fetched user",
			user: user,
		});
	} catch (error) {
		console.log(error);
		res.status(error.status).json({ message: error.message });
	}
};

exports.connectGithub = async (req, res) => {
	console.log("hi");
	try {
		const { code } = req.query;
		if (!code) {
			throw {
				status: 400,
				message: "Missing required fields",
			};
		}
		const { data } = await axios({
			method: "post",
			url: `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
			headers: {
				accept: "application/json",
			},
		}).catch((error) => {
			// console.log(error);
			throw {
				status: 400,
				message: "Invalid code or something",
			};
		});
		const { access_token } = data;
		const { data: githubUser } = await axios
			.get("https://api.github.com/user", {
				headers: {
					Authorization: `token ${access_token ?? "test"}`,
				},
			})
			.catch((error) => {
				console.log(error);
				throw {
					status: 400,
					message: "weird error",
				};
			});

		const { id } = githubUser;
		const userId = req.user.id;
		const user = await User.findById(userId);
		if (!user) {
			throw {
				status: 400,
				message: "User not found",
			};
		}
		user.githubId = id;
		await user.save();

		res.status(200).json({
			message: "Successfully connected to Github",
		});
	} catch (error) {
		console.log(error);
		res.status(error.status).json({ message: error.message });
	}
};

exports.disconnectGithub = async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId);
		if (!user) {
			throw {
				status: 400,
				message: "User not found",
			};
		}

		if (user.githubId === null) {
			throw {
				status: 400,
				message: "User not connected to Github",
			};
		}

		if (user.password === null || user.password === undefined) {
			throw {
				status: 400,
				message: "User doesn't have a password",
			};
		}

		await User.findOneAndUpdate(
			{
				_id: userId,
			},
			{
				$unset: {
					githubId: 1,
				},
			}
		);

		res.status(200).json({
			message: "Successfully disconnected from Github",
		});
	} catch (error) {
		console.log(error);
		res.status(error.status).json({ message: error.message });
	}
};

exports.connectGoogle = async (req, res) => {
	try {
		const { access_token } = req.query;
		if (!access_token) {
			throw {
				status: 400,
				message: "Missing required fields",
			};
		}

		const { data: googleUser } = await axios
			.get("https://www.googleapis.com/oauth2/v1/userinfo", {
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			})
			.catch((error) => {
				// console.log( error );
				throw {
					status: 400,
					message: "Invalid access token",
				};
			});
		const { id } = googleUser;
		const userId = req.user.id;
		const user = await User.findById(userId);
		if (!user) {
			throw {
				status: 400,
				message: "User not found",
			};
		}
		if (user?.googleId !== undefined) {
			throw {
				status: 400,
				message: "User already connected to Google",
			};
		}
		user.googleId = id;
		await user.save();

		res.status(200).json({
			message: "Successfully connected to Google",
		});
	} catch (error) {
		console.log(error);
		res.status(error.status).json({ message: error.message });
	}
};

exports.disconnectGoogle = async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId);
		if (!user) {
			throw {
				status: 400,
				message: "User not found",
			};
		}

		if (user.googleId === null || user.googleId === undefined) {
			throw {
				status: 400,
				message: "User not connected to Google",
			};
		}

		if (user.password === null || user.password === undefined) {
			throw {
				status: 400,
				message: "User doesn't have a password",
			};
		}

		await User.findOneAndUpdate(
			{
				_id: userId,
			},
			{
				$unset: {
					googleId: 1,
				},
			}
		);

		res.status(200).json({
			message: "Successfully disconnected from Google",
		});
	} catch (error) {
		console.log(error);
		res.status(error.status).json({ message: error.message });
	}
};