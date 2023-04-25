const { MongoClient } = require('mongodb');

// MongoDB Atlas connection URI
const uri =  process.env.MONGODB_URI;

// Connect to MongoDB Atlas
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Declare a variable to hold the "first" collection
let firstCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    // Get a reference to the "first" collection
    firstCollection = client.db('expressJs').collection('first');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = {
  connectToDatabase,
  firstCollection,
  client
};
