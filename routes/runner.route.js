const express = require('express');
const runnerCtrl = require('./../controllers/runner.controller.js');
const run = require('../models/run.model.js');

const router = express.Router();

router.post('/',runnerCtrl.uploadRunner, runnerCtrl.addRunner); //เพิ่มข้อมูลนักวิ่ง
router.put('/:runnerId',runnerCtrl.uploadRunner, runnerCtrl.editRunner); //แก้ไขข้อมูลนักวิ่ง
router.get('/:runnerUsername/:runnerPassword', runnerCtrl.checkLoginRunner); //Login เพื่อเข้าใช้งานบันทึกข้อมูลการวิ่ง

module.exports = router;