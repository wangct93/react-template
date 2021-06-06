const moment = require('moment');
const {pathFilename} = require("@wangct/node-util/lib/path");

exec();
setInterval(() => {
  exec();
},1000);

function exec(){
  const fileName = pathFilename(__filename,false);
  const msg = `文件名：${fileName}，进程号：${process.pid}，时间：${moment().format('YYYY-MM-DD HH:mm:ss')}`;
  console.log(msg);
  require('fs').writeFileSync('test/task/' + fileName + '.txt',msg);
}
