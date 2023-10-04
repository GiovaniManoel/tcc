const pet = require('express');
const express = require('express');
const router = express.Router();
const multer = require ('multer'); // Primeiro iniciamos o multer (para coleta de arquivos)
const login = require('../middleware/login');

const PetController = require ('../controllers/pet-controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },

    filename: function( req, file, cb ){
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
    },
});

const fileFilter = (req, file, cb) =>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else{
        cb(null, false);
    }
}

const upload = multer({ // Depois nos direcionamos o diretorio para armazenar esses arquivos
    storage: storage, 
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}); 


router.get('/', login.obrigatorio, PetController.getPet);
router.post ('/', login.obrigatorio, upload.single('img_pet'), PetController.postPet);
router.get('/:id_pet', login.obrigatorio, PetController.getUmPet);
router.patch ('/', login.obrigatorio, upload.single('img_pet'), PetController.patchPet);
router.delete ('/', login.obrigatorio, PetController.deletePet);

module.exports = router;
