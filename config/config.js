
const util = require('wangct-server-util');

const {resolve} = util;

module.exports = {
  // entry:resolve('src'),
  routes:[
    {
      path:'/',
      component:'Layout'
    },
  ],
  proxy:{
    '/api':'http://localhost:8055'
  },
  dynamicImport:true,
  eslint:true
};
