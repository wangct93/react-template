const moment = require('moment');
const killSelf = require("@wangct/node-util/lib/system").killSelf;
const logInfo = require("@wangct/node-util/lib/log").logInfo;
const processExist = require("@wangct/node-util/lib/system").processExist;
const callFunc = require("@wangct/util/lib/util").callFunc;
const toAry = require("@wangct/util/lib/arrayUtil").toAry;
const getClientIp = require("@wangct/node-util").getClientIp;
const isAry = require("@wangct/util/lib/typeUtil").isAry;
const aryToObject = require("@wangct/util/lib/arrayUtil").aryToObject;
const {decode,encode} = require('@wangct/node-util');

module.exports = {
  getPageLimit,
  getNowString,
  getNowTimeString:getNowString,
  pageSearch,
  decodeBook,
  encodeBook,
  getPageLimitAll,
  getUserIdByReq,
  catchProErr,
  fork,
};

/**
 * 获取分页属性
 * @param pageNum
 * @param pageSize
 * @returns {number[]}
 */
function getPageLimit(pageNum = 1,pageSize){
  const limit = getPageLimitAll(pageNum,pageSize);
  if(!limit){
    return [0,100];
  }
  return limit;
}

function getPageLimitAll(pageNum = 1,pageSize){
  if(!pageSize){
    return null;
  }
  return [(pageNum - 1) * pageSize,pageSize];
}

/**
 * 获取当前时间
 * @param format
 * @returns {string}
 */
function getNowString(format = 'YYYY-MM-DD HH:mm:ss'){
  return moment().format(format);
}

/**
 * 分页查询
 * @param func
 * @param params
 * @returns {Promise<{total: any, list: any}>}
 */
async function pageSearch(func,params = {}) {
  const totalPro = await func({
    ...params,
    page_size:0,
  }).then((data) => data.length);
  const listPro = await func(params);
  const [total,list] = await Promise.all([totalPro,listPro]);
  return {
    total,
    list:encodeBook(list),
  };
}

function decodeBook(book = {}){
  if(isAry(book)){
    return book.map((item) => decodeBook(item));
  }
  const fields = ['book_id','chapter_id','prev','next'];
  const extData = aryToObject(fields,(item) => item,(key) => decode(book[key]));
  return {
    ...book,
    ...extData,
  };
}

function encodeBook(book = {}){
  if(isAry(book)){
    return book.map((item) => encodeBook(item));
  }
  const fields = ['book_id','chapter_id','prev','next'];
  const extData = aryToObject(fields,(item) => item,(key) => encode(book[key]));
  return {
    ...book,
    ...extData,
  };
}

let validData = {};
const validatorTimes = 3000;

initValidInterval(validatorTimes);




function initValidInterval(times = 1000){
  setInterval(() => {
    validData = {};
  },times);
}

function getUserIdByReq(req){
  const userInfo = getUserInfoByReq(req);
  return userInfo && userInfo.user_id;
}

function getUserInfoByReq(req){
  const {session = {}} = req;
  return session.userInfo;
}

function catchProErr(promise){
  return promise.catch(() => {});
}

function fork(url,options = {}){
  const childModule = require('child_process').fork(url,options);
  let isClose = false;
  let timeoutTimer;
  childModule.on('close',(e) => {
    isClose = true;
    clearTimeout(timeoutTimer);
    setTimeout(() => {
      callFunc(options.onClose,e);
    },0);
  });

  function interval(func){
    const timer = setInterval(async () => {
      const isExist = await processExist(childModule.pid);
      if(isClose || isExist){
        clearInterval(timer);
        callFunc(options.onStart);
        callFunc(func,childModule);
      }
    },500);
  }

  if(options.timeout){
    timeoutTimer = setTimeout(() => {
      logInfo('超时关闭',childModule.pid);
      killSelf(504,childModule);
    },options.timeout * 1000);
  }

  if(options.promise){
    return new Promise(interval);
  }else{
    interval();
  }
  return childModule;
}
