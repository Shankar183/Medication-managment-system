const db = require('../config/database');

// Get all medications for a user
exports.getMedications = (req, res) => {
  const { userId } = req.params;

  const query = 'SELECT * FROM medications WHERE userId = ?';

  db.all(query, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
};

// Mark a medication as taken
exports.markMedicationAsTaken = (req, res) => {
  const { medicationId } = req.params;

  const query = 'UPDATE medications SET taken = 1 WHERE id = ?';

  db.run(query, [medicationId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Medication not found' });
    } else {
      res.json({ message: 'Medication marked as taken' });
    }
  });
};

// Get adherence percentage for a user
exports.getAdherence = (req, res) => {
  const { userId } = req.params;

  const totalQuery = 'SELECT COUNT(*) as total FROM medications WHERE userId = ?';
  const takenQuery = 'SELECT COUNT(*) as taken FROM medications WHERE userId = ? AND taken = 1';

  db.get(totalQuery, [userId], (err, totalRow) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      db.get(takenQuery, [userId], (err, takenRow) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          const total = totalRow.total;
          const taken = takenRow.taken;
          const adherence = total === 0 ? 0 : ((taken / total) * 100).toFixed(2);

          res.json({ adherence: `${adherence}%` });
        }
      });
    }
  });
};



// Add Medication Controller
const addMedication = (req, res) => {
  const { patientId, name, dosage, frequency, startDate, endDate } = req.body;

  // Basic validation
  if (!patientId || !name || !dosage || !frequency || !startDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO medications (patientId, name, dosage, frequency, startDate, endDate)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [patientId, name, dosage, frequency, startDate, endDate || null];

  db.run(query, values, function (err) {
    if (err) {
      console.error('Error adding medication:', err);
      return res.status(500).json({ error: 'Failed to add medication' });
    }

    res.status(201).json({
      message: 'Medication added successfully',
      medicationId: this.lastID
    });
  });
};

module.exports = {
  addMedication
};