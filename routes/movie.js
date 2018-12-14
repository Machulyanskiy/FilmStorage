const express = require('express');
const controller = require('../controllers/movie');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:criterion/:text', controller.getByCriterion);
router.post('/', controller.create);
router.post('/import', upload.single('file'), controller.import);
router.delete('/:id', controller.delete);


module.exports = router;