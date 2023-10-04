const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const VeterinarioController = require ('../controllers/veterinario-controller');


router.get('/', VeterinarioController.getVeterinario);
router.post ('/', login.obrigatorio, VeterinarioController.postVeterinario);
router.get('/:id_usuario', login.obrigatorio, VeterinarioController.getUmVeterinario);
router.patch ('/', login.obrigatorio, VeterinarioController.patchVeterinario);
router.delete ('/', login.obrigatorio, VeterinarioController.deleteVeterinario);

module.exports = router;