/**
 * Created by wangct on 2019/3/10.
 */
const express = require('express');
const router = express.Router();
const util = require('wangct-server-util');
const fs = require('fs');
const path = require('path');
const resolve = (...paths) => path.resolve(process.cwd(),...paths);
const config = require('../config/server');
const request = require('request');
const url = require('url');

module.exports = router;


router.post('/upload',(req,res) => {
  util.formData(req,(err,fields,files) => {
    if(err){
      res.send({status:0,error:err.message});
    }else{
      const keys = Object.keys(files);
      const success = (list = []) => {
        res.send({errno:0,data:list});
      };
      if(keys.length){
        util.queue({
          list:keys,
          func:(key,cb) => {
            const file = files[key];
            const {type = ''} = file;
            const extname = type.split('/').pop();
            const filename = util.random() + '.' + extname;
            fs.rename(file.path,resolve('assets/image',filename),() => {
              cb(`http://${util.getLocalIp()}:${config.port}/file/getImage?filename=${filename}`);
            });
          },
          success
        });
      }else{
        success();
      }
    }
  })
});

router.get('/getImage',(req,res) => {
  const {query:{filename}} = req;
  const rs = fs.createReadStream(resolve('assets/image',filename));
  rs.pipe(res);
});

router.get('/getNormalUserCover',(req,res) => {
  const rs = fs.createReadStream(resolve('assets/normal/user.jpg'));
  rs.pipe(res);
});

router.use('/getComicImage',(req,res) => {
  const {query:{url:realUrl,Referer}} = req;
  const urlOpt = url.parse(realUrl);
  const address = `${urlOpt.protocol}//${urlOpt.host}${urlOpt.pathname.split(/[\\\/]/).map(item => encodeURIComponent(item)).join('/')}${urlOpt.search}`;
  const rs = request(address,{
    headers:{
      Referer:Referer
    }
  });
  rs.pipe(res);
  rs.on('error',() => {
    res.send('error');
  })
});
