const jwt = require("jsonwebtoken");

const maxAge = process.env.TOKEN_AGE * 1;

function makeToken(id, req, res) {
  const token = jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: '31557600',
  });

  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    // expiresIn: process.env.REFRESH_TOKEN_AGE,
    expiresIn: '10800',
  });

  return { token, refreshToken };
}
module.exports = makeToken;
