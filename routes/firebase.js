var firebase = require("firebase");
firebase.initializeApp({
    serviceAccount: "path/to/serviceAccountCredentials.json",
    databaseURL: "https://databaseName.firebaseio.com"
});