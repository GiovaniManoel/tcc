const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const TutorController = require ('../controllers/tutor-controller');


router.get('/', TutorController.getTutor);
router.post ('/', login.obrigatorio, TutorController.postTutor);
router.get('/:id_usuario', login.obrigatorio, TutorController.getUmTutor);
router.patch ('/', login.obrigatorio, TutorController.patchTutor);
router.delete ('/', login.obrigatorio, TutorController.deleteTutor);

module.exports = router;