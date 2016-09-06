module.exports = function (app) {

    var Misc = require('../../models/misc');
    var shortid = require('shortid');

    app.get('/api/misc/:type', function (req, res) {

        Misc.find({type: req.params.type, tid: req.body.tid}, function (err, miscs) {
            if (err) {
                res.json({
                    success: false,
                    message: "Error while retreiving entities of type " + err.message,
                    data: null
                });
            } else {
                if (miscs) {
                    res.json({success: true, data: miscs});
                } else {
                    res.json({
                        success: false,
                        message: "Could not find any data of type " + req.params.type,
                        data: null
                    });
                }
            }
        });
    });

    app.post('/api/misc/:type', function (req, res) {

        var miscs = req.body.miscs;

        miscs.forEach(function (m) {
            var newMisc = new Misc();
            newMisc.tid = req.body.tid;
            newMisc.shortid = shortid.generate();
            newMisc.type = req.params.type;
            newMisc.name = m.name;
            newMisc.url = m.url;
            newMisc.description = m.description;
            newMisc.save(function (err) {
                if (err) {
                    console.log("Error saving data of type " + req.params.type, err)
                }
            })

        });

        res.send({message:"done"});

    });

};