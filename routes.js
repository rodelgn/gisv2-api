import express from 'express';
import pool from './db.js';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

const router = express.Router();
router.use(bodyParser.json());

router.get ('/userDetail', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching user details', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.post('/userDetail', async (req, res) => {
    const { name, email, password } = req.body;

    try {
       
      const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
        const values = [name, email, hashedPassword];

        await pool.query(insertQuery, values);
        console.log("User Created Successfully");
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/loginUser', async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log("User Logged In Successfully");
        res.status(200).json({ 
            status: 'ok',
            user: { 
              id: user.rows[0].id,
              name: user.rows[0].name,
              email: user.rows[0].email
            }
          });

    } catch (error) {
        console.error('Error logging in user', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;