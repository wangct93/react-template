/**
 * Created by wangct on 2018/12/23.
 */
const express = require('express');
const router = express.Router();
const mysql = require('../mysql');

module.exports = router;

router.post('/test',(req,res) => {
  res.send('test')
});
