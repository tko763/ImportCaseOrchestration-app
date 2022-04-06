const { MongoClient } = require("mongodb");
const { config } = require('../config');

const options = {}

let client;
let clientPromise;
const uri = config.MONGO_URI;


if (!config.MONGO_URI) {
    throw new Error('Please add MongoDB URI to next.config.js file');
}
if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
}
else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}
module.exports = clientPromise;   