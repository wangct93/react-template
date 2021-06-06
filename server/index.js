

const config = require('./config/server');
const {Server} = require('@wangct/node-util');

new Server({
  ...config,
});


