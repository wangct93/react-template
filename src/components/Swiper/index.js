import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button,Icon} from 'antd';
import util, {reactUtil} from 'wangct-util';
import $ from 'wangct-dom';
import css from './index.less';

const {getProps} = reactUtil;
const dispatch = reactUtil.getDispatch('global');
const history = reactUtil.getHistory();

const interval = 300;

export default class Swiper extends PureComponent {
  state = {
    current:1,
    animate:true
  };

  componentDidMount() {
    this.move(1,true);
  }

  getList(){
    const {list = []} = this.props;
    return [list[list.length - 1],...list,list[0]];
  }

  getContent(){
    return this.getList().map((item,index) => {
      return <div className={css.item} key={index}>
        {
          util.callFunc(this.props.renderItem,item,index)
        }
      </div>
    })
  }

  toLeft = () => {
    this.move(this.state.current - 1);
  };

  toRight = () => {
    this.move(this.state.current + 1);
  };

  getListElem(){
    const box = this.contentElem;
    return box && box.children[0];
  }

  move(current,isCheck){
    const len = this.getList().length;
    current = (current + len) % len;
    this.setState({
      current,
      animate:!isCheck
    },() => {
      if(!isCheck){
        setTimeout(() => {
          this.check();
        },interval);
      }

    })
  }

  check(){
    const {current} = this.state;
    const len = this.getList().length;
    if(current === 0){
      this.move(len - 2,true);
    }else if(current === len - 1){
      this.move(1,true);
    }
  }

  getLeft(){
    const {current} = this.state;
    const box = this.contentElem || {};
    return -current * (box.offsetWidth || 0)
  }

  render() {
    const {state} = this;
    return <div className={css.container}>
      <Icon type="left" onClick={this.toLeft} />
      <div className={css.content} ref={t => this.contentElem = t}>
        <div className={util.classNames(css.list,state.animate || css.no_transition)} style={{left:this.getLeft() + 'px'}}>
          {
            this.getContent()
          }
        </div>
      </div>
      <Icon type="right" onClick={this.toRight} />
    </div>
  }
}
