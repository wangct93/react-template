

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

start();

// queryImages(4803,(list) => {
//   console.log(list.length);
// })


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


function start(){
  getStartNum(num => {
    util.queue({
      getItem(){
        return num++;
      },
      func(num,cb){
        queryImages(num,(list = []) => {
          console.log(`编号：${num}   长度：${list.length}`)
          if(!list || !list.length){
            return cb();
          }
          insertImage(list.map(item => ({
            parent:num,
            url:item
          })),() => {
            console.log('插入成功：',num);
            cb();
          });
        })
      },
      limit:5,
      // interval:30
    })
  });
}

function getStartNum(cb){
  mysql.query(`select parent from image order by id DESC limit 1`,(err,data) => {
    const num = data && data[0] && data[0].parent || 4801;
    cb(num + 1);
  });
}

function insertImage(list,cb){
  const fields = ['url','parent'];
  const sqlValues = list.map(item => getSqlValue(fields,item)).join(',');
  mysql.query(`insert into image(${getFields(fields).join(',')}) values${sqlValues}`,cb);
}




function queryImages(num,cb){
  console.log('当前执行：',num);
  mysql.query(`select url from chapter where id = ${num}`,(err,data = []) => {
    if(!data[0]){
      return cb();
    }
    const url = getChapterUrl(data[0].url);
    request(url,{
      headers:{
        cookie:'UM_distinctid=16a025fe8a4b6-02ea8b0562d92e-b79183d-144000-16a025fe8a62b0; __utmz=1.1554818001.1.1.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _ILikeComic_Newdm5=AAEAAAD/////AQAAAAAAAAAMAgAAAEJJTGlrZS5Ub29scywgVmVyc2lvbj0xLjAuMC4wLCBDdWx0dXJlPW5ldXRyYWwsIFB1YmxpY0tleVRva2VuPW51bGwFAQAAABlJTGlrZS5Ub29scy5Vc2VyUHJpbmNpcGFsBgAAAAlfaWRlbnRpdHkHX3VzZXJJRAlfdXNlck5hbWUIX3JvbGVJRHMIX2lzQWRtaW4dTWFyc2hhbEJ5UmVmT2JqZWN0K19faWRlbnRpdHkDAAEHAAIjU3lzdGVtLlNlY3VyaXR5LlByaW5jaXBhbC5JSWRlbnRpdHkICAECAAAACkVPPQwGAwAAAAAJBAAAAAAKDwQAAAAAAAAACAs=; ComicHistoryitem_zh=History=46961,636904436138357190,746525,1,0,0,0,1|10684,636904508885997340,745258,1,0,0,0,355|41957,636905367836312971,607041,1,0,0,0,3|44325,636907114334712278,673466,1,0,0,0,0|37998,636907956982014759,517787,1,0,0,0,3|31177,636908627705836137,-1,0,1,0,1,0|22750,636913713435583572,-1,0,1,0,1,0&ViewType=1&OrderBy=1; CNZZDATA1258751965=382393375-1554816457-http%253A%252F%252Fwww.1kkk.com%252F%7C1555752156; DM5_MACHINEKEY=2f8da65c-2ed5-41b7-81ef-6b31bbb95628; SERVERID=node3; __utmc=1; CNZZDATA1258751996=1401025143-1554815135-http%253A%252F%252Fwww.1kkk.com%252F%7C1555819776; CNZZDATA1258880908=1971123632-1554812980-null%7C1555828253; dm5cookieenabletest=1; __utma=1.678474659.1554818001.1555823473.1555830130.36; CNZZDATA30046992=cnzz_eid%3D466976352-1554814759-null%26ntime%3D1555829671; __utmt=1; CNZZDATA1258752048=1272566236-1554813837-http%253A%252F%252Fwww.1kkk.com%252F%7C1555829138; CNZZDATA1261430601=1891435950-1554815536-http%253A%252F%252Fwww.1kkk.com%252F%7C1555828074; __utmb=1.5.10.1555830130; dm5imgcooke=732646%7C24%2C746525%7C14%2C774803%7C25%2C807321%7C2%2C794255%7C2%2C810458%7C2%2C807672%7C2%2C804162%7C2%2C112%7C2%2C111%7C86; readhistory_time=636914573260188828; image_time_cookie=810458|636914557253353877|1,807672|636914494698195865|1,111|636914573260188828|0,804162|636914499187292142|0,112|636914499377301844|0; dm5imgpage=732646|4:1:55:0,746525|14:1:55:0,774803|6:1:55:0,807321|1:1:17:0,794255|1:1:56:0,111|1:1:56:0,810458|1:1:56:0,807672|8:1:56:0,804162|1:1:55:0,112|1:1:55:0',
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
                  cookie:'UM_distinctid=16a025fe8a4b6-02ea8b0562d92e-b79183d-144000-16a025fe8a62b0; __utmz=1.1554818001.1.1.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _ILikeComic_Newdm5=AAEAAAD/////AQAAAAAAAAAMAgAAAEJJTGlrZS5Ub29scywgVmVyc2lvbj0xLjAuMC4wLCBDdWx0dXJlPW5ldXRyYWwsIFB1YmxpY0tleVRva2VuPW51bGwFAQAAABlJTGlrZS5Ub29scy5Vc2VyUHJpbmNpcGFsBgAAAAlfaWRlbnRpdHkHX3VzZXJJRAlfdXNlck5hbWUIX3JvbGVJRHMIX2lzQWRtaW4dTWFyc2hhbEJ5UmVmT2JqZWN0K19faWRlbnRpdHkDAAEHAAIjU3lzdGVtLlNlY3VyaXR5LlByaW5jaXBhbC5JSWRlbnRpdHkICAECAAAACkVPPQwGAwAAAAAJBAAAAAAKDwQAAAAAAAAACAs=; ComicHistoryitem_zh=History=46961,636904436138357190,746525,1,0,0,0,1|10684,636904508885997340,745258,1,0,0,0,355|41957,636905367836312971,607041,1,0,0,0,3|44325,636907114334712278,673466,1,0,0,0,0|37998,636907956982014759,517787,1,0,0,0,3|31177,636908627705836137,-1,0,1,0,1,0|22750,636913713435583572,-1,0,1,0,1,0&ViewType=1&OrderBy=1; CNZZDATA1258751965=382393375-1554816457-http%253A%252F%252Fwww.1kkk.com%252F%7C1555752156; DM5_MACHINEKEY=2f8da65c-2ed5-41b7-81ef-6b31bbb95628; SERVERID=node3; __utmc=1; CNZZDATA1258751996=1401025143-1554815135-http%253A%252F%252Fwww.1kkk.com%252F%7C1555819776; CNZZDATA1258880908=1971123632-1554812980-null%7C1555828253; dm5cookieenabletest=1; __utma=1.678474659.1554818001.1555823473.1555830130.36; CNZZDATA30046992=cnzz_eid%3D466976352-1554814759-null%26ntime%3D1555829671; __utmt=1; CNZZDATA1258752048=1272566236-1554813837-http%253A%252F%252Fwww.1kkk.com%252F%7C1555829138; CNZZDATA1261430601=1891435950-1554815536-http%253A%252F%252Fwww.1kkk.com%252F%7C1555828074; __utmb=1.5.10.1555830130; dm5imgcooke=732646%7C24%2C746525%7C14%2C774803%7C25%2C807321%7C2%2C794255%7C2%2C810458%7C2%2C807672%7C2%2C804162%7C2%2C112%7C2%2C111%7C86; readhistory_time=636914573260188828; image_time_cookie=810458|636914557253353877|1,807672|636914494698195865|1,111|636914573260188828|0,804162|636914499187292142|0,112|636914499377301844|0; dm5imgpage=732646|4:1:55:0,746525|14:1:55:0,774803|6:1:55:0,807321|1:1:17:0,794255|1:1:56:0,111|1:1:56:0,810458|1:1:56:0,807672|8:1:56:0,804162|1:1:55:0,112|1:1:55:0',
                  Referer:'http://www.1kkk.com/vol2-112/',
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


function getSqlValue(fields,data){
  return '(' + fields.map(field => {
    const item = typeof field === 'string' ? {field,func(item,data){return item}} : field;
    return `'${mysql.escape(item.func(data[item.field],data))}'`
  }).join(',') + ')';
}

function getFields(fields){
  return fields.map(item => typeof item === 'string' ? item : item.field);
}
