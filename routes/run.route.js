const express = require('express');
const runCtrl = require('./../controllers/run.controller.js');

const router = express.Router();

router.post('/',runCtrl.uploadRun ,runCtrl.addRun); //เพิ่มข้อมูลการวิ่ง
router.put('/:runId', runCtrl.uploadRun, runCtrl.editRun); //แก้ไขข้อมูลการวิ่ง
router.delete('/:runId', runCtrl.delRun); //ลบข้อมูลการวิ่ง
router.get('/:runnerId', runCtrl.getAllRun); //ดึงข้อมูลการวิ่งทั้งหมดของนักวิ่งคนนั้นๆ
router.get('/only/:runId', runCtrl.getOnlyRun); //ดึงข้อมูลการวิ่งหนึ่งๆ

module.exports = router; 