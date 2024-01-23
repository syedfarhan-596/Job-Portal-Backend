const multer = require("multer");
const path = require("path");

const Multer = (fileType) => {
  const storage = multer.diskStorage({
    destination: path.join(__dirname, `./uploads/${fileType}`),
    filename: (req, file, cd) => {
      return cd(
        null,
        `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });
  const upload = multer({
    storage: storage,
  });

  return upload;
};

module.exports = Multer;
