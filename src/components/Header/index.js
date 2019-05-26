/**
 * Created by wangct on 2018/10/13.
 */
import React, {PureComponent} from 'react';
import css from './index.less';


export default class Header extends PureComponent{
  render(){
    return <div className={css.header}>
      <div className="fixed-width">
        hello 头部！
      </div>
    </div>
  }
}
