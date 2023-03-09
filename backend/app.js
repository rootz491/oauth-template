const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const { isAuthenticated } = require("./middleware");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/v1/auth", authRouter);
app.use("/v1/user", isAuthenticated, usersRouter);

app.listen(8000, async () => {
	await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	console.log("Connected to MongoDB");
	console.log("Server started on port 8000");
});


//TODO:
// password hash
// password reset


// gobj= {
	//id : string
	//name : string
	//email : string
	//picture : string

// }