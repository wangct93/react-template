const util = require('wangct-server-util');
const routes = require('./routes');

module.exports = {
  entry:{
    main:util.resolve('src/index')
  },
  routes,
  dynamicImport:true
};
