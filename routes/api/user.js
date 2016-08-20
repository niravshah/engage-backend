var express = require('express');
var router = express.Router();
var multer = require('multer');
var localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
var upload = multer({storage: localStorage});

router.post('/user/avatar', upload.any(),function(req, res) {
    console.log('Multer', req.files, req.body);
    res.json({success:true});
});

module.exports = router;