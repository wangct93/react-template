import {message} from 'antd';
const {fetch} = window;

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  const {status} = response;
  if (status >= 200 && status < 300) {
    return response;
  }
  if(status === 555){
    response.json().then(data => {
      const {location} = window;
      location.href = data.data.location + '/login?goto=' + encodeURIComponent(location.href);
    });
    throw new Error('无权限访问');
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {object} [alertError] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {},alertError = true) {
  const newOptions = formatOptions(options);
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(parseJSON)
    .catch((error = {}) => {
      const message = error.message ? error.message : error;
      return {code:error.code || 500,message:message || '连接服务器失败！'};
    })
    .then(json => {
      if(isSuccess(json) && alertError){
        message.error(json.message);
      }
      return isSuccess(json) ? Promise.resolve(json.data) : Promise.reject(json);
    });
}

function isSuccess(data){
  return data.code === 0;
}


function formatOptions(options){
  const {body} = options;
  if(body && !(body instanceof FormData)){
    options.body = JSON.stringify(options.body);
    options.headers = {
      ...options.headers,
      'content-type':'application/json'
    }
  }
  return options;
}
