const util = require('@wangct/node-util');
const serverConfig = require('../server/config/server');

const {resolve} = util;

module.exports = {
  html:'public/index.html',
  port:9585,
  output:{
    build:{
      publicPath:'/assets/'
    }
  },
  prod:{
  },
  dynamicImport:true,
  disableCssModules:[
    resolve('node_modules/@wangct/react')
  ],
  devServer:{
    proxy:{
      '/api/':{
        target:getProxyAddress(),
        pathRewrite:{
          '^/api':'',
        },
      }
    },
  },
};


function getProxyAddress(){
  return `http://${util.getLocalIp()}:${serverConfig.port}`
}
