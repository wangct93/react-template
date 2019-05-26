import request from './request';




export function createProject(params){
  return request('/api/createProject',{
    method:'post',
    body:params
  });
}
