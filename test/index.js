const getLogger = require("@wangct/node-util/lib/log").getLogger;
const addLogConfig = require("@wangct/node-util/lib/log").addLogConfig;
const {pathResolve} = require('@wangct/node-util');


addLogConfig({
  appenders: {
    main: {
      type: 'file',
      filename: pathResolve('logs/aa.txt'),
    },
  },
  categories: {
    taskLog: {
      appenders: ['main', 'console'],
      level: 'info',
    },
  }
});

const log = getLogger('taskLog');

log.info('1234');
