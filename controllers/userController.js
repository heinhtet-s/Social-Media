const asyncHanlder = require("express-async-handler");
const User = require("../modal/userModal.js");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../config/generateToken.js");
const { success, error, validation } = require("../utilis/responseApi");
const generateCode = require("../config/generateCode.js");
const { validationResult } = require("express-validator/check");
const {
  sendVerificationEmail,
  sentResetPasswordEmail,
} = require("../utilis/mailer.js");
const Code = require("../modal/codeModal.js");
exports.registerUser = asyncHanlder(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(validation(errors.array(), 422));
  }
  let {
    first_name,
    last_name,
    username,
    email,
    password,
    gender,
    bYear,
    bMonth,
    bDay,
  } = req.body;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  User.create(
    {
      username,
      first_name,
      last_name,
      email,
      password,
      gender,
      bYear,
      bMonth,
      bDay,
    },
    async function (err, data) {
      if (err) {
        return res
          .status(400)
          .json(
            error(
              err.message || "Some error occurred while creating the User.",
              400
            )
          );
      }
      if (data) {
        const { accessToken, refreshToken } = await generateToken(data._id);
        const url = `${process.env.BASE_URL}/activate/${accessToken}`;
        sendVerificationEmail(data.email, data.username, url);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,

          sameSite: "lax",
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });
        return res.status(200).json(
          success(
            "User created successfully",
            {
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              picture: data.picture,
              verified: data.verified,
            },
            200
          )
        );
      }
    }
  );
});
exports.logout = asyncHanlder(async (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json(success("Logout successfully", null, 200));
});
exports.refreshToken = asyncHanlder(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json(error("Unauthorized", 401));
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY, (e, data) => {
    if (e) {
      return res.status(403).json(error("Token Expired", 401));
    }
    const accessToken = jwt.sign(
      { id: data.id },
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: "1min" }
    );
    console.log("accessToken", accessToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    return res.status(200).json(success("Token Refreshed", null, 200));
  });
});
exports.searchByEmail = asyncHanlder(async (req, res) => {
  const { email } = req.query;
  console.log(email);
  const user = await User.findOne({ email }).select("-password");
  if (!user) {
    return res.status(400).json(error("User Not Found", 400));
  }
  return res.status(200).json(
    success("Successfully fine your account", {
      id: user?._id,
      email: user?.email,
      picture: user?.picture,
    })
  );
});
exports.activateAccount = asyncHanlder(async (req, res) => {
  const { token } = req.body;
  const user = jwt.verify(token, process.env.JWT_SECRET);
  if (req.user._id !== user.id) {
    return res
      .status(400)
      .json(error("You do not have access to verify this account", 400));
  }
  const check = await User.findById(user.id);
  if (!check) {
    return res.status(400).json(error("User not found", 400));
  } else if (check.verified === true) {
    return res.status(400).json(error("User already verified", 400));
  } else {
    await User.findByIdAndUpdate(user.id, { verified: true });
    return res
      .status(200)
      .json(success("User verified successfully", null, 200));
  }
});
exports.passwordResendCode = asyncHanlder(async (req, res) => {
  const { id } = req.body;
  console.log(id);
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json(error("User Not Found", 400));
  }
  await Code.findOneAndRemove({ user: user._id });
  const code = generateCode(4);
  console.log(code);
  const saveCode = await Code.create({
    code,
    user: user._id,
  });
  sentResetPasswordEmail(user.email, user.username, code);
  return res
    .status(200)
    .json(success("Password Resend Mail Send Successfully", null, 200));
});
exports.resendEmailVerification = asyncHanlder(async (req, res) => {
  const token = generateToken(req.user._id);
  if (req.user.verified) {
    return res.status(400).json(error("This user is already verified", 400));
  }
  sendVerificationEmail(req.user.email, req.user.username, url);
  return res
    .status(200)
    .json(success("Send Email Verification Successfully", null, 200));
});
exports.login = asyncHanlder(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json(error("User not found", 400));
  }
  const check = bcrypt.compare(
    password,
    user.password,
    async (err, passwordCheckRes) => {
      if (err) {
        return res.status(422).json(error("Invalid Password", 403));
      }
      if (passwordCheckRes) {
        const { accessToken, refreshToken } = await generateToken(user._id);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,

          sameSite: "lax",
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,

          sameSite: "lax",
        });
        return res.status(200).json(
          success(
            "User logged in successfully",
            {
              id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              picture: user.picture,

              verified: user.verified,
            },
            200
          )
        );
      }
      return res.status(403).json(error("Invalid email or password", 403));
    }
  );
});
exports.checkPasswordResetCode = asyncHanlder(async (req, res) => {
  const { id, code } = req.body;
  const userData = await Code.findOne({ user: id });
  if (!userData) {
    return res.status(400).json(error("Code not Found", 400));
  }
  console.log(userData);
  console.log(code);
  if (userData.code.toString() !== code) {
    return res.status(400).json(error("Invalid Code", 400));
  }
  return res
    .status(200)
    .json(success("Password Reset code confirm Successfully ", null, 200));
});
exports.checkPasswordResetCode = asyncHanlder(async (req, res) => {
  const { id, code } = req.body;
  const userData = await Code.findOne({ user: id });
  if (!userData) {
    return res.status(400).json(error("Code not Found", 400));
  }
  console.log(userData);
  console.log(code);
  if (userData.code.toString() !== code) {
    return res.status(400).json(error("Invalid Code", 400));
  }
  return res
    .status(200)
    .json(success("Password Reset code confirm Successfully ", null, 200));
});
exports.passwordChange = asyncHanlder(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(validation(errors.array(), 422));
  }
  let { id, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  console.log("password", password);
  await User.findOneAndUpdate(
    {
      id: id,
    },
    {
      password,
    }
  ).exec((err, user) => {
    console.log(user);
    if (err) {
      return res
        .status(500)
        .json(
          error(
            err.message || "Some error occurred while updating the User.",
            500
          )
        );
    }
    return res.status(200).json(success("Code Successfully ", null, 200));
  });
});
