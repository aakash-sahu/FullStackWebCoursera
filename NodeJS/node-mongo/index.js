const MongoClient = require('mongodb');
const assert = require('assert');

//start connection to mongo server
const url = 'mongodb://localhost:27017';
const dbname = 'conFusion'

//connect. 2nd parameter is a call back function
MongoClient.connect(url, (err, client) => {

    assert.equal(err, null);
    console.log('Connected correctly to server');

    const db = client.db(dbname);
    const collection = db.collection('dishes');

    //insert one document in the collection
    collection.insertOne({"name": "Uthappizza", "description": "test"}, (err, result) => {
        assert.equal(err, null);

        console.log('After Insert: \n')
        console.log(result.ops); //ops provide how many operations were done as part of result

        //empty {} means to find all documents
        collection.find({}).toArray((err, docs) => {
            assert.equal(err, null);

            console.log('Found\n');
            console.log(docs);

            //Clean up database
            db.dropCollection('dishes', (err, result) => {
                assert.equal(err, null);

                client.close();
            });
        });
    });
});