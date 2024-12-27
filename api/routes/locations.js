const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {executeQuery} = require('../db/executeQuery')

router.get('/location', async (req, res) => {
  try {
    const query = 'SELECT * FROM location order by sort asc';
    const defectLogs = await executeQuery(query);
    res.json(defectLogs);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  }
});

// POST route for inserting a new defect log
router.post('/location', async (req, res) => {
  const { name } = req.body;

  try {
    const insertDefectLogQuery = 'INSERT INTO location (id, name) VALUES (null, ?)';
    const result = await executeQuery(insertDefectLogQuery, [name]);
    const id = result.insertId;

    res.status(201).json({ message: 'Type Defect log created successfully', id });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  }
});

router.put('/location/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Update defect_log
    const updateDefectLogQuery = 'UPDATE location SET name = ? WHERE id = ?';
    await executeQuery(updateDefectLogQuery, [name, id]);

    res.status(200).json({ message: 'Type Defect log updated successfully' });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  }
});

router.get('/location/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM location WHERE id = ?';
    const defectLog = await executeQuery(query, [id]);

    if (defectLog.length === 0) {
      return res.status(404).json({ message: 'Defect log not found' });
    }

    res.json(_.head(defectLog));
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  }
});


module.exports = router;
