// ไฟล์ประเภท controller เป็นไฟล์ที่จะทำงากับตารางในฐานข้อมูล (CRUD)
// C(create/insert) เพิ่ม 
// R(read/select) ค้นหา,ตรวจสอบ,ดึง,ดู
// U(update) แก้ไข
// D(delete) ลบ
const run = require('./../models/run.model.js');
const multer = require('multer');
const path = require('path');

//สร้างส่วนของการอัปโหลดไฟล์ด้วย multer ทำ 2 ขั้นตอน
//1. กําหนดตําแหน่งที่จะอัปโหลดไฟล์ และชื่อไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/run');
    },
    filename: (req, file, cb) => {
        cb(null, 'run_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
    }
});
//2. ฟังก์ชันอัปโหลดไฟล์
const uploadRun = multer({
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
}).single('runImage');


//ฟัง์ชันเพิ่มข้อมูลการวิ่ง
// กรณีไม่มีการอัปโหลดไฟล์ใช้แบบนี้
// const addRun = async (req, res) => {
//     try{
//         const result = await run.create(req.body);
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
const addRun = async (req, res) => {
    try{
        //สร้างตัวแปรเก็บข้อมูลที่จะบันทึกลงตาราง โดยจะมีการเปลี่ยนชื่อไฟล์ตามที่เขียนไว้ตอนอัปโหลดข้างต้น
        let data = {
            ...req.body,
            runImage: req.file ? req.file.path.replace("images\\run\\","") : ""
        }

        const result = await run.create(data);
        res.status(201).json({
            message: 'Insert data successfully',
            data: result
        });
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}

//ฟังก์แก้ไขข้อมูลการวิ่ง
// กรณีไม่มีการอัปโหลดไฟล์ใช้แบบนี้
// const editRun = async (req, res) => {
//     try{
//         const result = await run.update(req.body,{
//             where: {
//                 runId: req.params.runId
//             }
//         })
//         res.status(200).json({
//             message: 'Update data successfully',
//             data: result
//         });
//     }catch(err){
//         res.status(500).json({ message: `ERROR:  ${err}` });
//     }
// }
// กรณีมีการอัปโหลดไฟล์ (โดยที่ผู้ใช้จะเลือกไฟล์หรือไม่เลือกไฟล์เพื่ออัปโหลดก็ได้)
// (แต่ถ้าไม่เลือกไฟล์ที่อัปโหลดก็ไม่ต้องแก้ runImage)
const editRun = async (req, res) => {
    try{
        let data = {
            ...req.body,
        }

        if(req.file){          
            data.runImage = req.file.path.replace("images\\run\\","")
        }else{
            delete data.runImage
        }

        const result = await run.update(data,{
            where: {
                runId: req.params.runId
            }
        })
        res.status(200).json({
            message: 'Update data successfully',
            data: result
        });
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}

//ฟังก์ชันลบข้อมูลการวิ่ง
const delRun = async (req, res) => {
    try{
        const result = await run.destroy({
            where: {
                runId: req.params.runId
            }
        })
        res.status(200).json({
            message: 'Delele data successfully',
            data: result
        });
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}

//ฟังก์ชันดึงข้อมูลการวิ่งทั้งหมดของนักวิ่งคนนั้นๆ
const getAllRun = async (req, res) => {
    try{
        const result = await run.findAll({
            where: {
                runnerId: req.params.runnerId
            }
        })
        if(result){
            res.status(200).json({
                message: 'Get have data successfully',
                data: result
            });            
        }else{
            res.status(404).json({ 
                message: 'Not have data' 
            });
        }
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}

//ฟังก์ชันดึงข้อมูลการวิ่งหนึ่งๆ
const getOnlyRun = async (req, res) => {
    try{
        const result = await run.findOne({
            where: {
                runId: req.params.runId
            }
        })
        if(result){
            res.status(200).json({
                message: 'Get have data successfully',
                data: result
            });            
        }else{
            res.status(404).json({ 
                message: 'Not have data' 
            });
        }
    }catch(err){
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}

module.exports = { 
    addRun, 
    editRun, 
    delRun, 
    getAllRun, 
    uploadRun,
    getOnlyRun,
}