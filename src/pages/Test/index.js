import React, {PureComponent} from 'react';
import {Carousel, Input, Icon, Rate, Button,Modal} from 'antd';
import util, {reactUtil} from 'wangct-util';

import css from './index.less';

const dispatch = reactUtil.getDispatch('home');
const history = reactUtil.getHistory();

const {getProps} = reactUtil;
export default class Home extends PureComponent {
  render() {
    return <div className={css.container}>
      测试页面hello world！d
    </div>
  }
}