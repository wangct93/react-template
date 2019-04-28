/**
 * Created by wangct on 2018/12/23.
 */
const express = require('express');
const router = express.Router();
const mysql = require('../mysql/comic');
const util = require('wangct-server-util');


module.exports = router;


router.post('/queryComicInfo',(req,res) => {
  const {id} = req.body;
  mysql.queryComic(id,(err,data) => {
    util.send(res,data,err);
  });
});

router.post('/queryComicList',(req,res) => {
  mysql.queryList(req.body,(err,data) => {
    util.send(res,data,err);
  });
});


router.post('/queryCommentList',(req,res) => {
  mysql.queryCommentList(req.body,(data) => {
    util.send(res,data);
  });
});

router.post('/addComment',(req,res) => {
  const {session:{userInfo},body} = req;
  if(userInfo){
    mysql.insertComment({
      ...body,
      userId:userInfo.id,
      toUserId:body.toUserId || userInfo.id
    },(err,data) => {
      util.send(res,data,err);
    })
  }else{
    util.send(res,null,'can`t find userinfo')
  }
});

router.post('/queryCorrelativeList',(req,res) => {
  const {id} = req.body;
  mysql.queryCorrelativeList(id,(err,data) => {
    util.send(res,data,err);
  });
});

router.post('/queryLabelList',(req,res) => {
  mysql.queryLabelList((err,data) => {
    util.send(res,data,err);
  });
});

router.post('/queryBannerList',(req,res) => {
  mysql.queryBannerList((err,data) => {
    util.send(res,data,err);
  });
});

router.post('/queryRecommendList',(req,res) => {
  mysql.queryRecommendList((err,data) => {
    util.send(res,data,err);
  });
});
