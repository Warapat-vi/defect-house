const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {executeQuery} = require('../db/executeQuery')

const isNullData  = (obj) => {
  return _.isNull(obj) || _.isUndefined(obj) || _.isEmpty(obj)
}

router.get('/defect_log', async (req, res) => {
  const { parent_id, location_id, status_id, type_id } = req.query;
  try {
    let query = 'SELECT * FROM defect_log where 1=1 ';
    let params = [];

    if(!isNullData(parent_id)) {
      query += ' and parent_id = ? ';
      params.push(parent_id);
    }

    if(!isNullData(location_id)) {
      query += ' and location_id = ? ';
      params.push(location_id);

    }
    if(!isNullData(status_id)) {
      query += ' and status = ? ';
      params.push(status_id);

    }

    if(!isNullData(type_id)) {
      query += ' and type_id = ? ';
      params.push(type_id);

    }

    const defectLogs = await executeQuery(query, params);
    res.json(defectLogs);
    
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  }
});

// POST route for inserting a new defect log
router.post('/defect_log', async (req, res) => {
  const { type_id, detail, remark, status, parent_id } = req.body;

  try {
    const insertDefectLogQuery = 'INSERT INTO defect_log (id, type_id, detail, remark, status, parent_id) VALUES (null, ?, ?, ?, ?, ?)';
    const result = await executeQuery(insertDefectLogQuery, [type_id, detail, remark, status, parent_id]);
    const defectLogId = result.insertId;

    res.status(201).json({ message: 'Defect log created successfully', defectLogId });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  }
});

router.put('/defect_log/:id', async (req, res) => {
  const { id } = req.params;
  const { type_id, detail, remark, status, parent_id, images } = req.body;

  try {
    // Update defect_log
    const updateDefectLogQuery = 'UPDATE defect_log SET type_id = ?, detail = ?, remark = ?, status = ?, parent_id = ? WHERE id = ?';
    await executeQuery(updateDefectLogQuery, [type_id, detail, remark, status, parent_id, id]);

    res.status(200).json({ message: 'Defect log updated successfully' });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  }
});

router.get('/defect_log/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM defect_log WHERE id = ?';
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
