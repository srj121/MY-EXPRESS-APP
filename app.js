require('dotenv').config();
const express = require('express');
const {connectToDatabase, client } = require('./db');
const firstCollection = client.db('expressJs').collection('first');


const app = express();

//_____________________________________EJS_______________________________________

const ejs = require('ejs');
app.set('view engine', 'ejs');

const port = process.env.PORT;
//_____________________________________PARSE BODY_______________________________________
app.use(express.json());

//_____________________________________MODEL_______________________________________
const user = require('./model/User');

//_________________________________CONNECTION TO PORT_________________________________

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//____________________________________GET ALL_______________________________________

app.get('/', async (req, res) => {
  try {
    await connectToDatabase();

    const users = await firstCollection.find().toArray();
    res.render('index', { users: users });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving documents');
  }
});

//____________________________________GET BY NAME_______________________________________

app.get('/byname', async (req, res) => {
  try {
    const userName = req.query.name;

    console.log(userName);
    await connectToDatabase();
    const findByname = await firstCollection.find({ name: userName }).toArray();

    if (findByname.length === 0) {
      res.status(404).send(`Document with name { ${userName} } not found`);
    } else {
      res.render('findByName', { users: findByname });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving document');
  }
});


//____________________________________GET BY AGE_______________________________________

app.post('/byage', async (req, res) => {
  try {
    const userAge = Number(req.body.age);

    console.log(userAge);

    await connectToDatabase();

    const findByage = await firstCollection.find({ age: userAge }).toArray();
    if (findByage.length === 0) {
      res.status(404).send(`Document with age { ${userAge} } not found`);
    } else {
      res.render('findByAge', { users: findByage });

    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving document');
  }
});


//____________________________________POST ADDUSER_______________________________________

app.post('/addUser', async (req, res) => {
  const { name, age } = req.body;

  const newUser = new user({
    name,
    age
  });

  try {
    await connectToDatabase();
    const savedUser = await firstCollection.insertOne(newUser);
    res.render('AddedUser', {users: newUser });
    
    console.log(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error inserting document' });
  }
});

//____________________________________DELETE BY ID_______________________________________

app.post('/deleteuserbyid', async (req, res) => {

  try {
    const { ObjectId } = require('mongodb');


    const number = req.body._id;
    const objectId = new ObjectId(String(number));
    console.log(objectId);

    await connectToDatabase();

    const result  = await firstCollection.deleteOne({ _id: objectId});
  
      if (result.deletedCount === 1) {
        res.status(200).send('Document deleted successfully');

      } else {
        res.status(404).send('Document not found');
      }
}
catch (err) {
  console.error(err);
  res.status(500).send('Error retrieving document');
  redirect();
}
});

//____________________________________DELETE BY NAME_______________________________________

app.post('/deleteuserbyname', async (req, res) => {
  try {

    const name = req.body.name;
    console.log(name);
    await connectToDatabase();
    const result  = await firstCollection.deleteMany({ name: name});

      if (result.deletedCount > 0) {
        res.status(200).send('Document deleted successfully');
        
      } else {
        res.status(404).send('Document not found');
      }
}
catch (err) {
  console.error(err);
  res.status(500).send('Error retrieving document');
}
});

