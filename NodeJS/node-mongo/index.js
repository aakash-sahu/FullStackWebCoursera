const MongoClient = require('mongodb');
const assert = require('assert');
const dboper = require('./operations');

//start connection to mongo server
const url = 'mongodb://localhost:27017';
const dbname = 'conFusion'

//connect. 2nd parameter is a call back function
MongoClient.connect(url).then((client) => {

    console.log('Connected correctly to server');
    const db = client.db(dbname);

    dboper.insertDocument(db, {name: "Vadonut", description: "Test"}, "dishes")
    .then((result) => {
        console.log("Insert document: \n", result.ops);

        return dboper.findDocuments(db, "dishes"); //returns another promise that will be handled by the next then
    })
    .then((docs) => {
        console.log("Found documents: \n", docs);

        return dboper.updateDocument(db, {name: "Vadonut"}, { description: "Updated Test"}, "dishes")
    })
    .then((result) =>{
        console.log("Updated document: \n", result.result);

        return dboper.findDocuments(db, "dishes");
    })
    .then((docs) => {
        console.log("Found updated documents: \n", docs);

        return db.dropCollection("dishes");
    })
    .then((result) => {
        console.log("Dropped Collection: ", result);

        client.close();
    })
    .catch((err) => console.log(err));
})
.catch((err) => console.log(err));