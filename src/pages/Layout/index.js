import React, {PureComponent} from 'react';
import {Header} from '../../components';

import css from './index.less';
import {Button} from "antd";
import {pathTo, reduxConnect} from "wangct-react-entry";
import {random} from "wangct-util";

@reduxConnect(({global}) => (({
  global,
})))
export default class Layout extends PureComponent {
  render() {
    console.log(this.props);
    return <div className={css.container}>
      <Header />
      <Button onClick={() => pathTo('/',{w:random()},true)}>点击</Button>
      <div className={css.body}>
        {
          this.props.children
        }
      </div>
    </div>
  }
}
