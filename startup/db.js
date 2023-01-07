const mongoose = require("mongoose");

const dbConnection = process.env.DB;

module.exports = async function () {
  console.log("Connecting to database...");
  mongoose
    .connect(dbConnection)
    .then(() => {
      console.log("Connected to database...");
    })
    .catch((err) => {
      console.log("DB connection failed...");
      throw err;
    });
};
