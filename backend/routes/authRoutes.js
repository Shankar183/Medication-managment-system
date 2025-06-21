const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/signup', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
  db.run(query, [username, password, role], function (err) {
    if (err) {
      return res.status(500).json({ message: 'User already exists or DB error.', error: err.message });
    } else {
      res.status(200).json({ message: 'User registered successfully!' });
    }
  });
});

module.exports = router;