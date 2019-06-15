import {request} from 'wangct-dva';


export function doTest(params){
  return request('/authority/user/login',{
    method:'post',
    body:params
  })
}