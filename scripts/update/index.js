const {request,Queue,resolve} = require('../../server/@wangct/node-util');
const Mysql = require('../../server/@wangct/mysql');
const {toNum} = require("@wangct/util/lib/numberUtil");
const mysqlConfig = require('../../server/config/mysql');
const mysql = new Mysql(mysqlConfig);
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const {getNowString} = require("../../server/utils/utils");
const {mkdir} = require("../../server/@wangct/node-util/file");
const {onceQueue} = require("@wangct/util/lib/util");
const {objClone} = require("@wangct/util/lib/objectUtil");
const aliOssConfig = require('../../server/config/aliOss');
const logErr = require("../../server/@wangct/node-util/log").logErr;
const logInfo = require("../../server/@wangct/node-util/log").logInfo;
const aryToObject = require("@wangct/util/lib/arrayUtil").aryToObject;
const {AliOss} = require('../../server/@wangct/node-util');
const oss = new AliOss(aliOssConfig);
const host = 'https://www.biquwu.cc';

start();

async function start(){
  let id = 1;
  const maxId = await getMaxBookId();
  new Queue({
    data(){
      const returnId = id++;
      if(returnId > maxId){
        return undefined;
      }
      return returnId;
    },
    async func(id){
      logInfo('开始：id：',id);
      await updateBook(id).catch((e) => {
        logErr(e);
      });
      logInfo('结束：id：',id);
    }
  })
}

async function updateBook(book_id){
  const book = await mysql.search({
    table:'book',
    where:{
      book_id,
    },
  }).then((data) => data[0]);
  if(!book){
    return null;
  }
  const bookInfo = await request(host + '/biquge/0_' + book.from_id + '/').then((buf) => iconv.decode(buf,'gbk')).then((html) => getBookInfo(html));
  if(!bookInfo.book_name){
    throw id + '，不存在';
  }
  const existList = await mysql.search({
    table:'chapter',
    fields:[
      'pos_index',
    ],
    where:{
      book_id,
    }
  });
  const existMap = aryToObject(existList,'pos_index',() => true);
  const {chapterList} = bookInfo;
  const newList = chapterList.filter((item) => {
    return !existMap[item.pos_index]
  });
  await insertChapter(newList,book_id);
}

async function insertChapter(list,book_id){
  await onceQueue(list,async (item) => {
    logInfo('章节开始：',item.pos_index);
    try{
      const chapterHtml = await request(item.url).then((buf) => iconv.decode(buf,'gbk'));
      const content = cheerio.load(chapterHtml)('#content').text().trim().replace(/[\r\n\s]+/g,'\n');
      const contentBuf = Buffer.from(content);
      const size = contentBuf.length;
      const wordNumber = content.length;
      await mysql.insert({
        table:'chapter',
        data:{
          ...objClone(item,['chapter_name','pos_index']),
          create_time:getNowString(),
          book_id,
          size,
          word_number:wordNumber,
        }
      });
      const ossName = 'chapter_' + book_id + '_' + item.pos_index + '.txt';
      await oss.put(ossName,contentBuf);
    }catch(e){
      logErr('错误',item.pos_index,e);
    }
    logInfo('章节结束：',item.pos_index);
  },{
    limit:5,
  });
}

function getBookInfo(html){
  const $ = cheerio.load(html);

  function getText($p){
    return $p.text().trim().split('：')[1];
  }

  const list = Array.from($('.listmain a')).map((item,index) => {
    const $item = $(item);
    return {
      pos_index:index,
      chapter_name:getElemText($item),
      url:host + $item.attr('href'),
    }
  });
  return {
    book_name:getElemText($('#info').children('h1')),
    book_type:getText($('#info p').eq(0)),
    status:getText($('#info p').eq(1)),
    author:getText($('#info p').eq(2)),
    cover:host + $('#fmimg img').attr('src'),
    intro:$('#intro p').eq(0).text().trim(),
    chapterList:list,
  };
}

function getElemText($elem){
  return $elem.text().trim();
}

function getMaxBookId(){
  return mysql.search({
    table:'book',
    fields:['max(book_id) maxId'],
  }).then((data) => data[0].maxId);
}
