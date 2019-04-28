/**
 * Created by wangct on 2018/12/30.
 */
const Mysql = require('wangct-mysql');
const config = require('../config/mysql');
const mysql = new Mysql(config);
const util = require('wangct-server-util');
const {arrayUtil,dateUtil} = util;

module.exports = {
  queryList,
  queryCommentList,
  queryComic,
  queryCorrelativeList,
  queryLabelList,
  queryBannerList,
  queryRecommendList
};



function queryBaseList(params,cb){
  let sql;
  if(params.type){
    sql = `select c.* from comic c,label l ${getListWhere(params)} ${getDesc(params.orderField,params.orderDesc,'c')} ${getLimit(params.start,params.limit)}`
  }else{
    sql = `select * from comic ${getListWhere(params)} ${getDesc(params.orderField,params.orderDesc)} ${getLimit(params.start,params.limit)}`;
  }
  mysql.query(sql,(err,data) => {
    addExtInfo(data,data => {
      cb(err,data);
    })
  });
}

function queryTotal(params,cb){
  let sql;
  if(params.type){
    sql = 'select count(c.id) total from comic c,label l' + getListWhere(params);
  }else{
    sql = 'select count(id) total from comic' + getListWhere(params);
  }
  mysql.query(sql,cb);
}

function queryList(params,cb){
  params = {
    orderField:'hits',
    orderDesc:true,
    start:0,
    limit:10,
    ...params
  };
  const listPro = new Promise((cb,eb) => {
    queryBaseList(params,(err,data) => {
      if(err){
        eb(err);
      }else{
        cb(data);
      }
    })
  });
  const totalPro = new Promise((cb,eb) => {
    queryTotal(params,(err,data) => {
      if(err){
        eb(err);
      }else{
        cb(data[0].total);
      }
    })
  });
  Promise.all([listPro,totalPro]).then(([list,total]) => {
    cb(null,{
      total,
      list
    });
  },cb)
}

function getListWhere(params){
  const fields = ['status'];
  const result = [];
  const type = params.type;
  fields.forEach(field => {
    const value = params[field];
    if(util.isDef(value)){
      result.push(`${type ? 'c.' : ''}${field} = '${value}'`);
    }
  });
  if(type){
    result.push(`l.comicId = c.id and l.name = '${type}'`);
  }
  return result.length ? ` where ${result.join(' and ')}` : ''
}

function getLimit(start,limit){
  return start === undefined ? '' : ` limit ${start},${limit}`;
}

function getDesc(field,desc,parent){
  return field ? ` order by ${parent ? parent + '.' : ''}${field} ${desc ? 'desc' : ''}` : '';
}


function queryCommentList(params,cb){
  const baseSql = ` from comment c,user u,user uu where ${params.parent ? 'c.parent = ' + params.parent : 'isNull(c.parent)'} and c.userId = u.id and c.toUserId = uu.id`;
  const p1 = new Promise(cb => {
    mysql.query(`select c.*,u.id userId,u.name userName,u.cover,date_format(c.time,"%Y-%m-%d %H:%i:%s") time,uu.id toUserId,uu.name toUserName,uu.cover toUserCover ${baseSql}${getLimit(params.start,params.limit)}`,(err,data = []) => {
      cb(data);
    })
  });
  const p2 = new Promise((cb,eb) => {
    mysql.query('select count(c.id) total' + baseSql,(err,data) => {
      if(err){
        eb(err);
      }else{
        cb(data[0].total);
      }
    });
  });

  Promise.all([p1,p2]).then(json => {
    cb({
      total:json[1],
      list:json[0]
    })
  })
}

function insertComment(params,cb){
  mysql.query(`insert into comment(userId,content,parent,type,time,toId,toUserId) values('${params.userId}','${params.content}',${params.parent || 'null'},'${params.type}','${dateUtil.format()}',${params.to || 'null'},${params.toUserId})`,cb)
}

function getRecommend(cb){
  mysql.query(`select *,date_format(time,"%Y-%m-%d %H:%i:%s") time from recommend r,blog b where b.id = r.blogId`,cb);
}


function queryComic(id,cb){
  const pro = new Promise((cb,eb) => {
    mysql.query(`select * from comic where id = ${id}`,(err,data) => {
      if(err){
        eb(err);
      }else{
        addExtInfo(data,data => {
          cb(data[0]);
        });
      }
    });
  });
  const listPro = new Promise((cb,eb) => {
    mysql.query(`select * from chapter where comicId = ${id}`,(err,data) => {
      if(err){
        eb(err);
      }else{
        cb(data);
      }
    });
  });
  Promise.all([pro,listPro]).then(([data,list]) => {
    cb(null,{
      ...data,
      list
    });
  },err => {
    cb(err);
  });
}


function queryCorrelativeList(id,cb){
  const list = new Array(5).fill().map(item => {
    return Math.floor(Math.random() * 10000);
  })
  mysql.query(`select * from comic where id in (${list.join(',')})`,cb);
}

function queryLabelList(cb){
  mysql.query('select name,count(id) count from label group by name',(err,data = []) => {
    cb(err,data.sort((a,b) => b.count - a.count).map(item => item.name));
  });
}

function queryBannerList(cb){
  mysql.query(`select c.* from comic c,banner b where b.comicId = c.id order by b.num`,(err,data) => {
    addExtInfo(data,data => {
      cb(err,data);
    })
  });
}

function queryRecommendList(cb){
  mysql.query(`select c.* from comic c,recommend b where b.comicId = c.id order by b.num limit 0,6`,(err,data) => {
    addExtInfo(data,data => {
      cb(err,data);
    })
  });
}

function addExtInfo(data,cb){
  addComicScore(data,(data) => {
    addComicLabel(data,cb);
  });
}

function addComicLabel(list = [],cb){
  if(list.length){
    mysql.query(`select * from label where comicId in (${list.map(item => item.id).join(',')})`,(err,labels = []) => {
      const labelValues = arrayUtil.classify(labels,'comicId',item => item.name);
      cb(list.map(item => ({
        ...item,
        label:labelValues[item.id] || []
      })))
    });
  }else{
    cb(list);
  }
}

function addComicScore(list = [],cb){
  if(list.length){
    mysql.query(`select AVG(score) score,comicId from score where comicId in (${list.map(item => item.id)}) group by comicId;`,(err,data = []) => {
      const values = arrayUtil.toObject(data,'comicId',item => item.score);
      cb(list.map(item => ({
        ...item,
        score:values[item.id] || 0
      })))
    });
  }else{
    cb(list);
  }
}
