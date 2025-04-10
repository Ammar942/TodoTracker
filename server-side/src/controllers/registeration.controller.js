const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncWrapper = require("../middlewares/asyncWrapper.middleware");
const AppError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const signup = asyncWrapper(async (req, res, next) => {
  const user = req.body;

  let foundedUser = await userModel.findOne({
    email: user.email,
  });
  if (foundedUser) {
    return next(
      new AppError(
        "User with this email already exists.",
        400,
        httpStatusText.FAIL
      )
    );
  }

  let genSalt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, genSalt);

  userModel
    .create(user)
    .then((user) => {
      res.status(201).json({
        status: httpStatusText.SUCCESS,
        message: "User signed up successfully",
      });
    })
    .catch((error) => {
      return next(
        error,
        new AppError("Error registering user.", 500, httpStatusText.ERROR)
      );
    });
});
const login = asyncWrapper(async (req, res, next) => {
  const user = req.body;
  let foundedUser = await userModel.findOne({
    email: user.email,
  });
  if (!foundedUser) {
    return next(
      new AppError("Invalid email or password.", 400, httpStatusText.FAIL)
    );
  }
  let isMatch = await bcrypt.compare(user.password, foundedUser.password);
  if (!isMatch) {
    return next(
      new AppError("Invalid email or password.", 400, httpStatusText.FAIL)
    );
  }
  const token = jwt.sign(
    {
      email: foundedUser.email,
      username: foundedUser.username,
      _id: foundedUser._id,
    },
    process.env.JWT_SECRET
  );

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "Logged in successfully",
    data: { token },
  });
});
//
const logout = asyncWrapper(async (req, res, next) => {});

module.exports = {
  login,
  signup,
  logout,
};
