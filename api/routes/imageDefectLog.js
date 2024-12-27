const express = require('express');
const router = express.Router();
const multer = require('multer');
const _ = require('lodash');
// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {executeQuery} = require('../db/executeQuery')

router.get('/image_defect_log/:defectLogId', async (req, res) => {
  const { defectLogId } = req.params;
  try {
    const query = 'SELECT * FROM image_defect_log WHERE defect_log_id = ? ORDER BY id DESC';
    const imageDefectLog = await executeQuery(query, [defectLogId]);

    if (imageDefectLog.length === 0) {
      return res.status(404).json({ message: 'Image defect log not found' });
    }

    const result = imageDefectLog.map(log => {
      return {
        created_at: log.created_at, 
        id: log.id,
        image_data: log.image_64.toString('base64')
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  }
});

// POST route for inserting a new image defect log with file upload
router.post('/image_defect_log', upload.single('image'), async (req, res) => {
  const { defect_log_id } = req.body;
  const image = req.file;

  try {
    const insertImageDefectLogQuery = 'INSERT INTO image_defect_log (defect_log_id, image_64) VALUES (?, ?)';
    const result = await executeQuery(insertImageDefectLogQuery, [defect_log_id, image.buffer]);

    res.status(201).json({ message: 'Image defect log created successfully', imageDefectLogId: result.insertId });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  }
});

// DELETE route for deleting an image defect log by ID
router.delete('/image_defect_log/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const deleteImageDefectLogQuery = 'DELETE FROM image_defect_log WHERE id = ?';
    const result = await executeQuery(deleteImageDefectLogQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Image defect log not found' });
    }

    res.status(200).json({ message: 'Image defect log deleted successfully' });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Error executing query');
  }
});


module.exports = router;
