/**
 * Created by wangct on 2018/12/23.
 */
const express = require('express');
const router = express.Router();
const mysql = require('../mysql/comment');
const util = require('wangct-server-util');


module.exports = router;


router.post('/queryList',(req,res) => {
  mysql.queryList(req.body,(err,data) => {
    util.send(res,data,err);
  });
});

router.post('/submit',(req,res) => {
  const {session:{userInfo}} = req;
  if(userInfo){
    mysql.insert({
      ...req.body,
      userId:userInfo.id
    },(err,data) => {
      util.send(res,data,err);
    });
  }else{
    mysql.insert({
      ...req.body,
      userId:1
    },(err,data) => {
      util.send(res,data,err);
    });
    // util.send(res,null,'noLogin')
  }
});
