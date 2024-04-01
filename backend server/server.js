// 4th question Integration with a backend server and [Develop functionality to edit the data displayed in the table and save the
//   changes to the local storage.]

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config(); // Loading environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Connecting to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Defined a schema for my data
const dataSchema = new mongoose.Schema({
  name: String,
  processorBaseFrequency: String,
  lithography: String,
  tdp: String,
});

const Data = mongoose.model('Data', dataSchema);

// Reading the API_DATA.json file
const apiData = JSON.parse(fs.readFileSync('API_DATA.json', 'utf8'));

// Insert the data into the database
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    // Check if the data already exists in the database
    const count = await Data.countDocuments();
    if (count === 0) {
      // Map the data from API_DATA.json to match the schema
      const mappedData = Object.values(apiData).map((item) => ({
        name: item.name,
        processorBaseFrequency: item.Performance?.['Processor Base Frequency'] || '',
        lithography: item.Essentials?.['Lithography'] || '',
        tdp: item.Performance?.['TDP'] || '',
      }));

      // Insert the mapped data into the database
      await Data.insertMany(mappedData);
      console.log('Data inserted successfully');
    } else {
      console.log('Data already exists in the database');
    }
  } catch (error) {
    console.error('Error inserting data:', error);
  }
});

// API endpoint to fetch data from the database

app.get('/api/data', async (req, res) => {
    try {
      const data = await Data.find();
      console.log('Data:', data);
      res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// API endpoint to update data in the database
app.put('/api/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    await Data.findByIdAndUpdate(id, updatedData);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 5002;
mongoose.set('strictQuery', false);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});