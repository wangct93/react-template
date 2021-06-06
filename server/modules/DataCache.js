const {BaseClass} = require("./BaseClass");
const defaultConfig = {
  limit:100,
};

class DataCache extends BaseClass{

  constructor(options = {}){
    super();
    this.setProps({
      ...defaultConfig,
      ...options,
    });
  }

  setItem(key,value){
    const item = {
      times:+new Date(),
      key,
      value,
    };
    const data = this.getData();
    data[key] = item;
    this.checkLimit();
  }

  checkLimit(){
    const limit = this.getProp('limit');
    if(limit){
      const data = this.getData();
      const keys = Object.keys(data);
      if(keys.length > limit){
        const key = keys.sort((a,b) => data[a].times - data[b].times)[0];
        delete data[key];
      }
    }
  }

  getItem(key){
    const target = this.getData()[key];
    return target && target.value;
  }
}

module.exports = {
  DataCache,
};
