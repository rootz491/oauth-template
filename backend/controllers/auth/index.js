const User = require("../../schemas/user");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  const saltRounds = 10;
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw {
        status: 400,
        message: "Missing required fields",
      };
    }
    if (password.length < 6) {
      throw {
        status: 400,
        message: "Password must be at least 6 characters long",
      };
    }
    let user = await User.findOne({ email });
    if (user) {
      throw {
        status: 400,
        message: "Email already registered",
      };
    }
    user = await User.findOne({ username });
    if (user) {
      throw {
        status: 400,
        message: "Username already used",
      };
    }
    const newUser = new User({
      username,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(saltRounds);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log(error);
    res.status(error.status).json({ message: error.message });
  }
};

exports.github = async (req, res) => {
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
      console.log(error.response.data.message);
      throw {
        status: 400,
        message: "Invalid code or something",
      };
    });
    console.log("lalalala" + data);
    const { access_token } = data;

    const ghResponses = await Promise.all([
      axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `token ${access_token ?? "test"}`,
        },
      }),
      axios.get("https://api.github.com/user/emails", {
        headers: {
          Authorization: `token ${access_token ?? "test"}`,
        },
      }),
    ]);

    const { data: githubUser } = ghResponses[0];
    const { data: githubEmails } = ghResponses[1];

    const primaryEmail = githubEmails.find((email) => email.primary).email;
    const { id } = githubUser;
    let user = await User.findOne({ githubId: githubUser.id });
    if (!user) {
      user = await User.findOne({ email: primaryEmail });
      if (!user) {
        user = await User.create({
          username: githubUser.login,
          email: primaryEmail,
          githubId: githubUser.id,
        });
      } else {
        user.githubId = id;
        await user.save();
      }
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (error) {
    console.log(error?.response?.data ?? error?.message ?? error);
    res.status(error?.status ?? 500).json({ message: error?.message ?? error.toString() });
  }
};

exports.google = async (req, res) => {
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
    console.log(googleUser);
    const { id } = googleUser;
    let user = await User.findOne({ googleId: id });
    if (!user) {
      user = await User.findOne({ email: googleUser.email });
      if (!user) {
        user = await User.create({
          username: googleUser.email.split("@")[0],
          email: googleUser.email,
          googleId: id,
        });
      } else {
        user.googleId = id;
        await user.save();
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(error?.status ?? 500).json({ message: error?.message ?? error.toString() });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw {
        status: 400,
        message: "Missing required fields",
      };
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw {
        status: 400,
        message: "Invalid email or password",
      };
    }
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw {
        status: 400,
        message: "Invalid email or password",
      };
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (error) {
    console.log(error?.data);
    res.status(error?.status ?? 500).json({ message: error?.message ?? error.toString() });
  }
};
