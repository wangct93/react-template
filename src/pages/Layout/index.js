/**
 * Created by wangct on 2018/8/28.
 */
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import css from './index.less';
import DefineComponent from "../../frame/components/DefineComponent";
import {getUserInfo, pathToMobile, updateUserInfo} from "../../utils/util";
import {getResizeSign, reduxConnect} from "../../frame";
import {Flex} from '@wangct/react';
import Loading from "../../frame/components/Loading";
import Login from "../Login";

/**
 * 布局
  */
@reduxConnect(() => ({
  resizeSign:getResizeSign(),
  userInfo:getUserInfo(),
}))
export default class Layout extends DefineComponent{

  state = {
    isLogined:null,
    // isLogined:true,
  };

  componentDidMount() {
    super.componentDidMount();
    updateUserInfo().catch(() => {
      this.setState({
        isLogined:false,
      });
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.checkField(prevProps,'userInfo',() => {
      this.setState({
        isLogined:!!this.props.userInfo,
      });
    })
  }


  render(){
    const {props} = this;
    if(this.state.isLogined === null){
      return <Loading loadding title="正在获取用户信息..." />
    }
    if(!this.state.isLogined){
      return <Login />;
    }
    return <Flex column className={css.container}>
      <Header/>
      <Flex.Item className={css.body}>{props.children}</Flex.Item>
      <Footer />
    </Flex>
  }
}
