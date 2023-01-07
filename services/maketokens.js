const jwt = require("jsonwebtoken");

// const maxAge = (3 * 60 * 60);
const maxAge = process.env.TOKEN_AGE * 1;

function makeToken(id, req, res) {
  const token = jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });

  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_AGE,
  });

  return { token, refreshToken };
}
module.exports = makeToken;
