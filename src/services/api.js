import util from 'wangct-util';
import request from '../utils/request';

const cache = new util.cache();


export function queryComicList(params){
  return request('/api/queryComicList',{
    method:'post',
    body:params
  });
}

export function upload(params){
  return request('/file/upload',{
    method:'post',
    body:params
  })
}

export function login(params){
  return request('/user/login',{
    method:'post',
    body:params
  })
}

export function logout(){
  return request('/user/logout')
}

export function register(params){
  return request('/user/register',{
    method:'post',
    body:params
  })
}

export function getUserInfo(){
  return request('/user/getInfo')
}


export function queryCommentList(params){
  return request('/api/queryCommentList',{
    method:'post',
    body:params
  })
}

export function submitComment(params){
  return request('/api/submitComment',{
    method:'post',
    body:params
  })
}

export function queryComic(params){
  return request('/api/queryComicInfo',{
    method:'post',
    body:params
  })
}

export function queryCorrelativeList(params){
  return request('/api/queryCorrelativeList',{
    method:'post',
    body:params
  });
}

export function queryLabelList(params){
  let pro = cache.getItem('labelList');
  if(pro){
    return pro;
  }else{
    pro = request('/api/queryLabelList',{
      method:'post',
      body:params
    });
    cache.setItem('labelList',pro);
    return pro;
  }
}

export function queryBannerList(params){
  return request('/api/queryBannerList',{
    method:'post',
    body:params
  });
}

export function queryRecommendList(params){
  return request('/api/queryRecommendList',{
    method:'post',
    body:params
  });
}
