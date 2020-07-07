const jwt = require("jsonwebtoken");

let refreshSecret = "fgdgmoelkdsgnc45213";
let accessSecret = "wx:cvnemdsnigoi153$⁼ù:";

const setTokens = (user) => {
  const oneDay = 60 * 60 * 24 * 1000;
  const fifteenMinutes = 60 * 15 * 1000;

  const accessUser = {
    id: user.id,
  };
  const refreshUser = {
    id: user.id,
    count: user.tokenCount,
  };
  const accessToken = jwt.sign({ user: accessUser }, accessSecret, {
    expiresIn: fifteenMinutes,
  });
  const refreshToken = jwt.sign({ user: refreshUser }, refreshSecret, {
    expiresIn: oneDay,
  });

  return { refreshToken, accessToken };
};

const validateAccessToken = async (token) => {
  try {
    return jwt.verify(token, accessSecret);
  } catch (e) {
    console.error(e);
  }
};

const validateRefreshToken = async (token) => {
  try {
    return jwt.verify(token, refreshSecret);
  } catch (e) {
    console.error(e);
  }
};

function toJWT(data) {
  return jwt.sign(data, accessSecret, { expiresIn: "1h" });
}

async function toData(token) {
  try {
    return jwt.verify(token, accessSecret);
  } catch (e) {
    if (err instanceof jwt.TokenExpiredError) {
      return err;
    }
  }
}

module.exports = {
  setTokens,
  validateAccessToken,
  validateRefreshToken,
  toJWT,
  toData,
};
