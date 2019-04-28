/**
 * Created by wangct on 2019/3/18.
 */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import util, {reactUtil} from 'wangct-util';
import css from './index.less';

import IMG403 from '@/asset/image/403.png'

const {getProps} = reactUtil;

const dispatch = reactUtil.getDispatch('global');

@connect(({user}) => ({
  userInfo:user.userInfo
}))
export default class LoginAuth extends PureComponent {
    state = {};

    render() {
      const props = getProps(this);
        return props.userInfo ? props.children : <Page403 />
    }
}

export function loginAuth(Com){
  return () => <LoginAuth>
    <Com />
  </LoginAuth>
}

class Page403 extends PureComponent{

  toLogin = () => {
    dispatch({
      type:'global/updateField',
      field:'loginMode',
      data:'login'
    })
  };

  render(){
    return <div className="fixed-width">
      <div className={css.page_403} style={{backgroundImage:'url('+ IMG403 +')'}}>
        <p>
          无权限访问本页面，请先<a onClick={this.toLogin}>登录</a>
        </p>
      </div>
    </div>
  }
}
