const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const ServicoController = require ('../controllers/servico-controller');


router.get('/', ServicoController.getServico);
router.post ('/', login.obrigatorio, ServicoController.postServico);
router.get('/:id_servico', login.obrigatorio, ServicoController.getUmServico);
router.patch ('/', login.obrigatorio, ServicoController.patchServico);
router.delete ('/', login.obrigatorio, ServicoController.deleteServico);

module.exports = router;