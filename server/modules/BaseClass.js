const {toAry} = require('@wangct/util');

class BaseClass{
  getProp(key){
    return this.getProps()[key];
  }

  getProps(){
    return this.props || {};
  }

  setProps(props){
    this.props = props;
  }

  setProp(key,value){
    this.setProps({
      ...this.getProps(),
      [key]:value,
    });
  }

  getOptions(){
    return toAry(this.getProp('options'));
  }

  setOptions(options){
    return this.setProp('options',options);
  }

  getData(){
    let data = this.getProp('data');
    if(!data){
      data = {};
      this.setProp('data',data);
    }
    return data;
  }

  setData(data){
    return this.setProp('data',data);
  }
}

module.exports = {
  BaseClass,
};
