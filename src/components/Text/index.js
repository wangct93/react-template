/**
 * Created by wangct on 2019/1/19.
 */
import React, {PureComponent} from 'react';
import util,{reactUtil} from 'wangct-util';

import Icon from '../Icon';

import './index.less';

const {getProps} = reactUtil;

export default class Text extends PureComponent {

  getIconProps(){
    const {icon} = getProps(this);
    return icon && (util.isString(icon) ? {type:icon} : icon);
  }

  render() {
    const props = getProps(this);
    const iconProps = this.getIconProps();
    return <span {...props} className={util.classNames('wct-text',props.className)}>
      {iconProps && <Icon {...iconProps} className="wct-text-icon" />}
      {props.children}
    </span>
  }
}
