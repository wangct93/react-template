import request from './request';




export function test(params){
  return request('/api/test',{
    method:'post',
    body:params
  });
}
