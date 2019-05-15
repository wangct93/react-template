/**
 * Created by wangct on 2018/12/23.
 */
const express = require('express');
const router = express.Router();
const mysql = require('../mysql/api');
const util = require('wangct-server-util');


module.exports = router;


router.post('/queryComicInfo',(req,res) => {
  const {id} = req.body;
  mysql.getInfo(id,(err,data) => {
    util.send(res,data,err);
  });
});

