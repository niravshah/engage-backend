module.exports = function(app) {

    var XLSX = require('xlsx');
    var multer = require('multer');

    app.post('/api/upload/users',multer().any(), function (req, res) {
        for(var i=0;i<req.files.length;i++)
        {
            var workbook = XLSX.readFile(req.files[i]);
            res.json(XLSX.utils.sheet_to_json(workbook));
        }
    });
};