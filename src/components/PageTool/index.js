import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button,BackTop} from 'antd';
import util, {reactUtil} from 'wangct-util';
import css from './index.less';

const {getProps} = reactUtil;
const dispatch = reactUtil.getDispatch('global');
const history = reactUtil.getHistory();

export default class Com extends PureComponent {
  state = {};

  render() {
    return <div>
      <BackTop />
    </div>
  }
}
