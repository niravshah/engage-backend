module.exports = function (app) {

    var XLSX = require('xlsx');
    var multer = require('multer');

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now())
        }
    });

    var upload = multer({storage: storage});

    app.post('/api/upload/users', upload.any(), function (req, res) {
        var values = [];
        req.files.forEach(function (file) {
            console.log(file);
            var workbook = XLSX.readFile(file.path);
            workbook.SheetNames.forEach(function (sheetName) {
                var ws = workbook.Sheets[sheetName];
                var json = XLSX.utils.sheet_to_json(ws);
                if (json.length > 0) {
                    values.push(json);
                    res.json({success: true, message: 'Created ' + json.length + ' Users.'})
                } else {
                    res.json({success: false, message: 'No records found'})
                }
            });
        });

    });
};