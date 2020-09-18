const { toData } = require("./setTokens");

const validateTokenMiddleware = async (req, res, next) => {
  try {
    const auth =
      req.headers.authorization && req.headers.authorization.split(" ");

    if (auth && auth[0] === "Bearer" && auth[1]) {
      const data = await toData(auth[1]);
      req.userId = data.id;
      return next();
    }

    next();
  } catch (e) {
    console.log(e);
  }
};

module.exports = validateTokenMiddleware;
