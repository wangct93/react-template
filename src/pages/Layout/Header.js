/**
 * Created by wangct on 2018/10/13.
 */
import React from 'react';
import {Dropdown, Icon, Menu} from 'antd';

import DefineComponent from "../../frame/components/DefineComponent";
import {pathJoin, reduxConnect, requestApi} from "../../frame";
import {Auth,Link,Btn} from "@wangct/react";
import {toAry} from '@wangct/util';
import css from './Header.less';
import {getUserInfo} from "../../utils/util";
import {classNames} from "@wangct/util/lib/util";
import {getAuthMenus} from "../../json/menus";
import {pageTitle} from "../../json/config";

/**
 * 头部
 */
@reduxConnect(({user,layout}) => ({
  userInfo:user.userInfo,
  menus:layout.menus,
}))
export default class Header extends DefineComponent {

  state = {};

  getOverlay(data) {
    const list = getAuthMenus(data.children);
    return <Menu className={css.dropdown_menu}>
      {
        list.map((opt, index) => {
          return <Menu.Item key={index}>
            <NavTitle onClick={opt.onClick} to={opt.path && pathJoin(data.path, opt.path)}>{opt.title}</NavTitle>
          </Menu.Item>;
        })
      }
    </Menu>
  }

  render() {
    return <div className={css.container}>
      <div className={css.wrap}>
        <div className={css.logo}>{pageTitle}</div>
        <div className={css.nav_box}>
          {
            toAry(this.props.menus).map((item,index) => {
              const {path} = item;
              if (item.children) {
                return <Auth key={index} auth={item.auth}>
                  <Dropdown overlay={this.getOverlay(item)}>
                      <span>
                        <NavTitle onClick={item.onClick} disabled className={css.nav} to={path}>{item.title}</NavTitle>
                      </span>
                  </Dropdown>
                </Auth>;
              }
              return <Auth key={index} auth={item.auth}>
                <NavTitle onClick={item.onClick} className={css.nav} to={path}>{item.title}</NavTitle>
              </Auth>
            })
          }
        </div>
        <div className={css.right}>
          <UserInfo />
        </div>
      </div>
    </div>
  }
}

class NavTitle extends DefineComponent {
  state = {

  };

  render() {
    return  this.props.to
      ? <Link {...this.props}>{this.props.children}</Link>
      : <span {...this.props}>{this.props.children}</span>
  }
}

/**
 * 用户信息
 * @author wangchuitong
 */
@reduxConnect(() => ({
  userInfo:getUserInfo(),
}))
class UserInfo extends DefineComponent {
  state = {};

  doLogout = () => {
    requestApi('/user/logout',{
      loading:true,
      method:'post',
    }).then(() => {
      window.location.reload();
    });
  };

  getDropdownMenus() {
    return <Menu>
      <Menu.Item>
        <Icon type="form"/>
        <span>修改密码</span>
      </Menu.Item>
      <Menu.Item onClick={this.doLogout}>
        <Icon type="poweroff"/>
        <span>退出登录</span>
      </Menu.Item>
    </Menu>;
  }

  render() {
    return <Dropdown placement="bottomRight" overlay={this.getDropdownMenus()}>
      <div className={classNames(css.user_box,'user-view')}>
        <div className={css.icon_user} />
        <span className={css.text_user}>{this.props.userInfo.user_name}</span>
        <Icon type="caret-down" />
      </div>
    </Dropdown>;
  }
}
