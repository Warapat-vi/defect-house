const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const port = 3001;

const defectLog = require('./routes/defectLog');
const imageDefectLog = require('./routes/imageDefectLog');
const statusDefectLog = require('./routes/statusDefectLog');
const typeDefectLog = require('./routes/typeDefectLog');
const locations = require('./routes/locations');
const exportData = require('./routes/export');

app.use(cors({
  origin: '*', // เปลี่ยนเป็นโดเมนของ frontend ของคุณ
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // ระบุวิธีการที่อนุญาต
  allowedHeaders: ['Content-Type', 'Authorization'] // ระบุ headers ที่อนุญาต
}));


// Middleware เพื่อเพิ่มความปลอดภัย
app.use(helmet());

// กำหนด Referrer-Policy
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));

// Middleware เพื่อ parse JSON
app.use(express.json());

// ใช้เส้นทางที่กำหนดใน userRoutes
app.use('/api', defectLog);
app.use('/api', imageDefectLog);
app.use('/api', statusDefectLog);
app.use('/api', typeDefectLog);
app.use('/api', locations);
app.use('/api', exportData);

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
