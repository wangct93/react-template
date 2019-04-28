/**
 * Created by wangct on 2018/10/21.
 */
import React, {PureComponent} from 'react';
import {Spin} from 'antd';
import util from 'wangct-util';
import css from './index.less';

export default class Loading extends PureComponent{
  render(){
    const {mode,text} = this.props;
    const isFull = mode === 'full';
    return <div className={util.classNames(css.wrap,isFull && css.type_full)}>
      <div className={css.content}>
        <Spin spinning={true} size="large" />
        {
          text && <div className={css.text}>{text}</div>
        }
      </div>
    </div>
  }
}
