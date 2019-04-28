/**
 * Created by wangct on 2019/2/1.
 */

const {spawn} = require('child_process');
const dev = spawn('npm.cmd', ['run', 'dev']);

dev.stdout.on('data', (data) => {
  console.log(data.toString());
});

dev.stderr.on('data', (data) => {
  console.log(data.toString());
});

dev.on('close', (code) => {
  console.log(`子进程退出码：${code}`);
});

module.exports = dev;
