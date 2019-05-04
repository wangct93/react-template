const request = require('request');
const Mysql = require('wangct-mysql');
const config = require('../config/mysql');
const util = require('wangct-server-util');
const fs = require('fs');
const path = require('path');
const mysql = new Mysql({
  ...config,
  database:'manhua',
  log:false
});


const utils = require('../webCrawler/1kkk_utils');

test(4802);

function test(num){
  utils.queryImages(num,(list = []) => {
    mysql.query('select * from chapter where id = ' + num,(err,data) => {

      data = data[0];
      const Referer = `http://www.1kkk.com${data.url}`;
      let url = list[2];
      // url = 'http://manhua1001-61-174-50-98.cdndm5.com/specials/a/aerbeisimeigui/0130023508_53457.jpg?cid=112&key=3f812d0535e9813f58706c04fcd83fb8&uk=';
      console.log(url,Referer);
      const ws = require('fs').createWriteStream(`server/test/a.png`);
      const rs = request(url,{
        headers:{
          Referer
        }
      });
      rs.pipe(ws);
      ws.on('finish',() => {
      });

    })
  });
}







