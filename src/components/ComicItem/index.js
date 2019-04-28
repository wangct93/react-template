import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Rate,Button} from 'antd';
import util, {reactUtil} from 'wangct-util';
import {Link} from 'wangct-react';
import {Img,Text} from '@lib';
import css from './index.less';
import {getEllipseText} from '../../utils/util';

const {getProps} = reactUtil;
const dispatch = reactUtil.getDispatch('global');
const history = reactUtil.getHistory();

export default class ComicItem extends PureComponent{
  state = {

  };

  toDetail = () => {
    const {data = {},onClick} = this.props;
    if(onClick){
      util.callFunc(onClick,data);
    }else{
      history.push('/comic/' + data.id);
    }
  };

  render(){
    const {data = {}} = this.props;
    return <div className={css.comic_item}>
      <div className="img-box">
        <Img src={data.cover} />
      </div>
      <div className={css.text_name}>{data.name}</div>
      <div className={css.ext_info}>
        <Text icon="user">{data.author}</Text>
      </div>
      <div className={css.hover_item}>
        <div className="img-box" onClick={this.toDetail}>
          <Img src={data.cover} />
        </div>
        <div className={css.newly_bottom}>
          <div className={css.line_name}>
            <div className={css.text_name}>
              <span className="text-click" onClick={this.toDetail}>{data.name}</span>
            </div>
            <Rate value={data.score} disabled />
          </div>
          <div className={css.text_author}>作者：{data.author}</div>
          <div className={css.text_intro}>
            <span title={data.intro}>{getEllipseText(data.intro,30)}</span>
          </div>
          <Button type="primary" onClick={this.toDetail}>开始阅读</Button>
        </div>
      </div>
    </div>
  }
}
