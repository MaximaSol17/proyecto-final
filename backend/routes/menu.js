const express = require('express');
const router = express.Router();
const db = require('../db'); // ajustá el path si está en otro lado

// GET /menu
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM menu ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


