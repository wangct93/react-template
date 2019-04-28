import React, {PureComponent} from 'react';
import util, {reactUtil,arrayUtil,numberUtil} from 'wangct-util';
import './index.less';

const {getProps} = reactUtil;


export default class FlexLines extends PureComponent {
  state = {
    limit:9999
  };

  getList(){
    const allList = arrayUtil.toArray(this.props.children);
    const {limit} = getProps(this);
    const length = Math.ceil(allList.length / numberUtil.toNumber(limit));
    return new Array(length).fill().map((item,index) => {
      const list = allList.slice(index * limit,(index + 1) * limit);
      return list.length < limit && limit !== this.state.limit ? list.concat(new Array(limit - list.length).fill().map((item,index) => {
        return <div className="wct-flex" key={list.length + 1 + index} />
      })) : list;
    });
  }

  render() {
    return <div className="wct-flex-lines">
      {
        this.getList().map((item,index) => {
          return <div className="wct-flex-line" key={index}>{item}</div>
        })
      }
    </div>
  }
}
