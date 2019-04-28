const fs = require('fs');
const util = require('wangct-server-util');
const path = require('path')
const resolve = (...paths) => path.resolve(process.cwd(),...paths);

module.exports = {
  pack,
  parse
};



function pack(option){
  let content = '';
  const src = path.resolve(process.cwd(),option.src);
  util.copyFile({
    exclude:(filePath) => {
      return ['png','jpg','jpge'].includes(path.extname(filePath).substr(1).toLocaleLowerCase());
    },
    transform:(filePath,outputPath,cb) => {
      fs.readFile(filePath,(err,data) => {
        if(err){
          console.log(err);
          cb();
        }else{
          const header = getContent(path.relative(src,filePath),'filePath');
          const body = getContent(data,'content');
          content += getContent(header + body,'container');
          cb();
        }
      })
    },
    ...option,
    src,
    output:undefined,
    success:() => {
      fs.writeFile(path.resolve(process.cwd(),option.output || ''),content,() => {
        util.callFunc(option.success,content);
      });
    }
  });
}

function parse(src,output = '',cb){
  output = resolve(output);
  src = resolve(src);
  util.mkdir(output);
  fs.readFile(src,(err,data) => {
    if(err){
      console.log(err);
    }else{
      const files = parseFunc(data.toString());
      util.queue({
        list:files,
        func:(item,cb) => {
          const {name,content} = item;
          if(name){
            const filePath = resolve(output,name);
            util.mkdir(filePath);
            fs.writeFile(filePath,content,cb);
          }else{
            cb();
          }
        },
        success:() => {
          util.callFunc(cb);
        }
      });
    }
  })
}


function getContent(content,type){
  const sign = getSign(type);
  return sign.start + content + sign.end;
}

function getSign(type = 'container',pos){
  const sign = {
    start:`\n$$wangct-${type}-start$$\n`,
    end:`\n$$wangct-${type}-end$$\n`
  };
  return sign[pos] || sign;
}

function parseFunc(content){
  return splitBySign(content).map(item => {
    const name = splitBySign(item,'filePath')[0];
    if(name){
      return {
        name,
        content:splitBySign(item,'content')[0]
      }
    }
  }).filter(item => !!item);
}

function splitBySign(content = '',type = 'container'){
  const sign = getSign(type);
  const formatRelString = (str) => str.replace(/\$/g,'\\$');
  const re = new RegExp(formatRelString(sign.start) + '([\\w\\W]*?)' + formatRelString(sign.end),'g');
  const ary = [];
  content.replace(re,(match,data) => {
    ary.push(data);
  });
  return ary;
}
