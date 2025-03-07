const express = require('express');
const cors = require('cors')
// const bodyParser = require('body-parser');
const runnerRoute = require('./routes/runner.route.js');
const runRoute = require('./routes/run.route.js');
require('dotenv').config();

// สร้าง Web Server
const app = express();  

// สร้างตัวแปรเก็บค่า port number ที่อยู่ใน .env
const PORT = process.env.PORT || 4040;

// สร้าง route เพื่อเทส
// app.get('/', (req, res) => {
//     res.json({ message: 'Test connect server running OK!!!' });
// })

//ใช้สิ่งที่เรียกว่า MiddleWare ในการจัดการ request และ response 
app.use(cors())
// app.use(bodyParser.json());
// ใช้ middleware นี้แทน bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/runner', runnerRoute);
app.use('/run', runRoute);
app.use('/images/runner', express.static('images/runner'));
app.use('/images/run', express.static('images/run'));

// กำหนดช่องทางในการติดต่อ web server
// พร้อมกับการรอรับ request จาก client/user
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} ...`);
    //console.log('Server is running on port ' + PORT);
})
