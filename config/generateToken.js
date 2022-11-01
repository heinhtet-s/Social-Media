const jwt = require("jsonwebtoken");
const UserToken = require("../modal/userTokenModal.js");
const generateToken = async (id) => {
  try {
    const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1min",
    });
    const refreshToken = jwt.sign(
      { id },
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      {
        expiresIn: "30d",
      }
    );
    const userToken = await UserToken.findOne({ userId: id });
    if (userToken) {
      await userToken.remove();
    }
    console.log(refreshToken);
    UserToken.create({ userId: id, token: refreshToken });
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};
module.exports = generateToken;
