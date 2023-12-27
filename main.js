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