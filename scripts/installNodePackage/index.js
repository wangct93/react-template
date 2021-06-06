const pathResolve = require("../../server/@wangct/node-util/path").pathResolve;
const fileDelete = require("../../server/@wangct/node-util/file").fileDelete;

const spawn = require("../../server/@wangct/node-util/spawn").spawn;
const logInfo = require("../../server/@wangct/node-util/log").logInfo;

start();

async function start(){
  logInfo('开始删除：node_modules');
  await fileDelete(pathResolve('node_modules'));
  logInfo('开始加载：依赖包为package.json的dependencies');
  await spawn('nrm',['use','taobao']);
  await spawn('npm',['install','--production']);
}
