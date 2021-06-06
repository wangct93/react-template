/**
 * Created by wangct on 2018/12/30.
 */
const Mysql = require('@wangct/mysql');
const {objClone} = require("@wangct/util/lib/objectUtil");
const {getPageLimit} = require("../utils/utils");
const mysqlConfig = require('../config/mysql');
const moment = require('moment');
const {isAry} = require("@wangct/util/lib/typeUtil");
const toAry = require("@wangct/util/lib/arrayUtil").toAry;
const toStr = require("@wangct/util/lib/stringUtil").toStr;
const mysql = new Mysql(mysqlConfig);

module.exports = {
  queryUserList,
  createUser,
  deleteUser,
  updateUser,
  userExist,
};

/**
 * 获取用户列表
 * @param params
 * @returns {Promise<any>}
 */
async function queryUserList(params = {}){
  return mysql.search({
    table: 'user',
    limit: getPageLimit(params.page_num, params.page_size),
    orderField:'update_time',
    orderDesc:true,
    fields: [
      '*',
      {
        field: 'create_time',
        isTime: true,
      },
      {
        field: 'update_time',
        isTime: true,
      }],
    where:objClone(params,['user_id','user_name','user_password']),
  }).then((data) => {
    return data.map((item) => ({
      ...item,
      role_list:toStr(item.role_list).split(','),
    }));
  });
}

/**
 * 获取用户列表
 * @param params
 * @returns {Promise<any>}
 */
async function createUser(params){
  const insertData = await mysql.insert({
    table:'user',
    data:{
      ...formatUserData(params),
      create_time:moment().format('YYYY-MM-DD HH:mm:ss'),
      update_time:moment().format('YYYY-MM-DD HH:mm:ss'),
    },
  });
  return queryUserList({
    user_id:insertData.insertId,
  }).then((data) => data[0]);
}


/**
 * 用户是否已存在
 * @returns {Promise<any>}
 */
async function userExist(user_id){
  return mysql.search({
    table:'user',
    fields:['user_id'],
    where:{
      user_id,
    },
  }).then((data) => !!data[0]);
}

/**
 * 删除用户
 * @returns {Promise<any>}
 */
async function deleteUser(user_id){
  return mysql.delete({
    table:'user',
    where:[
      {
        value:user_id,
        key:'user_id',
      }
    ],
  });
}

/**
 * 修改用户
 * @returns {Promise<any>}
 */
async function updateUser(params){
  return mysql.update({
    table:'user',
    where:[
      {
        value:params.user_id,
        key:'user_id',
      }
    ],
    data:{
      ...formatUserData(params),
      update_time:moment().format('YYYY-MM-DD HH:mm:ss'),
    },
  });
}

/**
 * 格式化用户数据
 * @param data
 * @returns {{}}
 */
function formatUserData(data){
  const userData = objClone(data,['user_id','user_name','create_time','update_time','user_password','dept_id']);
  return {
    ...userData,
    role_list:toAry(data.role_list).join(','),
  };
}
