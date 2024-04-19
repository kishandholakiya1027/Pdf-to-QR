const multer = require("multer");
const fs = require("fs");

const uploadsDirectory = "./uploads";
if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

module.exports = { storage };