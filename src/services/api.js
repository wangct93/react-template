import request from '../_entry/modules/request';

function requestApi(url,options){
  return request('/api' + url,options);
}

export function doTest(params){
  return requestApi('/test',{
    method:'post',
    body:params
  })
}
