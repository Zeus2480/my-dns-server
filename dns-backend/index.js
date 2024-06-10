const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// MongoDB connection
mongoose.connect('mongodb+srv://dns-server:Treehouse2480@cluster0.njfyil0.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define the Record model
const recordSchema = new mongoose.Schema({
  domain: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: String, required: true },
});

const Record = mongoose.model('Record', recordSchema);

// CRUD endpoints for managing DNS records

// Create a new DNS record
app.post('/records', async (req, res) => {
  try {
    console.log(req.body)
    const { domain, type, value } = req.body;
    const record = new Record({ domain, type, value });
    await record.save();
    res.status(201).send(record);
  } catch (error) {
    res.status(400).send({ message: 'Error creating record', error });
  }
});

// Get all records for a domain
app.get('/records/:domain', async (req, res) => {
  try {
    const records = await Record.find({ domain: req.params.domain });
    res.send(records);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching records', error });
  }
});

// Update a DNS record by ID
app.put('/records/:id', async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) {
      return res.status(404).send({ message: 'Record not found' });
    }
    res.send(record);
  } catch (error) {
    res.status(400).send({ message: 'Error updating record', error });
  }
});

// Delete a DNS record by ID
app.delete('/records/:id', async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).send({ message: 'Record not found' });
    }
    res.send({ message: 'Record deleted', record });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting record', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
