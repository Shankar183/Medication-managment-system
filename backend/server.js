const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const medicationRoutes = require('./routes/medicationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/medications', medicationRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});