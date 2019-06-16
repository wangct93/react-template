import React, {PureComponent} from 'react';
import {Provider} from "react-redux";
import {LocaleProvider} from 'antd';
import ZHCN from 'antd/lib/locale-provider/zh_CN';
import store from './store';
import Router from './router';


export default class APP extends PureComponent {
  render() {
    return <Provider store={store}>
      <LocaleProvider locale={ZHCN}>
        <Router />
      </LocaleProvider>

    </Provider>
  }
}
