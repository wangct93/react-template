/**
 * Created by wangct on 2018/10/13.
 */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Icon,Input,Dropdown} from 'antd';
import {Link,Text} from 'wangct-react';
import {reactUtil} from 'wangct-util';
import css from './index.less';

const {getProps} = reactUtil;

const dispatch = reactUtil.getDispatch('global');

@connect(({user}) => ({
  userInfo:user.userInfo
}))
export default
class Header extends PureComponent{
  render(){
    return <div className={css.header}>
      <div className="fixed-width">
        <Link className={css.logo} to="/">
          <img src="http://css99tel.cdndm5.com/v201904041843/blue/images/header-logo.png" alt="图片" />
        </Link>
        <Nav />
        <SearchBox />
        <ToolBox />
        <UserInfo />
      </div>
    </div>
  }
}

class Nav extends PureComponent{
  state = {
    list:[
      {
        text:'首页',
        path:'/'
      },
      {
        text:'更新',
        path:'/update'
      },
      {
        text:'排行',
        path:'/rank'
      },
      {
        text:'日漫',
        path:'/japan'
      },
      {
        text:<Icon type="menu" />,
        path:'/list'
      }
    ]
  }
  render(){
    return <div className={css.nav_list}>
      {
        this.state.list.map(item => {
          return <div key={item.path} className={css.nav_item}>
            <Link to={item.path} key={item.path}>{item.text}</Link>
          </div>
        })
      }
    </div>
  }
}

class SearchBox extends PureComponent{
  render(){
    return <div className={css.search_box}>
      <Input.Search
        placeholder="请输入关键词"
        enterButton={
          <span>
            <Icon type="search" />
            <span>搜索</span>
          </span>
        }
        size="large"
        onSearch={value => console.log(value)}
      />
    </div>
  }
}


class ToolBox extends PureComponent{
  state = {
    list:[
      {
        text:'VIP',
        icon:'user',
        handler:() => {
          console.log('vip')
        }
      },
      {
        text:'历史',
        icon:'user',
        handler:() => {
          console.log('历史')
        }
      },
      {
        text:'收藏',
        icon:'user',
        handler:() => {
          console.log('收藏')
        }
      },
      {
        text:'下载APP',
        icon:'user',
        handler:() => {
          console.log('下载APP')
        }
      }
    ]
  }
  render(){
    return <ul className={css.tool_list}>
      {
        this.state.list.map(item => {
          return <li key={item.text}>
            <div>
              <Icon type={item.icon} />
            </div>
            <div className={css.tool_text}>{item.text}</div>
          </li>
        })
      }
    </ul>
  }
}

class UserInfo extends PureComponent{
  state = {};
  render(){
    return <div className={css.user_wrap}>
      <img src="http://css99tel.cdndm5.com/blue/images/mrtx.gif" />
    </div>
  }
}
