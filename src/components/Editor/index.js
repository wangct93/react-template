/**
 * Created by wangct on 2019/3/24.
 */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import util, {reactUtil} from 'wangct-util';
import Editor from 'wangeditor';

import css from './index.less';

const {getProps} = reactUtil;

export default class EditorBox extends PureComponent{
  componentDidMount(){
    this.create();
  }

  create(){
    const editor = new Editor(this.elem);
    editor.customConfig.uploadImgServer = '/file/upload';
    editor.create();
    this.editor = editor;
  }

  getEditor(){
    return this.editor;
  }

  getValue(){
    return this.getEditor().txt.html();
  }

  render(){
    return <div className={css.editor_box} ref={ref => this.elem = ref} />
  }
}
