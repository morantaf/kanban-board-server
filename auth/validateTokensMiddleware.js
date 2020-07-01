const {
  validateAccessToken,
  validateRefreshToken,
  setTokens,
} = require("./setTokens");

const User = require("../UserModel");

const validateTokenMiddleware = async (req, res, next) => {
  try {
    const refreshToken = req.headers["x-refresh-token"];
    const accessToken = req.headers["x-access-token"];
    if (!accessToken && !refreshToken) return next();

    const decodedAccessToken = await validateAccessToken(accessToken);

    if (decodedAccessToken && decodedAccessToken.user) {
      console.log("access token decoded : ", decodedAccessToken);
      req.user = decodedAccessToken.user;
      return next();
    }

    const decodedRefreshToken = await validateRefreshToken(refreshToken);
    if (decodedRefreshToken && decodedRefreshToken.user) {
      console.log("refresh token decoded");
      const user = await User.findOne({
        where: { id: decodedRefreshToken.user.id },
      });

      if (!user || user.tokenCount !== decodedRefreshToken.user.count)
        return next();
      req.user = decodedRefreshToken.user;

      const userTokens = setTokens(user);
      res.set({
        "Access-Control-Expose-Headers": "x-access-token,x-refresh-token",
        "x-access-token": userTokens.accessToken,
        "x-refresh-token": userTokens.refreshToken,
      });

      console.log("res ?");
      return next();
    }
    next();
  } catch (e) {
    console.log(e);
  }
};

module.exports = validateTokenMiddleware;
