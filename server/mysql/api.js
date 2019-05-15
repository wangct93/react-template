/**
 * Created by wangct on 2019/3/17.
 */
const Mysql = require('wangct-mysql');
const config = require('../config/mysql');
const mysql = new Mysql(config);
const util = require('wangct-server-util');
const {arrayUtil,dateUtil} = util;

module.exports = {
  getInfo
};


function getInfo(params,cb){
  mysql.query(`select * from user where id = ${params.id}`,(err,data) => {
    cb(err,data && data[0]);
  })
}
