import {toStr} from '@wangct/util';

/**
 * 获取格式化方法
 * @param config  number：数字，enLang：英文，defaultValue：默认值
 */
export function getFormatter(config){
  return (value) => {
    value = toStr(value);
    const {length,number} = config;
    if(length && value.length > length){
      value = value.substr(0,length);
    }
    if(number){
      value = value.replace(/\D/g,'');
    }
    if(config.enLang || config.en || config.lang === 'en'){
      value = enLangFormatter(value);
    }
    return value;
  };
}

export function enLangFormatter(value){
  const cnRe = /[\u4e00-\u9fa5]/g;
  return toStr(value).replace(cnRe,'');
}
