module.exports = function(app) {

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

    var upload = multer({ storage: storage });

    app.post('/api/upload/users',upload.any(), function (req, res) {
        var values = [];
        for(var i=0;i<req.files.length;i++)
        {
            var workbook = XLSX.readFile(req.files[i].path);
            workbook.SheetNames.forEach(function(sheetName) {
                var json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                values.push(json);
            });
        }
        res.json(values);
    });
};