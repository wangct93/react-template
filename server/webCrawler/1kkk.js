

const request = require('request');
const cheerio = require('cheerio');
const util = require('wangct-server-util');
const Mysql = require('wangct-mysql');
const config = require('../config/mysql');
const fs = require('fs');
const numPath = 'server/webCrawler/temp/num.txt';
const mysql = new Mysql({
  ...config,
  database:'manhua'
});

start();

function start(){
  getStartNum(num => {
    clearMysql(num,() => {
      util.queue({
        getItem(){
          return num++;
        },
        func(num,cb){
          addNum(num);
          queryComic(num,data => {
            if(!data){
              removeNum(num);
              return cb();
            }
            insertComic(data,() => {
              removeNum(num);
              cb();
            });
          })
        },
        limit:10
      })
    })
  });
}

function getStartNum(cb){
  const list = getNumTxtList();
  cb(+list.sort((a,b) => +a - +b)[0] || 0)
}

function clearMysql(num,cb){

  const p1 = new Promise(cb => {
    mysql.query(`delete from label where comicId in (select id from comic where num >= ${num})`,cb);
  });
  const p2 = new Promise(cb => {
    mysql.query(`delete from chapter where comicId in (select id from comic where num >= ${num})`,cb);
  });
  const p3 = new Promise(cb => {
    mysql.query(`delete from score where comicId in (select id from comic where num >= ${num})`,cb);
  });
  Promise.all([p1,p2,p3]).then(() => {
    mysql.query(`delete from comic where num >= ${num}`,cb);
  });
}

function addNum(num){
  const list = getNumTxtList();
  list.push(num);
  writeNumText(list);
}

function removeNum(num){
  const list = getNumTxtList();
  writeNumText(list.filter(item => +item !== num));
}

function getNumTxtList(){
  let list;
  try{
    const buf = fs.readFileSync(numPath);
    list = JSON.parse(buf.toString());
  }catch(e){
    list = [];
  }
  return list;
}

function writeNumText(list){
  fs.writeFileSync(numPath,JSON.stringify(util.arrayUtil.noRepeat(list)));
}



function insertComic(data,cb){
  const fields = ['name','author',
    {
      field: 'status',
      func(v, data) {
        return v === '连载中' ? 0 : 1
      }
    },
    'intro','cover',
    {
      field: 'hits',
      func(v, data) {
        return 0;
      }
    },'num'];

  mysql.query(`insert into comic(${getFields(fields).join(',')}) values${getSqlValue(fields,data)}`,(err,result) => {
    if(err){
      console.log(err);
      return util.callFunc(cb);
    }else{
      const id = result.insertId;
      const p1 = new Promise(cb => {
        if(data.chapters.length){
          insertChapter(id,data.chapters,cb);
        }else{
          cb();
        }
      });
      const p2 = new Promise(cb => {
        if(data.label.length){
          insertLabel(id,data.label,cb);
        }else{
          cb();
        }
      });
      const p3 = new Promise(cb => {
        insertScore(id,data.score,cb);
      });
      Promise.all([p1,p2,p3]).then(() => {
        util.callFunc(cb);
      })
    }
  })
}

function insertChapter(id,list,cb){
  const fields = ['name','url','comicId','intro','type'];
  const sqlValues = list.map(item => getSqlValue(fields,{
    ...item,
    comicId:id
  })).join(',');

  mysql.query(`insert into chapter(${getFields(fields).join(',')}) values${sqlValues}`,cb);
}

function insertLabel(id,list,cb){
  const fields = ['name','comicId'];
  const sqlValues = list.map(item => getSqlValue(fields,{
    name:item,
    comicId:id
  })).join(',');
  mysql.query(`insert into label(${getFields(fields).join(',')}) values${sqlValues}`,cb);
}

function insertScore(id,value,cb){
  const fields = ['score','userId','comicId'];
  mysql.query(`insert into score(${getFields(fields).join(',')}) values${getSqlValue(fields,{
    score:value,
    comicId:id,
    userId:'1'
  })}`,cb);
}


function queryComic(num,cb){
  console.log('当前执行：',num);
  const url = getComicUrl(num);
  request(url,(err,res,body) => {
    if(err){
      console.log(err.message);
      return cb();
    }
    const $ = cheerio.load(body);
    const $info = $('.banner_detail_form');
    if(!$info.length){
      console.log('页面不存在：',num);
      return cb();
    }
    const $title = $info.find('.title');
    const $tip = $info.find('.tip');
    const types = [
      {
        id: 'detail-list-select-1',
        type: 'lian'
      },
      {
        id: 'detail-list-select-2',
        type: 'dan'
      },
      {
        id: 'detail-list-select-3',
        type: 'fan'
      }
      ];
    const target = {
      name:$title.contents().first().text().trim(),
      author:$info.find('.subtitle').children().text(),
      status:$tip.children().first().children().text(),
      cover:$info.find('.cover').children().attr('src'),
      label:Array.from($tip.children().eq(1).children()).map(item => $(item).text()),
      intro:($info.find('.content').contents().first().text() + $info.find('.content').children('span').contents().first().text()).trim(),
      score:parseFloat($title.children().text()),
      chapters:types.reduce((pv,typeTarget) => {
        const $target = $('#' + typeTarget.id);
        const list = $target.length ? Array.from($target.find('li')).map(item => {
          const $item = $(item).find('a');
          return {
            name:$item.contents().first().text().trim(),
            intro:$item.children().text().trim(),
            url:$item.attr('href'),
            type:typeTarget.type
          }
        }) : [];
        return pv.concat(list);
      },[]).reverse(),
      num
    };
    cb(target);
  })
}

function getComicUrl(num){
  return `http://www.1kkk.com/manhua${num}/`
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
