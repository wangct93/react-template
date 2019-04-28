import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button} from 'antd';
import util, {reactUtil} from 'wangct-util';
import NormalSrc from '../../assets/image/blank_img.png';

const {getProps} = reactUtil;
const dispatch = reactUtil.getDispatch('global');
const history = reactUtil.getHistory();



const addToQueue = (function addToQueue(){
  const list = [];
  const queue = util.queue({
    list,
    func(item,cb){
      item.load(cb);
    },
    limit:5
  });
  return function(item){
    if(!list.includes(item)){
      list.push(item);
      queue.start();
    }
  }
})();



export default class Img extends PureComponent {
  state = {
    alt:'图片加载失败',
    src:NormalSrc
  };

  componentDidMount() {
    addToQueue(this);
  }

  componentWillUnmount() {
    this.isUnmount = true;
    this.next();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.src !== this.props.src){
      addToQueue(this);
    }
  }

  getProps(){
    return getProps(this)
  }

  load(cb){
    if(this.isUnmount){
      cb();
    }else{
      this.loadFunc = cb;
      const {src = NormalSrc} = this.props;
      if(src === this.state.src){
        this.next();
      }else{
        this.setState({
          src
        })
      }
    }
  }

  next(){
    util.callFunc(this.loadFunc);
    this.loadFunc = null;
  }

  onLoad = () => {
    this.next();
  };

  onError = () => {
    this.next();
  };

  render() {
    return <img {...this.getProps()} src={this.state.src} onLoad={this.onLoad} onError={this.onError} />
  }
}
