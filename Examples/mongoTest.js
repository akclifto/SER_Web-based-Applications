const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const url = "mongodb://localhost:27017";

const dbName = "myProject";
const client = new MongoClient(url);

client.connect(function (err) {
    assert.strictEqual(null, err);
    console.log("Connection established to server");
    const db = client.db(dbName);

    // insertDocuments(db, () => {
    // updateDocument(db, () => {
    removeDocument(db, () => {
        client.close();
    });
    findDocuments(db, () => { });
    // });

    console.log("hit the id " + req.params.qid);

    res.render("question", { title: "The question page" });
});

const insertDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection("documents");
    // Insert some documents
    collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function (err, result) {
        assert.strictEqual(err, null);
        assert.strictEqual(3, result.result.n);
        assert.strictEqual(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
};

const findDocuments = (db, callback) => {
    // Get the documents collection
    const collection = db.collection("documents");
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.strictEqual(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });
};

const updateDocument = (db, callback) => {
    // Get the documents collection
    const collection = db.collection("documents");
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ a: 2 }, { $set: { b: 1 } }, function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Updated the document with the field a equal to 2");
        callback(result);
    });
};

const removeDocument = (db, callback) => {
    // Get the documents collection
    const collection = db.collection("documents");
    // Delete document where a is 3
    collection.deleteOne({ a: 3 }, function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
    });
};