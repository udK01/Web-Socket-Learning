// upload.js

const multer = require("multer");
const path = require("path");

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../Front/public/");
  },
  filename: (req, file, cb) => {
    const currentTimeInMillis = Date.now();
    const uniqueName = `${currentTimeInMillis}${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Function to handle file upload
const profileUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "Error uploading file" });
    }
    next();
  });
};

module.exports = { profileUpload };
