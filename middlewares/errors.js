exports.exceptionHandler = function (err, req, res, next) {
  console.log("500 Err => ", err);
  res.sendApiResponse({ status: 500, message: "Something went wrong" });
};

exports.fileExceptionHandler = function (err, req, res, next) {
  res.sendApiResponse({ status: 500, message: err.message });
};
