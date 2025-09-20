require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

let url = `${process.env.MONGO_URL}`;
let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;
    };

    const client = new MongoClient(url);
    
    // Task 1: Connect to MongoDB
    await client.connect();
    
    // Task 2: Connect to database giftDB and store in variable dbInstance
    dbInstance = client.db(dbName);
    
    // Task 3: Return the database instance
    return dbInstance;
}

module.exports = connectToDatabase;