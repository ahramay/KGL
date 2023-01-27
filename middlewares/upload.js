const { getFileName } = require("../helpers/file");
const multer = require("multer");
const path = require("path");
//memory storage
const storage = multer.memoryStorage();
const definPath = path.resolve(__dirname, "../public/uploads/images/");
//temp storage
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, definPath);
  },
  filename: function (req, file, cb) {
    var fileName = getFileName(file.originalname);
    cb(null, fileName);
  },
});

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/public/uploads/videos");
  },
  filename: function (req, file, cb) {
    var fileName = getFileName(file.originalname);
    cb(null, fileName);
  },
});

const mediaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/public/uploads/files");
  },
  filename: function (req, file, cb) {
    var fileName = getFileName(file.originalname);
    cb(null, fileName);
  },
});

exports.imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|)$/i)) {
      cb(new Error("Please upload an image file."));
    }
    cb(undefined, true);
  },
});

exports.videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 1024 * 1024 * 201,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(mp4|flv|mov|mkv)$/)) {
      cb(new Error("Please upload a video file."));
    }
    cb(undefined, true);
  },
});

exports.mediaUpload = multer({
  storage: mediaStorage,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
  fileFilter(req, file, cb) {
    if (
      !file.originalname.match(/\.(jpg|jpeg|png|mp3|flv|mov|mkv|mp4|zip|)$/i)
    ) {
      cb(new Error("Please upload an Media file."));
    }
    cb(undefined, true);
  },
});
