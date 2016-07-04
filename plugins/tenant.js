module.exports = exports = function addTenantIdPlugin(schema, options) {
    schema.add({
        tenantId: String
    })
    schema.pre('save', function(next, req, callback) {
        this.tenantId = req.param.tid || req.query.tid;
        next(callback);
    });

    schema.pre('find', function(next,callback) {
        console.log(this._conditions)
        if(this._conditions.hasOwnProperty('tenantId')){
            next(callback);    
        }else{
            console.log('No Tenant Id. Will return error');
            var err = new Error('TenantId missing from Query')
            next(err);
        }
     
        
    });
}