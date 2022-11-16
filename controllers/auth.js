const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const register = async (req, res, next) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({
      message: "Name or Password not present",
    });
  }
  const strPassword = password.toString();

  if (strPassword.length < 5) {
    return res
      .status(400)
      .json({
        message: "User creation failed",
        error: "Password less than 5 characters",
      });
  } else {
    const user = await User.findOne({ name: name });
    if (user) {
      return res
        .status(400)
        .json({
          message: "User creation failed",
          error: "User already exists",
        });
    }
  }

  try {
    const createdUser = await User.create({
      name,
      password: strPassword,
      coinBalance: 100,
    });
    const { _id, coinBalance } = createdUser;

    return res.status(200).json({
      message: "User successfully created",
      user: {
        _id,
        name,
        coinBalance,
        token: generateToken(_id),
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const login = async (req, res, next) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({
      message: "Name or Password not present",
    });
  }

  try {
    const user = await User.findOne({ name });
    if (user && (await user.matchPassword(password.toString()))) {
      res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          coinBalance: user.coinBalance,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({
        message: "Login not successful",
        error: "Incorrect Credentials",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = { register, login };
