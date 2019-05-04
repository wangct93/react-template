
const request = require('request');
const cheerio = require('cheerio');
const util = require('wangct-server-util');
const Mysql = require('wangct-mysql');
const config = require('../config/mysql');
const fs = require('fs');
const path = require('path');
const mysql = new Mysql({
  ...config,
  database:'manhua',
  log:false
});

module.exports = {
  queryImages
};

function queryImages(num,cb){
  console.log('当前执行：',num);
  mysql.query(`select url from chapter where id = ${num}`,(err,data = []) => {
    if(!data[0]){
      return cb();
    }
    const url = getChapterUrl(data[0].url);
    request(url,{
      headers:{
        cookie:'UM_distinctid=16a025fe8a4b6-02ea8b0562d92e-b79183d-144000-16a025fe8a62b0; _ILikeComic_Newdm5=AAEAAAD/////AQAAAAAAAAAMAgAAAEJJTGlrZS5Ub29scywgVmVyc2lvbj0xLjAuMC4wLCBDdWx0dXJlPW5ldXRyYWwsIFB1YmxpY0tleVRva2VuPW51bGwFAQAAABlJTGlrZS5Ub29scy5Vc2VyUHJpbmNpcGFsBgAAAAlfaWRlbnRpdHkHX3VzZXJJRAlfdXNlck5hbWUIX3JvbGVJRHMIX2lzQWRtaW4dTWFyc2hhbEJ5UmVmT2JqZWN0K19faWRlbnRpdHkDAAEHAAIjU3lzdGVtLlNlY3VyaXR5LlByaW5jaXBhbC5JSWRlbnRpdHkICAECAAAACkVPPQwGAwAAAAAJBAAAAAAKDwQAAAAAAAAACAs=; ComicHistoryitem_zh=History=46961,636904436138357190,746525,1,0,0,0,1|10684,636904508885997340,745258,1,0,0,0,355|41957,636905367836312971,607041,1,0,0,0,3|44325,636907114334712278,673466,1,0,0,0,0|37998,636907956982014759,517787,1,0,0,0,3|31177,636908627705836137,-1,0,1,0,1,0|22750,636913713435583572,-1,0,1,0,1,0&ViewType=1&OrderBy=1; nautosize=false; CNZZDATA1258751965=382393375-1554816457-http%253A%252F%252Fwww.1kkk.com%252F%7C1556195414; isLight=on; DM5_MACHINEKEY=ba537766-a654-49b0-b54f-68bf1bdd98cd; SERVERID=node1; dm5cookieenabletest=1; CNZZDATA1258752048=1260066394-1556811850-http%253A%252F%252Fwww.1kkk.com%252F%7C1556811850; CNZZDATA1258880908=94425255-1556811106-http%253A%252F%252Fwww.1kkk.com%252F%7C1556811106; dm5imgpage=8541|1:1:55:0,111|1:1:56:0; CNZZDATA30046992=cnzz_eid%3D1526332281-1556807364-http%253A%252F%252Fwww.1kkk.com%252F%26ntime%3D1556812764; CNZZDATA1261430601=1430923107-1556808637-http%253A%252F%252Fwww.1kkk.com%252F%7C1556814037; dm5imgcooke=8541%7C22%2C111%7C2; __utma=1.871238051.1556814847.1556814847.1556814847.1; __utmc=1; __utmz=1.1556814847.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmt=1; readhistory_time=636924406337017787; image_time_cookie=8541|636924399514764747|0,111|636924406337057821|3; __utmb=1.4.10.1556814847',
        Host:'www.1kkk.com',
        'Upgrade-Insecure-Requests':1
      },
      timeout:60000
    },(err,res,body) => {
      if(err){
        console.log(err.message);
        return cb();
      }
      const $ = cheerio.load(body);
      const $box = $('#barChapter');
      if($box.length){
        const list = Array.from($box.children('img')).map(item => {
          return {
            url:$(item).attr('src'),
            parent:num
          }
        });
        cb(list);
      }else{
        // fs.writeFileSync('server/webCrawler/temp/f.html',body,() => {});
        let DM5_VIEWSIGN_DT = getValueInHtml(body,'DM5_VIEWSIGN_DT');
        if(DM5_VIEWSIGN_DT){
          let page = 1;
          const mkey = getKeyInHtml(body);
          const DM5_PAGE = getValueInHtml(body,'DM5_PAGE');
          const DM5_MID = getValueInHtml(body,'DM5_MID');
          const DM5_CID = getValueInHtml(body,'DM5_CID');
          let DM5_VIEWSIGN = getValueInHtml(body,'DM5_VIEWSIGN');
          DM5_VIEWSIGN_DT = DM5_VIEWSIGN_DT.substr(1,DM5_VIEWSIGN_DT.length - 2);
          DM5_VIEWSIGN = DM5_VIEWSIGN.substr(1,DM5_VIEWSIGN.length - 2);
          const temp = DM5_VIEWSIGN_DT.split(' ');
          DM5_VIEWSIGN_DT = temp[0] + '+' + encodeURIComponent(temp[1]);
          const params = {
            cid: DM5_CID,
            page: DM5_PAGE,
            key: mkey,
            language: 1,
            gtk: 6,
            _cid: DM5_CID,
            _mid: DM5_MID,
            _dt: DM5_VIEWSIGN_DT,
            _sign: DM5_VIEWSIGN
          };
          const queue = util.queue({
            getItem(){
              return page;
            },
            func(item,cb){
              let address = `${url}chapterfun.ashx?${util.stringUtil.stringify({
                ...params,
                page:item,
              })}`;
              // address = 'http://www.1kkk.com/vol2-112/chapterfun.ashx?cid=112&page=1&key=11801a1e4d04bf67&language=1&gtk=6&_cid=112&_mid=16&_dt=2019-04-21+17%3A49%3A57&_sign=a0f32765030bde122038d5dd674c0109';
              // console.log(address);
              request(address,{
                headers:{
                  cookie:'UM_distinctid=16a025fe8a4b6-02ea8b0562d92e-b79183d-144000-16a025fe8a62b0; _ILikeComic_Newdm5=AAEAAAD/////AQAAAAAAAAAMAgAAAEJJTGlrZS5Ub29scywgVmVyc2lvbj0xLjAuMC4wLCBDdWx0dXJlPW5ldXRyYWwsIFB1YmxpY0tleVRva2VuPW51bGwFAQAAABlJTGlrZS5Ub29scy5Vc2VyUHJpbmNpcGFsBgAAAAlfaWRlbnRpdHkHX3VzZXJJRAlfdXNlck5hbWUIX3JvbGVJRHMIX2lzQWRtaW4dTWFyc2hhbEJ5UmVmT2JqZWN0K19faWRlbnRpdHkDAAEHAAIjU3lzdGVtLlNlY3VyaXR5LlByaW5jaXBhbC5JSWRlbnRpdHkICAECAAAACkVPPQwGAwAAAAAJBAAAAAAKDwQAAAAAAAAACAs=; ComicHistoryitem_zh=History=46961,636904436138357190,746525,1,0,0,0,1|10684,636904508885997340,745258,1,0,0,0,355|41957,636905367836312971,607041,1,0,0,0,3|44325,636907114334712278,673466,1,0,0,0,0|37998,636907956982014759,517787,1,0,0,0,3|31177,636908627705836137,-1,0,1,0,1,0|22750,636913713435583572,-1,0,1,0,1,0&ViewType=1&OrderBy=1; nautosize=false; CNZZDATA1258751965=382393375-1554816457-http%253A%252F%252Fwww.1kkk.com%252F%7C1556195414; isLight=on; DM5_MACHINEKEY=ba537766-a654-49b0-b54f-68bf1bdd98cd; SERVERID=node1; dm5cookieenabletest=1; CNZZDATA1258752048=1260066394-1556811850-http%253A%252F%252Fwww.1kkk.com%252F%7C1556811850; CNZZDATA1258880908=94425255-1556811106-http%253A%252F%252Fwww.1kkk.com%252F%7C1556811106; dm5imgpage=8541|1:1:55:0,111|1:1:56:0; CNZZDATA30046992=cnzz_eid%3D1526332281-1556807364-http%253A%252F%252Fwww.1kkk.com%252F%26ntime%3D1556812764; CNZZDATA1261430601=1430923107-1556808637-http%253A%252F%252Fwww.1kkk.com%252F%7C1556814037; dm5imgcooke=8541%7C22%2C111%7C2; __utma=1.871238051.1556814847.1556814847.1556814847.1; __utmc=1; __utmz=1.1556814847.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmt=1; readhistory_time=636924406337017787; image_time_cookie=8541|636924399514764747|0,111|636924406337057821|3; __utmb=1.4.10.1556814847',
                  Referer:url,
                  Host:'www.1kkk.com'
                },
                timeout:60000
              },(err,res,body) => {
                if(err){
                  page = undefined;
                  return cb();
                }
                const list = eval(body) || [];
                if(!list.length){
                  page = undefined;
                  return cb();
                }
                if(queue.props.result.find((item = []) => item.some(item => item === list[0]))){
                  page = undefined;
                  cb();
                }else{
                  page += list.length;
                  cb(list);
                }
              })
            },
            success(result){
              cb(result.filter(item => !!item).reduce((pv,item) => pv.concat(item),[]));
            }
          })
        }else{
          cb();
        }
      }
    })
  });
}

function getChapterUrl(url){
  return `http://www.1kkk.com${url}`;
}


function getValueInHtml(html,field){
  const match = new RegExp(`${field}\\s?=\\s?([^;]*);`).exec(html) || [];
  return match[1];
}

function getKeyInHtml(html){
  const $ = cheerio.load(html);
  const $input = $('#dm5_key');
  const str = $input.next().html() || '';
  const scriptHtml = str.replace(/^\s+|\s+$/g,'');
  if(scriptHtml.startsWith('eval')){
    return eval(eval(scriptHtml.replace(/eval/g,'')).split(';')[1].split('=')[1])
  }
  return '';
}
