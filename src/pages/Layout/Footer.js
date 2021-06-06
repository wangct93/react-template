/**
 * Created by wangct on 2018/10/13.
 */
import React from 'react';
import css from './Footer.less';
import DefineComponent from "../../frame/components/DefineComponent";

/**
 * 尾部
 */
export default class Footer extends DefineComponent{
  render(){
    return <div className={css.container}>
      <p>© 2021 wangct All Rights Reserved.</p>
    </div>
  }
}
