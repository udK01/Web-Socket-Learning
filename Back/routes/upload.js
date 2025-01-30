import multer from "multer";
import fs from "fs";
import path from "path";

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

    const oldFilePath = path.join("../Front/public/", req.body.profilePicture);
    if (fs.existsSync(oldFilePath) && req.body.profilePicture !== "base.png") {
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error("Error deleting old profile picture:", err);
        }
      });
    }

    next();
  });
};

export { profileUpload };
