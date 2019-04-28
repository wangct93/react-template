/**
 * Created by wangct on 2019/3/17.
 */
const express = require('express');
const router = express.Router();
const request = require('request');
const mysql = require('../mysql/user');
const util = require('wangct-server-util');


module.exports = router;


router.post('/login',(req,res) => {
  mysql.login(req.body,(err,data) => {
    const {session} = req;
    session.userInfo = data;
    session.save();
    util.send(res,!!data,err);
  })
});

router.get('/logout',(req,res) => {
  const {session} = req;
  session.userInfo = null;
  session.save();
  util.send(res);
});

router.post('/register',(req,res) => {
  mysql.register(req.body,(err,data = {}) => {
    const userId = data.insertId;
    mysql.getInfo({id:userId},(err,data) => {
      const {session} = req;
      session.userInfo = data;
      session.save();
      util.send(res,userId,err);
    });
  });
});

router.get('/getInfo',(req,res) => {
  util.send(res,req.session.userInfo);
});
