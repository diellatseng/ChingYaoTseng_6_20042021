const multer = require('multer');

// Accepts only the following types of images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Rename uploaded file and save the file
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');    //make sure that any space in file name will be replaced by "_"
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({
  storage: storage,
  // Check the file extension before uploading, accepts only .png and .jpg
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg") {
      cb(null, true);
    } else {
      return cb(null, false);
    }
  }
}).single('image');