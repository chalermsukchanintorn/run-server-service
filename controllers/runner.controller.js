// ไฟล์ประเภท controller เป็นไฟล์ที่จะทำงากับตารางในฐานข้อมูล (CRUD)
// C(create/insert) เพิ่ม 
// R(read/select) ค้นหา,ตรวจสอบ,ดึง,ดู
// U(update) แก้ไข
// D(delete) ลบ
const runner = require('./../models/runner.model.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//สร้างส่วนของการอัปโหลดไฟล์ด้วย multer ทำ 2 ขั้นตอน
//1. กําหนดตําแหน่งที่จะอัปโหลดไฟล์ และชื่อไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/runner');
    },
    filename: (req, file, cb) => {
        cb(null, 'runner_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
    }
});
//2. ฟังก์ชันอัปโหลดไฟล์
const uploadRunner = multer({
     storage: storage,
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
        fileFilter: (req, file, cb) => {
            const fileTypes = /jpeg|jpg|png/;
            const mimeType = fileTypes.test(file.mimetype);
            const extname = fileTypes.test(path.extname(file.originalname));
            if (mimeType && extname) {
                return cb(null, true);
            }
            cb('Give proper files formate to upload');
        }
}).single('runnerImage');

//ฟังก์ชันเพิ่มข้อมูลนักวิ่ง
// กรณีไม่มีการอัปโหลดไฟล์ใช้แบบนี้
// const addRunner = async (req, res) => {
//     try{
//         const result = await runner.create(req.body);
//         res.status(201).json({
//             message: 'Insert data successfully',
//             data: result
//         });
//     }catch(err){
//         res.status(500).json({ message: `ERROR:  ${err}` });
//     }
// }
// กรณีมีการอัปโหลดไฟล์ (โดยที่ผู้ใช้จะเลือกไฟล์หรือไม่เลือกไฟล์เพื่ออัปโหลดก็ได้)
// (แต่ถ้าไม่เลือกไฟล์ที่อัปโหลดจะบันทึกเป็นค่าว่าง)
const addRunner = async (req, res) => {
    try{
        //สร้างตัวแปรเก็บข้อมูลที่จะบันทึกลงตาราง โดยจะมีการเปลี่ยนชื่อไฟล์ตามที่เขียนไว้ตอนอัปโหลดข้างต้น
        let data = {
            ...req.body,
            runnerImage: req.file ? req.file.path.replace("images\\runner\\","") : ""
        }

        const result = await runner.create(data);
        res.status(201).json({
            message: 'Insert data successfully',
            data: result
        });
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}

//ฟังก์ชัน Login เพื่อเข้าใช้งานบันทึกข้อมูลการวิ่ง
const checkLoginRunner = async (req, res) => {
    try{
        const result = await runner.findOne({
            where: {
                runnerUsername: req.params.runnerUsername,
                runnerPassword: req.params.runnerPassword
            }
        })
        if(result){
            res.status(200).json({
                message: 'Login successfully',
                data: result
            })
        }else{
            res.status(404).json({
                message: 'Login username or password incorrect',
                data: result
            })
        }
    }catch(err){
        res.status(500).json({ message: `ERROR: ${err}` });
    }
}

//ฟังก์ชันแก้ไขข้อมูลส่วนตัวของนักวิ่ง
// กรณีไม่มีการอัปโหลดไฟล์ใช้แบบนี้
// const editRunner = async (req, res) => {
//     try{
//         const result = await runner.update(req.body,{
//             where: {
//                 runnerId: req.params.runnerId
//             }
//         })
//         res.status(200).json({
//             message: 'Update data successfully',
//             data: result
//         });
//     }catch(err){
//         res.status(500).json({ message: `ERROR: ${err}` });
//     }
// }
// กรณีมีการอัปโหลดไฟล์ (โดยที่ผู้ใช้จะเลือกไฟล์หรือไม่เลือกไฟล์เพื่ออัปโหลดก็ได้)
// (แต่ถ้าไม่เลือกไฟล์ที่อัปโหลดก็ไม่ต้องแก้ runnerImage)
const editRunner = async (req, res) => {
    try{
        let data = {
            ...req.body,
        }

        if(req.file){
            //หากมีการแก้ไขรูป ให้ลบรูปเดิมทิ้ง
            //- ค้นหารูปเดิมที่มีอยู่
            const runnerData = await runner.findOne({
                where: {
                    runnerId: req.params.runnerId
                }
            })

            //- ลบไฟล์เดิมที่มีอยู่ โดยตรวจสอบก่อนว่ามีรูปเดิมอยู่ก่อนไหม
            if(runnerData.runnerImage){
                const oldImage = path.join(__dirname, `./../images/runner/${runnerData.runnerImage}`); // ตัวแปรเก็บ path ของรูปเดิม
                fs.unlinkSync(oldImage); //ลบทิิ้ง
            }

            //แก้ไขรูป
            data.runnerImage = req.file.path.replace("images\\runner\\","")
        }else{
            delete data.runnerImage
        }    

        const result = await runner.update(data,{
            where: {
                runnerId: req.params.runnerId
            }
        })
        res.status(200).json({
            message: 'Update data successfully',
            data: result
        });
    }catch(err){
        res.status(500).json({ message: `ERROR: ${err}` });
    }
}


module.exports = {
    addRunner,
    checkLoginRunner,
    editRunner,
    uploadRunner
}