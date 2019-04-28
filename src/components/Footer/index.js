/**
 * Created by wangct on 2018/10/13.
 */
import React, {PureComponent} from 'react';


import css from './index.less';

export default class Login extends PureComponent{
  state = {

  };
  getRealState(){
    return {
      ...this.state,
      ...this.props
    }
  }
  render(){
    const state = this.getRealState();
    return <div className={css.container}>
      <div className={css.content}><span>&copy;</span>2019 wangct All Rights Reserved</div>
    </div>
  }
}
