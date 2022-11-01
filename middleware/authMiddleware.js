const jwt = require("jsonwebtoken");
const User = require("../modal/userModal");
const { success, error, validation } = require("../utilis/responseApi");
const asyncHandler = require("express-async-handler");
const protectedRoute = asyncHandler(async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (accessToken) {
    try {
      jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        async (e, data) => {
          if (e) {
            return res.status(403).json(error("Token Expired", 401));
          }
          req.user = await User.findById(data.id).select("-password");
          next();
        }
      );
    } catch (err) {
      console.log("geofjgwofe");
      return res.status(401).json(error("Unauthorized", 401));
    }
  } else {
    return res.status(401).json(error("Unauthorized", 401));
  }
});
module.exports = { protectedRoute };
