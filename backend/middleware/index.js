const jwt = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
	try {
		if (req.headers.authorization) {
			if (req.headers.authorization.split(" ")[0] !== "Bearer")
				throw { message: "Incorrect token prefix" };
			const jwtToken = req.headers.authorization.split(" ")[1];
			jwt.verify(jwtToken, process.env.JWT_SECRET ?? "test", (err, decoded) => {
				if (err) {
					throw {
						message: "Invalid token",
						status: 401,
					};
				}
				const { id, github_access_token } = decoded;
				req.user = {
					id,
					github_access_token,
				};
				next();
			});
		} else {
			throw {
				message: "No token provided",
				status: 401,
			};
		}
	} catch (error) {
		console.log(error);
		res.status(error.status ?? 500).json({
			message: error.message ?? "something went wrong!",
		});
	}
};
