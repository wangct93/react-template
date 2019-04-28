/**
 * Created by wangct on 2019/3/17.
 */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Modal,Button,Input,message} from 'antd';
import util, {reactUtil} from 'wangct-util';
import {Icon} from 'wangct-react';

import css from './index.less';

import {login,register} from '@/services/api';

const {getProps} = reactUtil;

const dispatch = reactUtil.getDispatch('global');

@connect(({global}) => ({
  mode:global.loginMode
}))
export default class Login extends PureComponent {
  state = {
    modes:['login','register'],
    titles:{
      login:'登录',
      register:'注册'
    },
    btns:{
      login:'登录',
      register:'注册'
    }
  };

  close = () => {
    dispatch({
      type:'updateField',
      field:'loginMode',
      data:null
    })
  };

  inputChange = (field,e) => {
    this.setState({
      [field]:e.target.value
    })
  };

  getLoginParams(){
    const {username,password} = getProps(this);
    return {
      name:username,
      password
    }
  }

  doSubmit = () => {
    const params = this.getLoginParams();
    const props = getProps(this);
    if(!params.name){
      message.info('用户名不能为空');
    }else if(!params.password){
      message.info('密码不能为空');
    }else if(props.mode === 'login'){
      this.doLogin(params);
    }else{
      this.doRegister(params);
    }
  };

  doGetUserInfo(){
    this.close();
    dispatch({
      type:'user/getUserInfo'
    });
  }

  doLogin(params){
    login(params).then(result => {
      if(result.success && result.data){
        message.success('登录成功！');
        this.doGetUserInfo();
      }else{
        Modal.error({
          title:'登录失败',
          content:result.message || '用户名或者密码错误！',
          okText:'知道了'
        });
      }
    })
  }

  doRegister(params){
    register(params).then(result => {
      if(result.success && result.data){
        message.success('注册成功！');
        this.doGetUserInfo();
      }else{
        Modal.error({
          title:'注册失败',
          content:result.message || '注册失败，请联系管理员！',
          okText:'知道了'
        })
      }
    })
  }

  getVisible(){
    const props = getProps(this);
    return props.modes.includes(props.mode);
  }

  toOtherPage = (mode) => {
    dispatch({
      type:'updateField',
      field:'loginMode',
      data:mode
    });
    this.setState({
      username:'',
      password:''
    })
  };

  render() {
    const props = getProps(this);
    const visible = this.getVisible();
    const isLogin = props.mode === 'login';
    return <Modal
      title={props.titles[props.mode]}
      visible={visible}
      width={360}
      footer={null}
      maskClosable
      onCancel={this.close}
    >
      <div className={css.container}>
        <div className={css.form_box}>
          <div className={css.form_line}>
            <Input value={props.username} name="name" onChange={this.inputChange.bind(this,'username')} placeholder="用户名" prefix={<Icon type="user" />} />
          </div>
          <div className={css.form_line}>
            <Input type="password" name="password" value={props.password} onChange={this.inputChange.bind(this,'password')} placeholder="密码" prefix={<Icon type="lock" />} />
          </div>
          <div className={css.btn_box}>
            <Button type="primary" onClick={this.doSubmit}>{props.btns[props.mode]}</Button>
          </div>
          <div className={css.ext_info}>
            {
              isLogin ? <span>没有账号？ <a onClick={this.toOtherPage.bind(this,'register')}>注册</a></span> : <span>已经拥有账户？ <a onClick={this.toOtherPage.bind(this,'login')}>登录</a></span>
            }
          </div>
        </div>
      </div>
    </Modal>
  }
}


