const express = require('express');
const router = express.Router();
const {executeQuery} = require('../db/executeQuery')

const getDataExport = async (status_id) => {
    try {
        const query = `SELECT d.id,d.detail,d.remark,d.created_at,d.updated_at, s.name as status, t.name as type, l.name as location
        FROM defect_log d 
        join status_defect_log s on d.status = s.id 
        join type_defect_log t on d.type_id = t.id 
        left join location l on d.location_id = l.id 
        where d.status = ? 
        order by l.id, t.id, d.id
        `;
        const resQuery = await executeQuery(query, [status_id]);

        const result = await Promise.all(resQuery.map(async (data, index) => {
            return {...data, no: index + 1};
        }));
        return result;
      
    } catch (err) {
      console.error('Error executing query:', err);
      return [];
    }
}

router.get('/export/json', async (req, res) => {
    console.log('status export/json')
    const { status_id } = req.query;

    const dataExcel = await getDataExport(status_id);
    res.json(dataExcel);
    console.log('end export/json')

});

module.exports = router;