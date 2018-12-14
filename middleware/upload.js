const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({
    destination(req, res, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        const date = moment().format('DDMMYYYY-HHmmss_SSS');
        cb(null, `${date}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/plain') {
        cb(null, true)
    } else {
        cb(null, false)
    }
};

module.exports = multer({storage, fileFilter});