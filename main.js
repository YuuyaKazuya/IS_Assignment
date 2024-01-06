/**
 * @swagger
 * /registerhost:
 *   post:
 *     summary: Register a new host account
 *     tags: [Host]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - name
 *               - email
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Host registered successfully
 *       400:
 *         description: Host already exists
 */

// Host Register New Account/ create
app.post('/registerhost', verifySecurity, async (req, res) => {
  const hosts = db.collection('hosts');
  const { username, password, name, email, role } = req.body;

  // Check if the username is already taken
  const existingHost = await hosts.findOne({ username });
  if (existingHost) {
    return res.status(400).json({ error: 'Host already exists' });
  }

  // Insert the new host into the database
  await hosts.insertOne({ username, password, name, email, role });

  // Respond with a success message
  res.status(201).json({ message: 'Host registered successfully' });
});

// Serve the admin login page
app.get('/login', (req, res) => {
  res.render('login'); // Assuming 'admin-login.ejs' is in the 'views' folder
});

// Serve the login page
app.get('/login', (req, res) => {
  res.render('login'); // Assuming 'login.ejs' is in the 'views' folder
});

/**
 * @swagger
 * /host/login:
 *   post:
 *     summary: Host login
 *     tags: [Host]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Host authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid username or password
 */

// Host login
app.post('/host/login', async (req, res) => {
  const hosts = db.collection('hosts');
  const { username, password } = req.body;

  try {
    const host = await hosts.findOne({ username, password });

    if (!host) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create token if the host was found
    const token = jwt.sign({ userId: host._id, role: 'host' }, secret, { expiresIn: '1h' });

    res.json({ message: 'Host authenticated successfully', accessToken: token });
  } catch (error) {
    console.error('Host authentication error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /updateHostContact:
 *   put:
 *     summary: Update contact number for a host (security only)
 *     tags: [Host]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: newPhoneNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact number updated successfully
 *       401:
 *         description: Unauthorized - Only security can update contact number
 *       404:
 *         description: Host not found
 */

// Update Host Contact Number (security only)
app.put('/updateHostContact', verifyToken, verifySecurity, async (req, res) => {
  const hosts = db.collection('hosts');
  const { username, newPhoneNumber } = req.query;

  // Check if the host exists
  const existingHost = await hosts.findOne({ username });
  if (!existingHost) {
    return res.status(404).json({ error: 'Host not found' });
  }

  // Update the contact number for the host
  await hosts.updateOne({ username }, { $set: { phoneNumber: newPhoneNumber } });

  // Respond with a success message
  res.status(200).json({ message: 'Contact number updated successfully' });
});

/**
 * @swagger
 * /create/test/host:
 *   post:
 *     summary: Test route to create a host without security approval
 *     tags: [Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Test host created successfully
 *       400:
 *         description: Host already exists
 *       500:
 *         description: An error occurred during the test
 */

// Test route to create a host without security approval
app.post('/create/test/host', async (req, res) => {
  const hosts = db.collection('hosts');
  const { username, password } = req.body;

  try {
    const existingHost = await hosts.findOne({ username });
    if (existingHost) {
      return res.status(400).json({ error: 'Host already exists' });
    }

    await hosts.insertOne({ username, password });
    res.status(201).json({ message: 'Test host created successfully' });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ error: 'An error occurred during the test', details: error.message });
  }
});

/**
 * @swagger
 * /registersecurity:
 *   post:
 *     summary: Register a new admin account
 *     tags: [Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Security registered successfully
 *       400:
 *         description: Security already exists
 */


// Security Register New Account
app.post('/registersecurity', async (req, res) => {
  const securityCollection = db.collection('security');
  const { username, password } = req.body;

  const existingSecurity = await securityCollection.findOne({ username });
  if (existingSecurity) {
    return res.status(400).json({ error: 'Security already exists' });
  }

  await securityCollection.insertOne({ username, password });
  res.status(201).json({ message: 'Security registered successfully' });
});

/**
 * @swagger
 * /loginsecurity:
 *   post:
 *     summary: Security login
 *     tags: [Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Security authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid username or password
 */


// Security Login
app.post('/loginsecurity', async (req, res) => {
  const securityCollection = db.collection('security');
  const { username, password } = req.body;

  const security = await securityCollection.findOne({ username, password });
  if (!security) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Create token if the security personnel was found
  const token = jwt.sign({ userId: security._id, role: 'security' }, secret, { expiresIn: '1h' });

  res.json({ message: 'Security authenticated successfully', accessToken: token });
});

/**
 * @swagger
 * /registervisitor:
 *   post:
 *     summary: Register a new visitor
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Visitor'
 *     responses:
 *       201:
 *         description: Visitor registered successfully
 *       500:
 *         description: Error occurred while registering the visitor
 */


// Protected route for admin registering a visitor - token required
app.post('/registervisitor', verifyToken, async (req, res) => {
  try {
    const visitors = db.collection('visitors');
    const { username, password, Name, Age, Gender, Address, Zipcode, Relation } = req.body;

    await visitors.insertOne({ username, password, Name, Age, Gender, Address, Zipcode, Relation });
    res.status(201).json({ message: 'Visitor registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while registering the visitor' });
  }
});

// Security personnel register new visitor
app.post('/registersecurityvisitor', verifySecurity, async (req, res) => {
  try {
    // Add logic to check if the requester is a valid security personnel
    const securityCollection = db.collection('security');
    const { username } = req.user; // Assuming you store username in the token payload

    const validSecurity = await securityCollection.findOne({ username });

    if (!validSecurity) {
      return res.status(403).json({ error: 'Unauthorized. Not a valid security personnel.' });
    }

    const visitors = db.collection('visitors');
    const { Name, Age, Gender, Address, Zipcode, Relation } = req.body;

    await visitors.insertOne({ Name, Age, Gender, Address, Zipcode, Relation });
    res.status(201).json({ message: 'Visitor registered successfully by security personnel' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while registering the visitor' });
  }
});

/**
 * @swagger
 * /viewvisitor:
 *   get:
 *     summary: View all visitors
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all visitors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Visitor'
 *       500:
 *         description: Error occurred while fetching visitors
 */


// Protected route for viewing visitors - token required
app.get('/viewvisitor', verifyToken, async (req, res) => {
  try {
    const visitors = db.collection('visitors');
    const results = await visitors.find().toArray();

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching visitors' });
  }
});


/**
 * @swagger
 * /issuevisitorpass:
 *   post:
 *     summary: Issue a visitor pass
 *     tags: [Pass]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - visitorId
 *               - issuedBy
 *               - validUntil
 *             properties:
 *               visitorId:
 *                 type: string
 *               issuedBy:
 *                 type: string
 *               validUntil:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Visitor pass issued successfully
 *       500:
 *         description: Error occurred while issuing the pass
 */



// Admin issue visitor pass
app.post('/issuevisitorpass', verifyToken, async (req, res) => {
  const { visitorId, issuedBy, validUntil } = req.body;

  try {
    const visitorPasses = db.collection('visitorpasses');

    const newPass = {
      visitorId,
      issuedBy,
      validUntil,
      issuedAt: new Date(),
    };

    await visitorPasses.insertOne(newPass);
    res.status(201).json({ message: 'Visitor pass issued successfully' });
  } catch (error) {
    console.error('Issue Pass Error:', error.message);
    res.status(500).json({ error: 'An error occurred while issuing the pass', details: error.message });
  }
});

/**
 * @swagger
 * /retrievepass/{visitorId}:
 *   get:
 *     summary: Retrieve a visitor pass
 *     tags: [Pass]
 *     parameters:
 *       - in: path
 *         name: visitorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The visitor ID
 *     responses:
 *       200:
 *         description: Visitor pass details
 *       404:
 *         description: No pass found for this visitor
 *       500:
 *         description: Error occurred while retrieving the pass
 */


//Visitor to Retrieve Their Pass
// Visitor Retrieve Pass
app.get('/retrievepass/:visitorId', async (req, res) => {
  const visitorId = req.params.visitorId;

  try {
    const visitorPasses = db.collection('visitorpasses');
    const pass = await visitorPasses.findOne({ visitorId });

    if (!pass) {
      return res.status(404).json({ error: 'No pass found for this visitor' });
    }

    res.json(pass);
  } catch (error) {
    console.error('Retrieve Pass Error:', error.message);
    res.status(500).json({ error: 'An error occurred while retrieving the pass', details: error.message });
  }
});


/**
 * @swagger
 * /updatevisitor/{visitorId}:
 *   patch:
 *     summary: Update visitor details
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: visitorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The visitor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VisitorUpdate'
 *     responses:
 *       200:
 *         description: Visitor updated successfully
 *       404:
 *         description: No visitor found with this ID
 *       500:
 *         description: Error occurred while updating the visitor
 */

/**
 * @swagger
 * /retrieveHostContact/{passId}:
 *   get:
 *     summary: Retrieve the contact number of the host from a visitor pass
 *     tags: [Pass]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: passId
 *         required: true
 *         schema:
 *           type: string
 *         description: The visitor pass ID
 *     responses:
 *       200:
 *         description: Contact number retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hostContactNumber:
 *                   type: string
 *       401:
 *         description: Unauthorized - Only security can retrieve host contact number
 *       404:
 *         description: Visitor pass not found
 */

// // Retrieve Host Contact Number from Visitor Pass (security only)
// app.get('/retrieveHostContact/:passId', verifyToken, verifySecurity, async (req, res) => {
//   const visitorPasses = db.collection('visitorpasses');
//   const hosts = db.collection('hosts');

//   const passId = req.params.passId;

//   try {
//     // Find the visitor pass
//     const visitorPass = await visitorPasses.findOne({ _id: new ObjectId(passId) });

//     if (!visitorPass) {
//       return res.status(404).json({ error: 'Visitor pass not found' });
//     }

//     // Check if the requester is a valid security personnel
//     const { username } = req.user;
//     const validSecurity = await db.collection('security').findOne({ username });

//     if (!validSecurity) {
//       return res.status(403).json({ error: 'Unauthorized. Not a valid security personnel.' });
//     }

//     // security Retrieve host contact number from visitor pass 
//     const host = await hosts.findOne({ _id: new ObjectId(visitorPass.issuedBy) });

//     if (!host) {
//       return res.status(404).json({ error: 'Host not found for this visitor pass' });
//     }

//     // Respond with the host's contact number
//     res.json({ hostContactNumber: host.phoneNumber });
//   } catch (error) {
//     console.error('Retrieve Host Contact Number Error:', error.message);
//     res.status(500).json({ error: 'An error occurred while retrieving the host contact number', details: error.message });
//   }
// });
app.get('/retrieveHostContact/:passId', verifySecurity, async (req, res) => {
  try {
    // Check if the requester is a valid security personnel
    const { username } = req.user;
    const validSecurity = await db.collection('security').findOne({ username });

    if (!validSecurity) {
      return res.status(403).json({ error: 'Unauthorized. Not a valid security personnel.' });
    }

    // The rest of your code to retrieve host contact number...
    // The rest of your code to retrieve host contact number...
const hosts = db.collection('hosts');
const passId = req.params.passId;

// Find the visitor pass
const visitorPass = await db.collection('visitorpasses').findOne({ _id: new ObjectId(passId) });

if (!visitorPass) {
  return res.status(404).json({ error: 'Visitor pass not found' });
}

// Retrieve host contact number
const host = await hosts.findOne({ _id: new ObjectId(visitorPass.issuedBy) });

if (!host) {
  return res.status(404).json({ error: 'Host not found for this visitor pass' });
}

    // Respond with the host's contact number
    res.json({ hostContactNumber: host.phoneNumber });
  } catch (error) {
    console.error('Retrieve Host Contact Number Error:', error.message);
    res.status(500).json({ error: 'An error occurred while retrieving the host contact number', details: error.message });
  }
});

// app.get('/retrieveHostContact/:passId', verifySecurity, async (req, res) => {
//   try {
//     // Check if the requester is a valid security personnel
//     const { username } = req.user;
//     const validSecurity = await db.collection('security').findOne({ username });

//     if (!validSecurity) {
//       return res.status(403).json({ error: 'Unauthorized. Not a valid security personnel.' });
//     }

//     const hosts = db.collection('hosts');
//     const passId = req.params.passId;

//     // Find the visitor pass
//     const visitorPass = await db.collection('visitorpasses').findOne({ _id: new ObjectId(passId) });

//     if (!visitorPass) {
//       return res.status(404).json({ error: 'Visitor pass not found' });
//     }

//     // Retrieve host contact number
//     const host = await hosts.findOne({ _id: new ObjectId(visitorPass.issuedBy) });

//     if (!host) {
//       return res.status(404).json({ error: 'Host not found for this visitor pass' });
//     }

//     // Respond with the host's contact number
//     res.json({ hostContactNumber: host.phoneNumber });
//   } catch (error) {
//     console.error('Retrieve Host Contact Number Error:', error.message);
//     res.status(500).json({ error: 'An error occurred while retrieving the host contact number', details: error.message });
//   }
// });

//Update visitor
app.patch('/updatevisitor/:visitorId', verifyToken, async (req, res) => {
  const visitorId = req.params.visitorId;
  const updateData = req.body;

  try {
    const updatedVisitor = await db.collection('visitors').updateOne(
      { _id: new ObjectId(visitorId) }, // Use 'new' with ObjectId
      { $set: updateData }
    );

    if (updatedVisitor.matchedCount === 0) {
      return res.status(404).json({ message: 'No visitor found with this ID' });
    }

    res.json({ message: 'Visitor updated successfully', updatedVisitor });
  } catch (error) {
    console.error('Update error:', error); // Log the entire error object
    res.status(500).json({ error: 'An error occurred while updating the visitor', details: error.toString() });
  }
});

/**
 * @swagger
 * /deletevisitor/{visitorId}:
 *   delete:
 *     summary: Delete a visitor
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: visitorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The visitor ID
 *     responses:
 *       200:
 *         description: Visitor deleted successfully
 *       404:
 *         description: No visitor found with this ID
 *       500:
 *         description: Error occurred while deleting the visitor
 */


// Delete visitor
app.delete('/deletevisitor/:visitorId', verifyToken, async (req, res) => {
  const visitorId = req.params.visitorId;

  try {
    const deletionResult = await db.collection('visitors').deleteOne(
      { _id: new ObjectId(visitorId) } // Use 'new' with ObjectId
    );

    if (deletionResult.deletedCount === 0) {
      return res.status(404).json({ message: 'No visitor found with this ID' });
    }

    res.json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error); // Log the entire error object
    res.status(500).json({ error: 'An error occurred while deleting the visitor', details: error.toString() });
  }
});

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Visitor:
 *       type: object
 *       required:
 *         - Name
 *         - Age
 *         - Gender
 *         - Address
 *         - Zipcode
 *         - Relation
 *       properties:
 *         Name:
 *           type: string
 *         Age:
 *           type: integer
 *         Gender:
 *           type: string
 *         Address:
 *           type: string
 *         Zipcode:
 *           type: string
 *         Relation:
 *           type: string
 *     VisitorUpdate:
 *       type: object
 *       properties:
 *         Name:
 *           type: string
 *         Age:
 *           type: integer
 *         Gender:
 *           type: string
 *         Address:
 *           type: string
 *         Zipcode:
 *           type: string
 *         Relation:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         username: 
 *           type: string
 *         password: 
 *           type: string
 *         phone: 
 *           type: string
 */
