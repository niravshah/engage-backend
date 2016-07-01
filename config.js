var config = [];

config['dev'] = {
    mongoUrl: 'mongodb://localhost/homefix',
    mongo_express_config: {
        mongodb: {
            server: "localhost",
            port: 27017,
            ssl: false,
            sslValidate: true,
            sslCA: [],
            autoReconnect: true,
            poolSize: 4,
            admin: false,
            auth: [
                {
                    database: 'homefix',
                    username: '',
                    password: '',
                },
            ],
            adminUsername: '',
            adminPassword: '',
            whitelist: [],
            blacklist: [],
        },
        site: {
            baseUrl: '/',
            cookieKeyName: 'mongo-express',
            cookieSecret: 'cookiesecret',
            host: 'localhost',
            port:  8081,
            requestSizeLimit:  '50mb',
            sessionSecret: 'sessionsecret',
            sslCert: '',
            sslEnabled:  false,
            sslKey: '',
        },
        useBasicAuth: '',
        basicAuth: {
            username: 'admin',
            password: 'pass',
        },
        options: {
            console: true,
            documentsPerPage: 10,
            editorTheme: 'rubyblue',
            maxPropSize: (100 * 1000),  // default 100KB
            maxRowSize: (1000 * 1000),  // default 1MB
            cmdType: 'eval',
            subprocessTimeout: 300,
            readOnly: false,
            collapsibleJSON: true,
            collapsibleJSONDefaultUnfold: 1,
        },
        defaultKeyNames: {}
    }
}

config['int'] = {
    mongoUrl: 'mongodb://mongo/homefix',
    mongo_express_config: {
        mongodb: {
            server: "mongo",
            port: 27017,
            ssl: false,
            sslValidate: true,
            sslCA: [],
            autoReconnect: true,
            poolSize: 4,
            admin: false,
            auth: [
                {
                    database: 'homefix',
                    username: '',
                    password: '',
                },
            ],
            adminUsername: '',
            adminPassword: '',
            whitelist: [],
            blacklist: [],
        },
        site: {
            baseUrl: '/',
            cookieKeyName: 'mongo-express',
            cookieSecret: 'cookiesecret',
            host: 'localhost',
            port:  8081,
            requestSizeLimit:  '50mb',
            sessionSecret: 'sessionsecret',
            sslCert: '',
            sslEnabled:  false,
            sslKey: '',
        },
        useBasicAuth: '',
        basicAuth: {
            username: 'admin',
            password: 'pass',
        },
        options: {
            console: true,
            documentsPerPage: 10,
            editorTheme: 'rubyblue',
            maxPropSize: (100 * 1000),  // default 100KB
            maxRowSize: (1000 * 1000),  // default 1MB
            cmdType: 'eval',
            subprocessTimeout: 300,
            readOnly: false,
            collapsibleJSON: true,
            collapsibleJSONDefaultUnfold: 1,
        },
        defaultKeyNames: {}
    }
}


module.exports = config;