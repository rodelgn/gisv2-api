import express from 'express';
import pool from './db.js';
import bodyParser from 'body-parser';

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
        const insertQuery = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
        const values = [name, email, password];

        await pool.query(insertQuery, values);
        console.log("User Created");
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/loginUser', async (req, res) => {

    try {
        const { email, password } = req.body;

        const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
        const values = [email, password];

        const user = await pool.query(query, values);

        if (user.rows.length > 0) {
            console.log("User logged in successfully");
            res.status(200).json({ message: 'Login successful', user: user.rows[0] });
        } else {
            console.log("Invalid credentials");
            res.status(401).json({ error: 'Invalid credentials' });
        }

    } catch (error) {
        console.error('Error logging in user', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;