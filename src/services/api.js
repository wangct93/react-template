
import {request} from 'wangct-react-entry';


export function requestApi(url,...args){
  return request('/api' + url,...args);
}

