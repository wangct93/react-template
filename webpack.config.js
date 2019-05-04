/**
 * Created by wangct on 2018/10/14.
 */


const path = require('path');
const basePath = process.cwd();
const resolve = (...args) => path.resolve(basePath,...args);

module.exports = (config, env) => {
  // 别名配置
  config.resolve.alias = {
    '@lib':resolve('src/components'),
    '@':resolve('src')
  };
  console.log(config.plugins);
  // require('fs').writeFileSync('a.json',JSON.stringify(config.module.rules.map(item => ({...item,test:item.test && item.test.toString()}))),() => {});
  return config
};
