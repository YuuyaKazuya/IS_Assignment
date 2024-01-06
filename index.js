const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition:{
    openapi:'3.0.0',
    info:{
      title: 'Assignment IS API',
      version:'1.0.0',
    },
  },
  apis:['./main.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/sufi.Kimi-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// MongoDB connection URL
const uri =
  'mongodb+srv://Shahrin:Kimi1999@cluster0.twulge0.mongodb.net/hotelBERR';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
client
  .connect()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define database and collection names
const db = client.db('hotelBERR');
const adminuser = db.collection('hosts'); 
const securityCollection = db.collection('security');
const visitorregistration = db.collection('visitors');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Expecting "Bearer TOKEN_STRING"

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    // Check if the user has the required role (host or security)
    if (req.user.role !== 'host' && req.user.role !== 'security') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Failed to authenticate token' });
  }
};

const verifySecurity = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Expecting "Bearer TOKEN_STRING"

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    // Check if the user has the required role (security)
    if (req.user.role !== 'security') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Failed to authenticate token' });
  }
};

// Security personnel register host
app.post('/registersecurityhost', verifySecurity, async (req, res) => {
  const hosts = db.collection('hosts');
  const { username, password } = req.body;

  const existingHost = await hosts.findOne({ username });
  if (existingHost) {
    return res.status(400).json({ error: 'Host already exists' });
  }

  await hosts.insertOne({ username, password });
  res.status(201).json({ message: 'Host registered successfully' });
});


app.use(bodyParser.json());

// MongoDB connection setup

const secret = 'your-secret-key'; // Store this securely

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Import necessary modules once at the top of your file
const { MongoClient, ServerApiVersion } = require('mongodb');

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("hotelBERR").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
// Swagger setup and other code...

run().catch(console.dir);

// Connect to MongoDB and initialize collections
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    db = client.db('your-database-name');
  })
  .catch(err => console.error('MongoDB connection error:', err));

let db;
let Visitorregistration;
//let adminuser;
let hostuser;
let securityCollection; 


// Connect to MongoDB and initialize collections
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    db = client.db('hotelBERR');
    

  // Initialize collections after establishing the connection
  Visitorregistration = db.collection('visitors');
  adminuser = db.collection('hosts');
  // Add this within the `run` function where you initialize collections
  securityCollection = db.collection('security');



  // Now you can safely start your server here, after the DB connection is established
  app.listen(port, () => {
    console.log(`Server is running on https://is-assignment.azurewebsites.net/sufi.Kimi-docs/#`);
  });
});


// In-memory data storage (replace with a database in production)
const visitors = [];
//const admins = [];
const host = [];
const security = [];

app.use(express.json());

//function login(username, password) {
  //return usersCollection.findOne({ username })
    //.then((user) => {
      //if (user) {
        //if (user.password === password) {
          //return user; // Successful login
        //} else {
          //throw new Error('Invalid password');
        //}
      //}

      // Check in the dbUsers array for testing purposes
      // const testUser = dbUsers.find((dbUser) => dbUser.username === username && dbUser.password === password);
      // if (testUser) {
      //   return testUser;
      // }

      //throw new Error('User not found');
    //});
//}

//function register(username, password, name, email, role, building, apartment, phone) {
  //return usersCollection
    //.findOne({ $or: [{ username }, { email }] }) // Check if username or email already exists
    //.then((existingUser) => {
      //if (existingUser) {
        //console.log('Username or email already exists');
        ///throw new Error('Username or email already exists'); // Throw an error if username or email is already taken
      //}

      //const newUser = {
        //username,
        //password,
        //name,
        //email,
        //role,
      //};

      //return usersCollection
        //.insertOne(newUser)
        //.then(() => {
          //if (role === 'resident') {
            //const residentData = {
              //name,
              //building,
              //apartment,
              //phone,
            //};
            //return residentsCollection.insertOne(residentData); // Add resident data to residentsCollection
         // }
        //})
        //.then(() => {
          //return 'User registered successfully';
        //})
        //.catch((error) => {
          //throw new Error('Error registering user');
        //});
    //});
//}

/*function generateToken(userData) {
  const token = jwt.sign(userData, 'ApartmentSuperPassword');
  return token;
}

function verifyToken(req, res, next) {
  let header = req.headers.authorization;
  console.log(header);

  let token = header.split(' ')[1];

  jwt.verify(token, 'ApartmentSuperPassword', function (err, decoded) {
    if (err) {
      res.send('Invalid Token');
    }

    req.user = decoded;
    next();
  });
}

// Front page
app.get('/home', (req,res) => {
  res.send('Welcome to BENR2423 Residences!')
})

// Apply JSON middleware
app.use(express.json());

// Display Original VMS
app.get('/vms-plan',verifyToken, (req, res) => {
  res.sendFile(__dirname + '/VMS-Plan.jpeg');
})

// User registration
app.post('/userRegister', verifyToken, (req, res) => {
  // Check if the user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).send('Access denied. Only admin can register users.');
  }

  const { username, password, name, email, role, building, apartment, phone } = req.body;

  register(username, password, name, email, role, building, apartment, phone)
    .then(() => {
      res.send('User registered successfully');
    })
    .catch((error) => {
      res.status(500).send('Error registering user');
    });
});

// User login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  login(username, password)
    .then((user) => {
      let token = generateToken(user);
      console.log('User details:', user);
      res.send(token);
    })
    .catch((error) => {
      res.status(401).send(error.message);
    });
});

// User logout
app.post('/logout', (req, res) => {
  res.send('User logged out successfully');
});

// Create a visitor
app.post('/visitorRegister', verifyToken, (req, res) => {
  const { name, contact, gender } = req.body;

  // Generate a random 8-digit number for accesspass
  const accesspass = Math.floor(10000000 + Math.random() * 90000000);

  const visitorData = {
    accesspass: accesspass.toString(),
    name,
    contact,
    gender,
    building: null,
    apartment: null,
    whomtovisit: null,
    entryTime: null,
    checkoutTime: null
  };

  residentsCollection
    .findOne({ name: req.user.name }) // Find the resident's information by searching the user's name in residentsCollection
    .then((resident) => {
      if (resident) {
        visitorData.building = resident.building;
        visitorData.apartment = resident.apartment;
        visitorData.whomtovisit = resident.name; // Assuming resident's name is whom to visit
      }

      return visitorsCollection.insertOne(visitorData);
    })
    .then(() => {
      res.send(visitorData);
    })
    .catch((error) => {
      console.error('Error creating visitor:', error);
      res.status(500).send('An error occurred while creating the visitor');
    });
});

// Update a visitor
app.patch('/visitorUpdate', verifyToken, (req, res) => {
  const { contact, newcontact } = req.body;
  const userName = req.user.name;

  visitorsCollection
    .findOne({ contact })
    .then((visitor) => {
      if (!visitor) {
        res.status(404).send('No visitors with that phone number exist');
      } else if (visitor.whomtovisit !== userName) {
        res.status(403).send('You do not have a visitor with that phone number');
      } else {
        return visitorsCollection.findOneAndUpdate(
          { contact },
          { $set: { "contact" : newcontact } },
          { returnOriginal: false }
        );
      }
    })
    .then((result) => {
      if (result && result.value) {
        res.send('Visitor detail updated successfully');
      }
    })
    .catch((error) => {
      console.error('Error updating visitor:', error);
      res.status(500).send('An error occurred while updating the visitor');
    });
});

// Delete a visitor
app.delete('/visitorDelete', verifyToken, (req, res) => {
  const accesspass = req.body.accesspass;
  const userName = req.user.name;
  const userRole = req.user.role;

  visitorsCollection
    .findOne({ accesspass })
    .then((visitor) => {
      if (!visitor) {
        res.status(404).send('No visitor with this access pass exists');
      } else if (visitor.whomtovisit !== userName && userRole !== 'admin') {
        res.status(403).send('You do not have permission to delete this visitor');
      } else {
        return visitorsCollection.deleteOne({ accesspass });
      }
    })
    .then((result) => {
      if (result && result.deletedCount > 0) {
        res.send('Visitor deleted successfully');
      }
    })
    .catch((error) => {
      console.error('Error deleting visitor:', error);
      res.status(500).send('An error occurred while deleting the visitor');
    });
});

// Delete a user
app.delete('/userDelete', verifyToken, (req, res) => {
  const deletingUsername = req.body.username;

  usersCollection
    .findOne({ username: deletingUsername })
    .then((deletingUser) => {
      if (!deletingUser) {
        return res.status(404).send('No user with that username exists');
      } else if (req.user.role !== 'admin') {
        return res.status(403).send('You do not have permission to delete this user');
      } else {
        const deletePromises = [usersCollection.deleteOne({ username: deletingUsername })];

        if (deletingUser.role === 'resident') {
          deletePromises.push(residentsCollection.deleteOne({ name: deletingUser.name }));
        }

        return Promise.all(deletePromises);
      }
    })
    .then((results) => {
      const deletedUserResult = results[0];

      if (deletedUserResult && deletedUserResult.deletedCount > 0) {
        res.send('User deleted successfully');
      }
    })
    .catch((error) => {
      console.error('Error deleting user:', error);
      res.status(500).send('An error occurred while deleting the user');
    });
});

// View visitors
app.get('/visitors', verifyToken, (req, res) => {
  const userRole = req.user.role;
  const userName = req.user.name;

  if (userRole === 'admin') {
    visitorsCollection
      .find()
      .toArray()
      .then((visitors) => {
        if (visitors.length === 0) {
          res.send('No visitors found');
        } else {
          res.send(visitors);
        }
      })
      .catch((error) => {
        console.error('Error retrieving visitors:', error);
        res.status(500).send('An error occurred while retrieving visitors');
      });
  } else {
    visitorsCollection
      .find({ whomtovisit: userName })
      .toArray()
      .then((visitors) => {
        if (visitors.length === 0) {
          res.send('You do not have any visitors registered');
        } else {
          res.send(visitors);
        }
      })
      .catch((error) => {
        console.error('Error retrieving visitors:', error);
        res.status(500).send('An error occurred while retrieving visitors');
      });
  }
});

// Visitor access info
app.get('/visitorAccess', (req, res) => {
  const contact = req.body.contact;

  visitorsCollection
    .find({ contact })
    .toArray()
    .then((visitors) => {
      if (visitors.length === 0) {
        res.send('No visitors found with the given contact number');
      } else {
        res.send(visitors);
      }
    })
    .catch((error) => {
      console.error('Error retrieving visitors by contact:', error);
      res.status(500).send('An error occurred while retrieving visitors by contact');
    });
});

//Visitor check in
app.patch('/visitorCheckIn', verifyToken, (req, res) => {
  const accesspass = req.body.accesspass;
  const gmt8Time = moment().tz('GMT+8').format('YYYY-MM-DD HH:mm:ss');

  visitorsCollection
    .findOne({ accesspass })
    .then((visitor) => {
      if (!visitor) {
        res.status(404).send('No visitors with that access pass exists');
      } else {
        return visitorsCollection.findOneAndUpdate(
          { accesspass },
          { $set: { "entryTime" : gmt8Time } },
          { returnOriginal: false }
        );
      }
    })
    .then((result) => {
      if (result && result.value) {
        res.send('Visitor checked in successfully');
      }
    })
    .catch((error) => {
      console.error('Error updating visitor:', error);
      res.status(500).send('An error occurred while updating the visitor');
    });
});

//Visitor check out
app.patch('/visitorCheckOut', verifyToken, (req, res) => {
  const accesspass = req.body.accesspass;
  const gmt8Time = moment().tz('GMT+8').format('YYYY-MM-DD HH:mm:ss');

  visitorsCollection
    .findOne({ accesspass })
    .then((visitor) => {
      if (!visitor) {
        res.status(404).send('No visitors with that access pass exists');
      } else {
        return visitorsCollection.findOneAndUpdate(
          { accesspass },
          { $set: { "checkoutTime" : gmt8Time } },
          { returnOriginal: false }
        );
      }
    })
    .then((result) => {
      if (result && result.value) {
        res.send('Visitor checked out successfully');
      }
    })
    .catch((error) => {
      console.error('Error updating visitor:', error);
      res.status(500).send('An error occurred while updating the visitor');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});*/

