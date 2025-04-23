import { Client } from 'pg';


const db = {
    user: "postgres",
    host: "localhost",
    database: "gis-clone",
    password: "admin",
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
    } catch (error) {
        console.error("Error creating table", error);
    }
  }

  createTable();

  export default pool;
