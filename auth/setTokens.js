const jwt = require("jsonwebtoken");

let accessSecret = "wx:cvnemdsnigoi153$⁼ù:";

function toJWT(data) {
  return jwt.sign(data, accessSecret, { expiresIn: "1h" });
}

async function toData(token) {
  try {
    return jwt.verify(token, accessSecret);
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return e;
    }
  }
}

module.exports = {
  toJWT,
  toData,
};
