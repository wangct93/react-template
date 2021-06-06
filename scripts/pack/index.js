const {fileCopy} = require("@wangct/node-util/lib/file");
const {fileMkdir} = require("@wangct/node-util/lib/file");
const {spawn} = require("@wangct/node-util/lib/childProcess");
const {pathResolve} = require('@wangct/node-util');


const [project_name = 'works'] = process.argv.slice(2);


const output = pathResolve(project_name);

start();


async function start(){
  await spawn('npm',['run','build']);
  await spawn('rimraf',[output]);
  await spawn('rimraf',[project_name + '.tar']);
  await spawn('rimraf',[project_name + '.tar.gz']);
  fileMkdir(output);
  await fileCopy(pathResolve(),output,{
    include(filePath){
      const list = ['server','dist','package.json','package-lock.json','scripts'];
      return list.some((item) => {
        return filePath.startsWith(pathResolve(item));
      });
    }
  });
  await spawn('npm',['i','--production'],{
    cwd:output,
  });
  await spawn('7z',['a',project_name + '.tar',output]);
  await spawn('7z',['a',project_name + '.tar.gz',project_name + '.tar']);
}
