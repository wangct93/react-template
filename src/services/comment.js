import request from '../utils/request';

export function queryList(params){
  return request('/comment/queryList',{
    method:'post',
    body:params
  });
}

export function submit(params){
  return request('/comment/submit',{
    method:'post',
    body:params
  });
}
