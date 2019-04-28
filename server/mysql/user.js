/**
 * Created by wangct on 2019/3/17.
 */
const Mysql = require('wangct-mysql');
const config = require('../config/mysql');
const mysql = new Mysql(config);
const util = require('wangct-server-util');
const {arrayUtil,dateUtil} = util;

module.exports = {
  login,
  register,
  getInfo
};


function login(params,cb){
  mysql.query(`select * from user where name = '${params.name}' and password = '${params.password}'`,(err,data) => {
    cb(err,data && data[0]);
  })
}

function register(params,cb){
  mysql.query(`insert into user(name,password,time) values('${params.name}','${params.password}','${dateUtil.format()}')`,cb);
}

function getInfo(params,cb){
  mysql.query(`select * from user where id = ${params.id}`,(err,data) => {
    cb(err,data && data[0]);
  })
}

function getLimit(start,limit){
  return start === undefined ? '' : ` limit ${start},${limit}`;
}

function getDesc(field,desc){
  return field ? ` order by ${field} ${desc ? 'desc' : ''}` : '';
}
