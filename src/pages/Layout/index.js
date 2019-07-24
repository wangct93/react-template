import React, {PureComponent} from 'react';
import util, {getDispatch,getHistory,getProps} from 'wangct-util';
import {Header} from '../../components';

import css from './index.less';

const dispatch = getDispatch('global');
const history = getHistory();

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
