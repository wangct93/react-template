import React, {PureComponent} from 'react';
import util, {reactUtil} from 'wangct-util';

import css from './index.less';

const dispatch = reactUtil.getDispatch('global');
const history = reactUtil.getHistory();
const {getProps} = reactUtil;

export default class Test extends PureComponent {
  render() {
    return <div className={css.container}>
hello world!
    </div>
  }
}
