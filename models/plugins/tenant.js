module.exports = exports = function addTenantIdPlugin(schema) {
    schema.add({
        tid: {type: String, required: true}
    });
    /*schema.pre('save', function(next, req, callback) {
        this.tid = req.body.tid;
        console.log('Pre Save', this.tid,req.body.tid);
        next(callback);
    });*/

    schema.pre('find', function(next,callback) {
        console.log(this._conditions)
        if(this._conditions.hasOwnProperty('tid')){
            next(callback);    
        }else{
            console.log('Mongoose Filter : No Tenant Id. Will return error');
            var err = new Error('Mongoose Filter : TenantId missing from Query')
            next(err);
        }
    });
}