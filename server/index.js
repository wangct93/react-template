

const config = require('./config/server');
const util = require('wangct-server-util');

util.createServer({
  ...config,
  port:getBsConfig().port || config.port
});


function getBsConfig(){
  let bsConfig = {};
  try{
    bsConfig = require(util.resolve('basement.config.js'));
  }catch(e){}
  return bsConfig;
}
