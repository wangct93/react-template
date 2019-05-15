import {request} from 'wangct-dva';




export function queryComicList(params){
  return request('/api/queryComicList',{
    method:'post',
    body:params
  });
}
