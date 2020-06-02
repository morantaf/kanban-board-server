const jwt = require('jsonwebtoken')

let refreshSecret = "fgdgmoelkdsgnc45213"
let accessSecret = "wx:cvnemdsnigoi153$⁼ù:"

const setTokens = (user) => {
  const sevenDays = 60 * 60 * 24 * 7 * 1000
  const fifteenMinutes = 60 * 15 * 1000
  
  const accessUser = {
    id: user.id
  }
  const refreshUser = {
    id: user.id,
    count: user.tokenCount
  };
  const accessToken = jwt.sign({user: accessUser}, accessSecret, { expiresIn: fifteenMinutes}),
  const refreshToken = jwt.sign({user: refreshUser}, refreshSecret, { expiresIn: sevenDays}),

  return {refreshToken, accessToken}
}

const validateAccessToken = (token) => {
  try {
    return jwt.verify(token,accessSecret)
  } catch(e){
    console.error(e)
  }
}

const validateRefreshToken = (token) => {
  try {
    return jwt.verify(token,refreshSecret)
  } catch(e){
    console.error(e)
  }
}

module.exports = {setTokens, validateAccessToken, validateRefreshToken}