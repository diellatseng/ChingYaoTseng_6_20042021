const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

router.post('/', auth, multer, sauceCtrl.createThing);
router.put('/:id', auth, multer, sauceCtrl.modifyThing); //:id is request.params
router.delete('/:id', auth, sauceCtrl.deleteThing);
router.get('/', sauceCtrl.getThing);
router.get('/:id', sauceCtrl.getOneThing);

module.exports = router;