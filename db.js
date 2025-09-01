import { Client } from 'pg';


const db = {
    user: "postgres",
    host: "localhost",
    password: "admin",
    database: "gis-clone",
    port: 5432,
  };

  const pool = new Client(db);
  
  pool.connect((err) => {
    if (err) {
      console.error("Error connecting to the database", err);
    } else {
      console.log("Connected to the database");
    }
  });

  async function createTable() { 

    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL
        )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS titles (
            id SERIAL PRIMARY KEY,
            title_no VARCHAR(100) NOT NULL,
            title_name VARCHAR(100) NOT NULL,
            date VARCHAR(100) NOT NULL,
            survey_no VARCHAR(100) NOT NULL,
            lot_no VARCHAR(100) NOT NULL,
            blk_no VARCHAR(100) NOT NULL,
            area VARCHAR(100) NOT NULL,
            monument VARCHAR(100),
            easting VARCHAR(100),
            northing VARCHAR(100),
            geojson JSON NOT NULL,
            the_geom GEOMETRY(Polygon, 4326),
            pluscode VARCHAR(100) NOT NULL
        )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS monuments (
            id SERIAL PRIMARY KEY, 
            monument VARCHAR(100) NOT NULL,
            easting VARCHAR(100) NOT NULL,
            northing VARCHAR(100) NOT NULL
        )`);

    } catch (error) {
        console.error("Error creating table", error);
    }
  }

  createTable();

  export default pool;
