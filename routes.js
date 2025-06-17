import express from 'express';
import pool from './db.js';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

const router = express.Router();
router.use(bodyParser.json());

//get all users
router.get ('/userDetail', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching user details', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //create user route
router.post('/userDetail', async (req, res) => {
    const { name, email, password } = req.body;

    try {
       
      const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
        const values = [name, email, hashedPassword];

        await pool.query(insertQuery, values);
        console.log("User Created Successfully");
        res.status(201).json({ 
          status: 'ok', 
          message: 'User created successfully' 
        });
    } catch (error) {
        console.error('Error creating user', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//login user route
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

//Getting all Plotting Data
router.get('/plottingData', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM titles');
    res.status(200).json(rows);

  } catch (error) {
    console.log('Error Getting Datas: ', error);
  }
})

// Insert Plotting data route
router.post('/plottingData', async (req, res) => {
  const { titleNo, owner, date, surveyNo, lotNo, blkNo, area, monument, easting, northing, geojson, pluscode } = req.body;

  try {

    const plotData = 'INSERT INTO titles (title_no, title_name, date, survey_no, lot_no, blk_no, area, monument, easting, northing, geojson, pluscode, the_geom) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, ST_SetSRID(ST_GeomFromGeoJSON($13), 4326))';
    const values = [ titleNo, owner, date, surveyNo, lotNo, blkNo, area, monument, easting, northing, geojson, pluscode, geojson ];
    await pool.query(plotData, values);

       console.log("Data Saved");
        res.status(201).json({ 
          status: 'ok', 
          message: 'Data saved succesfully' 
        });

  } catch (err) {
    console.log('Error Saving Data: ', err);
  }

})


export default router;