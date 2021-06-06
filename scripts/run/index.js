const {processExist} = require("@wangct/node-util/lib/system");
const {fileIsExist} = require("@wangct/node-util/lib/file");
const {killProcess} = require("@wangct/node-util/lib/system");
const {killSelf} = require("@wangct/node-util/lib/system");
const {logInfo} = require("@wangct/node-util/lib/log");
const {getCmdParams,pathResolve} = require("@wangct/node-util");

const pidPath = pathResolve('service.pid');

doExec();

function doExec(){
  const type = getCmdParams()[0] || 'start';
  switch (type) {
    case 'start':
      start();
      break;
    case 'stop':
      stop();
      break;
    case 'restart':
      restart();
      break;
    case 'status':
      doCheckStatus();
      break;
  }
}


async function start(){
  logInfo('启动程序');
  const isRun = await isRunning();
  if(isRun){
    logInfo('程序已启动，请使用restart重启');
    return;
  }
  const entryPath = pathResolve('server/index');
  const childModule = require('child_process').fork(entryPath,{
    detached:true,
    stdio:'ignore',
  });
  logInfo('开始记录子程序pid',childModule.pid);
  require('fs').writeFileSync(pidPath,childModule.pid + '');
  setTimeout(() => {
    killSelf();
  },1000);
}

async function stop(){
  logInfo('停止程序');
  const isRun = await isRunning();
  if(isRun){
    await killProcess(getPid());
    await isRunning();
  }
}

async function restart(){
  logInfo('重启程序');
  const isRun = await isRunning();
  if(isRun){
    killProcess(getPid()).finally(() => {
      start();
    });
  }else{
    start();
  }
}

function getPid(){
  let pid;
  try{
    pid = require('fs').readFileSync(pidPath).toString().trim();
  }catch(e){
  }
  return pid;
}


async function doCheckStatus(){
  logInfo('服务状态');
  const isRun = await isRunning();
  if(isRun){
    logInfo('服务正在运行中');
  }else{
    logInfo('服务已停止');
  }
}

async function isRunning(){
  if(!fileIsExist(pidPath)){
    return false;
  }
  return processExist(getPid());
}
