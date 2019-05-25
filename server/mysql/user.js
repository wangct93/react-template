/**
 * Created by wangct on 2018/12/30.
 */
const Mysql = require('wangct-mysql');
const config = require('../config').mysql;
const mysql = new Mysql(config);

module.exports = {
  getUserList
};



function getUserList(params,cb){
  mysql.query('select * from user' + getWhereSql(params),cb);
}

function filterQuotes(value,sign = '"'){
  return value && value.replace ? value.replace(new RegExp(sign,'g'),'\\' + sign) : value;
}

function getWhereSql(params = {}){
  const result = Object.keys(params).filter(key => {
    const type = typeof params[key];
    return type === 'string' || type === 'number';
  }).map(key => {
    let value = params[key];
    if(typeof value === 'string'){
      value = '"' + filterQuotes(value) + '"';
    }
    return key + '=' + value;
  });
  return result.length ? ` where ${result.join(' and ')}` : ''
}
