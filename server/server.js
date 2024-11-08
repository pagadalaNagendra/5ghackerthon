const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Smartcityfiveg',
  password: 'postgres',
  port: 5432,
});

let lastData = { temperature: null, humidity: null }; // Store the last fetched data

const fetchAndStoreData = async () => {
  try {
    const response = await axios.get('https://ctop.iiit.ac.in/api/nodes/get-node/AQ08-0032-0001/latest');
    const data = response.data['m2m:cin'];

    const [temperature, humidity] = JSON.parse(data.con.replace(/'/g, '"'));

    // Check if the data has changed
    if (temperature !== lastData.temperature || humidity !== lastData.humidity) {
      // Insert data into the database
      await pool.query(
        'INSERT INTO sensor_data (temperature, humidity) VALUES ($1, $2)',
        [temperature, humidity]
      );
      console.log('Data inserted successfully:', { temperature, humidity });

      // Update the last data
      lastData = { temperature, humidity };
    } else {
      console.log('No change in data, skipping insertion.');
    }
  } catch (err) {
    console.error('Error fetching or inserting data:', err);
  }
};


const retrieveAndStoreWaterData = async () => {
  try {
    const response = await axios.get('https://ctop.iiit.ac.in/api/nodes/get-node/WQ06-0032-0001/latest');
    const data = response.data['m2m:cin'];

    const [tds, temperature] = JSON.parse(data.con.replace(/'/g, '"'));

    // Validate data
    if (typeof tds !== 'number' || typeof temperature !== 'number') {
      throw new Error('Invalid data format: tds and temperature must be numbers.');
    }

    // Check if the data has changed
    if (tds !== lastData.tds || temperature !== lastData.temperature) {
      // Insert data into the database
      await pool.query(
        'INSERT INTO water_data (tds, temperature) VALUES ($1, $2)',
        [tds, temperature]
      );
      console.log('Data inserted successfully:', { tds, temperature });

      // Update the last data
      lastData = { tds, temperature };
    } else {
      console.log('No change in data, skipping insertion.');
    }
  } catch (err) {
    console.error('Error occurred:', err.message);
  }
};


app.post('/api/sensor-data', async (req, res) => {
  const { temperature, humidity } = req.body;

  if (temperature == null || humidity == null) {
    return res.status(400).json({ error: 'Temperature and humidity are required' });
  }

  try {
    // Insert the data into the database
    await pool.query(
      'INSERT INTO sensor_data (temperature, humidity) VALUES ($1, $2)',
      [temperature, humidity]
    );
    console.log('Data inserted successfully:', { temperature, humidity });
    res.status(201).json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error('Error inserting data into the database:', err);
    res.status(500).json({ error: 'Database insertion failed' });
  }
});

app.post('/api/water-data', async (req, res) => {
  const { tds, temperature } = req.body;

  // Validate the data
  if (tds == null || temperature == null) {
    return res.status(400).json({ error: 'TDS and temperature are required' });
  }

  // Check if the data types are correct
  if (typeof tds !== 'number' || typeof temperature !== 'number') {
    return res.status(400).json({ error: 'Invalid data format: TDS and temperature must be numbers.' });
  }

  try {
    // Insert the data into the database
    await pool.query(
      'INSERT INTO water_data (tds, temperature) VALUES ($1, $2)',
      [tds, temperature]
    );
    console.log('Data inserted successfully:', { tds, temperature });
    res.status(201).json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error('Error inserting data into the database:', err);
    res.status(500).json({ error: 'Database insertion failed' });
  }
});



app.get('/api/sensor-data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sensor_data ORDER BY id ASC'); // Normal order
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});


setInterval(fetchAndStoreData, 30000);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
