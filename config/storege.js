const multer = require("multer");
const fs = require("fs");

 const createFileName = (file) =>
{
   const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
  const filename = `${ formattedDate }_${ formattedTime }_${ file.originalname }`; 
  return filename;
}

const uploadsDirectory = "./uploads";
if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory);
}
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
    cb(null, uploadsDirectory);
  },
  filename: function (req, file, cb) {
   
    cb(null, createFileName( file));
  },
});

module.exports = { storage ,createFileName};