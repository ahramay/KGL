module.exports = function () {
  process.on("uncaughtException", (ex) => {
    console.log(ex);
  });

  process.on("unhandledRejection", (rejection) => {
    console.log(rejection);
  });
};
