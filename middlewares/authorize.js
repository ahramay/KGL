const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const auth = async (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.cookies.access_token ||
    req.header("x-auth-token");
  if (!token) {
    return res.status(400).json({
      message: "No token provided.",
    });
  }
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(400).json({
          message: "Invalid token.",
        });
      }
      console.log("decoded ===>>> ", decodedToken);
      const id = decodedToken.id;
      res.id = id;
      User.findOne({ _id: id })
        .then((user) => {
          if (!user) {
            res.status(401).json({
              message: "Invalid token provided.",
            });
          }
          req.session.user = user;
          next();
        })
        .catch((err) => {
          throw err;
        });
    });
  }
};

const admin = async (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.cookies.access_token ||
    req.header("x-auth-token");
  if (!token) {
    return res.status(400).json({
      message: "No token provided.",
    });
  }
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(400).json({
          message: "Invalid token.",
        });
      }
      console.log("decoded ===>>> ", decodedToken);
      const id = decodedToken.id;
      User.findOne({ _id: id })
        .then((user) => {
          if (!user) {
            res.status(401).json({
              message: "Invalid token provided.",
            });
          }
          req.user = user;
          const role = user.role;
          if (role !== "ADMIN") {
            return res.status(400).json({
              success: false,
              message: "Access Denied.",
            });
          }
          next();
        })
        .catch((err) => {
          throw err;
        });
    });
  }
};

module.exports = { auth, admin };
// const auth = async (req, res, next) => {
//   const token =
//     req.body.token ||
//     req.query.token ||
//     req.cookies.access_token ||
//     req.header("x-auth-token");
//   if (!token) {
//     return res.status(400).json({
//       message: "No token provided.",
//     });
//   }
//   if (token) {
//     jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
//       if (err) {
//         return res.status(400).json({
//           message: "Invalid token.",
//         });
//       }
//       console.log("decoded ===>>> ", decodedToken);
//       const id = decodedToken.id;
//       User.findOne({ _id: id })
//         .then((user) => {
//           if (!user) {
//             res.status(401).json({
//               message: "Invalid token provided.",
//             });
//           }
//           req.user = user;
//           next();
//         })
//         .catch((err) => {
//           throw err;
//         });
//     });
//   }
// };
