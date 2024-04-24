const express = require('express');
const sql = require('mssql');
const saltRounds = 10; // Number of salt rounds for bcrypt to use
const bcrypt = require('bcrypt');
require('dotenv').config(); // To use environment variables from .env file

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
const cors = require('cors');
app.use(cors());  // This will allow all domains. For production, configure it more securely.


// Database connection configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, 
  database: process.env.DB_NAME,
  options: {
    encrypt: true, 
    trustServerCertificate: false 
  }
};

// Function to connect to the database
async function connectToDatabase() {
  try {
    await sql.connect(dbConfig);
    console.log('Connected to the database successfully');
  } catch (err) {
    console.error('Failed to connect to the database:', err);
  }
}

connectToDatabase();

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body; // Destructure email and password from request body
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('emailParam', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE email = @emailParam');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.json({ status: 'success', user: user, role: user.role  });
            } else {
                res.status(400).json({ status: 'error', message: 'Invalid credentials' });
            }
        } else {
            res.status(400).json({ status: 'error', message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Database query failed:', err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});


  
app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body; // Destructure required fields from request body

  try {
    // Connect to the database
    const pool = await sql.connect(dbConfig);

    // Check if the user already exists
    const userExists = await pool.request()
      .input('emailParam', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE email = @emailParam');

    if (userExists.recordset.length > 0) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into the database
    await pool.request()
      .input('fullNameParam', sql.VarChar, name)
      .input('emailParam', sql.VarChar, email)
      .input('passwordParam', sql.VarChar, hashedPassword)
      .input('roleParam', sql.VarChar, role) // Store role
      .query('INSERT INTO Users (name, email, password, role) VALUES (@fullNameParam, @emailParam, @passwordParam, @roleParam)');

    res.json({ status: 'success', message: 'User registered successfully' });
  } catch (err) {
    console.error('Database query failed:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});
  