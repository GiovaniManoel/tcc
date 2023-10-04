const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const ClinicaController = require ('../controllers/clinica-controller');


router.get('/', ClinicaController.getClinica);
router.post ('/', login.obrigatorio, ClinicaController.postClinica);
router.get('/:id_usuario', login.obrigatorio, ClinicaController.getUmaClinica);
router.patch ('/', login.obrigatorio, ClinicaController.patchClinica);
router.delete ('/', login.obrigatorio, ClinicaController.deleteClinica);

module.exports = router;