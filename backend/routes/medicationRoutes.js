const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/add', (req, res) => {
  const { name, dosage, frequency } = req.body;
  if (!name || !dosage || !frequency) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const query = `INSERT INTO medications (name, dosage, frequency) VALUES (?, ?, ?)`;
  db.run(query, [name, dosage, frequency], function (err) {
    if (err) return res.status(500).json({ message: 'Error adding medication.' });
    res.status(200).json({ message: 'Medication added successfully!' });
  });
});

router.get('/', (req, res) => {
  db.all(`SELECT * FROM medications`, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching medications.' });
    res.status(200).json(rows);
  });
});

module.exports = router;