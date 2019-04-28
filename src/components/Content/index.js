/**
 * Created by wangct on 2019/1/4.
 */
import React, {PureComponent} from 'react';
import {connect} from 'dva';

import css from './index.less';

export default class Content extends PureComponent {
  state = {
  };

  getRealState() {
    return {
      ...this.state,
      ...this.props
    }
  }

  getData(){
    const {text = ''} = this.getRealState();
    const re = /\$IMG=(((?!\$\$).)*)\$\$/;
    return text.split(' ').map(item => {
      const match = item.match(re);

      console.log(match);
      return {
        tag:'p',
        text:match ? <img src={match[1]} /> : item,
        className:match ? 'wit-html-line-img' : 'wit-html-line-text'
      }
    })
  }

  render() {
    return <div className="wit-html-content">
      {
        this.getData().map((item,i) => {
          const Tag = item.tag;
          return <Tag className={item.className} key={i}>{item.text}</Tag>
        })
      }
    </div>
  }
}
