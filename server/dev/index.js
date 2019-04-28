/**
 * Created by wangct on 2019/2/1.
 */

require('./watch');
const dev = require('./dev');


process.on('uncaughtException',() => {
  dev.kill();
});
process.on('exit',() => {
  dev.kill();
});
