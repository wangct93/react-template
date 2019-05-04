import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button,Rate,Icon,Radio} from 'antd';
import util, {reactUtil,arrayUtil} from 'wangct-util';

import {Header,Text,Swiper,ComicItem,FlexLines,Comment,Img} from '@lib/index';
import {queryChapterInfo} from '../../services/api';
import css from './Chapter.less';

export default class Chapter extends PureComponent {
  state = {
    data:{}
  };

  componentDidMount() {
    this.loadData()
  }

  loadData(){
    const id = this.getChapterId();
    queryChapterInfo({id}).then(json => {
      this.setState({
        data:json.data
      })
    })
  };

  getChapterId(){
    return this.props.match.params.id;
  }

  getImgList(){
    return this.state.data.list || []
  }

  render() {
    return <div className={css.container}>
      <ViewList list={this.getImgList()} />
    </div>
  }
}

class ViewList extends PureComponent{
  state = {
  };

  render(){
    return <div className={css.view_list}>
      {
        this.props.list.map(item => {
          return <div key={item} className={css.view_item}>
            <Img src={item} />
          </div>
        })
      }
    </div>
  }
}
