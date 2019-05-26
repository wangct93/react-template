import React, {PureComponent} from 'react';
import util, {reactUtil} from 'wangct-util';
import {Header} from '@lib';

import css from './index.less';

const dispatch = reactUtil.getDispatch('global');
const history = reactUtil.getHistory();
const {getProps} = reactUtil;

export default class Layout extends PureComponent {
  render() {
    return <div className={css.container}>
      <Header />
      <div className={css.body}>
        {
          this.props.children
        }
      </div>
    </div>
  }
}
