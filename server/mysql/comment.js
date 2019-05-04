const Mysql = require('wangct-mysql');
const config = require('../config/mysql');
const mysql = new Mysql(config);
const util = require('wangct-server-util');
const {arrayUtil,dateUtil} = util;


module.exports = {
  queryList,
  insert
};


function queryList(params,cb){
  params = {
    orderField:'time',
    orderDesc:true,
    start:0,
    limit:10,
    ...params
  };
  const listPro = new Promise((cb,eb) => {
    mysql.query(`select c.*,u.cover,u.name userName,date_format(c.time,"%Y-%m-%d %H:%i:%s") time from comment c,user u${getListWhere(params,'c')} and u.id = c.userId ${getLimit(params.start,params)}${getOrder(params)}`,(err,data) => {
      if(err){
        eb(err);
      }else{
        const parentList = arrayUtil.noRepeat(data.reduce((pv,{parent}) => parent ? pv.concat(parent.split(',')) : pv,[]));
        if(parentList.length){
          mysql.query(`select c.*,u.cover,u.name userName,date_format(c.time,"%Y-%m-%d %H:%i:%s") time from comment c,user u where c.id in (${parentList.join(',')}) and u.id = c.userId`,(err,subData) => {
            if(err){
              eb(err);
            }else{
              const values = arrayUtil.toObject(subData,'id');
              cb(data.map(item => ({
                ...item,
                children:item.parent && item.parent.split(',').map(item => values[item])
              })));
            }
          });
        }else{
          cb(data);
        }
      }
    });
  });
  const totalPro = new Promise((cb,eb) => {
    mysql.query(`select count(id) total from comment${getListWhere(params)}`,(err,data) => {
      if(err){
        eb(err);
      }else{
        cb(data);
      }
    });
  });
  Promise.all([listPro,totalPro]).then(result => {
    cb(null,{
      list:result[0],
      total:result[1][0].total
    })
  },cb);
}


function getListWhere(params,scope){
  const fields = ['type','rootId'];
  const result = [];
  fields.forEach(field => {
    const value = params[field];
    if(util.isDef(value)){
      result.push(`${scope ? scope + '.' : ''}${field} = '${value}'`);
    }
  });
  return result.length ? ` where ${result.join(' and ')}` : ''
}

function getLimit(params){
  const {start,limit = 10} = params;
  return start === undefined ? '' : ` limit ${start},${limit}`;
}

function getOrder(params){
  const {orderField,orderDesc} = params;
  return orderField ? ` order by ${orderField} ${orderDesc ? 'desc' : ''}` : '';
}


function insert(params,cb){
  const data = {
    ...params,
    time:dateUtil.format()
  };
  const fields = ['userId','content','parent','type','time','toId','rootId']
  mysql.query(`insert into comment${getSqlFields(fields)} values${getSqlValues(fields,data)}`,(err,data) => {
    cb(err,data && data.insertId);
  })
}

function getSqlFields(fields){
  return '(' + fields.map(item => item) + ')';
}

function getSqlValues(fields,list){
  list = util.arrayUtil.toArray(list);
  return list.map(item => {
    return '(' + fields.map(field => {
      const value = item[field];
      return util.isDef(value) ? `'${value}'` : 'null'
    }).join(',') + ')'
  }).join(',')
}
