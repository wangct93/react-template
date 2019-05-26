import util from 'wangct-util';
const {fetch} = window;

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
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
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
  const newOptions = formatOptions(options);
  url = addToken(url);
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(parseJSON)
    .catch((data) => ({success:false,message:data && data.message || '连接服务器失败！'}))
    .then(json => {
      return json.success ? Promise.resolve(json.data) : Promise.reject(json.message);
    });
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

function addToken(url){
  const token = util.cookie('wangct_token');
  return token ? url + (url.includes('?') ? '&' : '?') + 'token=' + token : url;
}
