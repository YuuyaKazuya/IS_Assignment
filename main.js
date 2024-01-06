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
 *               - phoneNumber
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
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
  const { username, password, name, phoneNumber, email } = req.body;

  // Check if the username is already taken
  const existingHost = await hosts.findOne({ username });
  if (existingHost) {
    return res.status(400).json({ error: 'Host already exists' });
  }

  // Insert the new host into the database
  await hosts.insertOne({ username, password, name, phoneNumber, email });

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
 * /login:
 *   post:
 *     description: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password: 
 *                type: string
 *
 */

/**
 * @swagger
 * /home:
 *   get:
 *     description: Get visitor by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: home
 *         
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Welcome to BENR3433 Residences!
 */
app.get('/home', (req, res) => {
})

/**
 * @swagger
 * /logout:
 *   post:
 *     description: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *       responses:
 *        200:
 *          description: Successful login
 *          content:
 *            application/json:
 *              schema:
 *        401:
 *          description: Invalid username or password
 */
app.post('/logout', async (req, res) => {
    console.log(req.body);

    let user = await User.login(req.body.username, req.body.password);
})

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
