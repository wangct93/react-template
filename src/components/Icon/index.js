/**
 * Created by wangct on 2019/3/9.
 */
import React, {PureComponent} from 'react';
import Icon from 'antd/lib/icon';
import util,{reactUtil} from 'wangct-util';

const cache = util.cache();
const {getProps} = reactUtil;

export default class IconBox extends PureComponent {
  getComponent() {
    const {scriptUrl} = getProps(this);
    return scriptUrl ? getIconfont(scriptUrl) : Icon;
  }

  render() {
    const Icon = this.getComponent();
    return <Icon {...getProps(this)} />
  }
}

function getIconfont(scriptUrl){
  let Iconfont = cache.getItem(scriptUrl);
  if(!Iconfont){
    Iconfont = Icon.createFromIconfontCN({
      scriptUrl
    });
    cache.setItem(scriptUrl,Iconfont);
  }
  return Iconfont;
}
