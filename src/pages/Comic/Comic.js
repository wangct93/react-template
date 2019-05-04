import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button,Rate,Icon,Radio} from 'antd';
import util, {reactUtil,arrayUtil} from 'wangct-util';

import {Header,Text,Swiper,ComicItem,FlexLines,Comment} from '@lib/index';
import {queryComic} from '../../services/api';
import {getEllipseText} from '../../utils/util';

import css from './Comic.less';

const {getProps} = reactUtil;
const dispatch = reactUtil.getDispatch('comic');
const history = reactUtil.getHistory();

@connect(({comic}) => ({
  data:comic.data
}))
export default class Comic extends PureComponent {
  state = {
  };

  componentDidMount() {
    this.loadData()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.getComicId(prevProps) !== this.getComicId()){
      this.loadData()
    }
  }

  getComicId(props = this.props){
    return props.match.params.id;
  }

  loadData(){
    dispatch({
      type:'loadData',
      id:this.getComicId()
    });
  }

  render() {
    const {state,props} = this;
    const {data = {}} = props;
    return <div className={css.container}>
      <Header />
      <BannerBg bgSrc={data.cover} />
      <div className="fixed-width">
        <ComicInfo data={data} />
        <div className={css.content}>
          <div className={css.left}>
            <ChapterView />
            <CorrelativeBox />
            <Comment id={this.getComicId()} />
          </div>
          <div className={css.right}>
            <AuthorInfo />
            <OtherWorksView />
            <HotBox />
            <NewlyBox />
          </div>
        </div>
      </div>
    </div>
  }
}


class BannerBg extends PureComponent{
  state = {

  };

  render(){
    return <div className={css.banner_box}>
      <img src={this.props.bgSrc} className={css.banner_bg_img} />
      <div className={css.banner_bg_color} />
    </div>
  }
}


class ComicInfo extends PureComponent{
  state = {

  };

  render(){
    const {data = {}} = this.props;
    const {label = []} = data;
    return <div className={css.info_box}>
      <div className="img-box">
        <img src={data.cover} />
      </div>
      <div className={css.info_right}>
        <div className={css.info_line}>
          <span className={util.classNames(css.text_title,'wct-flex')}>{data.name}</span>
          <span className={css.text_score}>{data.score}分</span>
          <Rate value={data.score} disabled />
        </div>
        <div className={css.info_line}><span className={css.info_label}>作者：</span>{data.author}</div>
        <div className={css.info_line}>
          <span className={css.info_column}><span className={css.info_label}>状态：</span>{data.status === 1 ? '完结' : '连载中'}</span>
          <span className={css.info_column}><span className={css.info_label}>类型：</span>{label.join('，')}</span>
        </div>
        <div className={css.text_intro}>{getEllipseText(data.intro)}</div>
        <div className={css.info_line}>
          <Button icon="user">收藏</Button>
          <Button icon="user" type="primary" onClick={toChapter.bind(this,data.list && data.list[0])}>开始阅读</Button>
        </div>
      </div>
    </div>
  }
}

@connect(({comic}) => ({
  list:comic.data.list
}))
class ChapterView extends PureComponent{
  state = {
    mode:'lian',
  };

  getList(mode = this.state.mode){
    const {list = []} = this.props;
    return list.filter(item => item.type === mode);
  }

  modeChange = (mode) => {
    this.setState({
      mode
    })
  };

  render(){
    const {mode} = this.state;
    return <div className={css.chapter_view}>
      <div className="flex-parent">
        <div className={css.chapter_tabs}>
          <span onClick={this.modeChange.bind(this,'lian')} className={util.classNames('text-click',mode === 'lian' ? 'active' : '')}>连载 （{this.getList('lian').length}）</span>
          <span className={css.tabs_sep} />
          <span onClick={this.modeChange.bind(this,'fan')} className={util.classNames('text-click',mode === 'fan' ? 'active' : '')}>番外 （{this.getList('fan').length}）</span>
        </div>
      </div>
      <ChapterList list={this.getList()} />
    </div>
  }
}


class ChapterList extends PureComponent{
  state = {

  };

  render(){
    const {list = []} = this.props;
    return <div className={css.chapter_list}>
      <FlexLines limit={3}>
        {
          list.map((item,index) => {
            return <div key={item.id} className={css.chapter_item} onClick={toChapter.bind(this,item)}>
              <span className={css.text_name}>{item.name}</span>
              <span className={css.text_intro}>{item.intro}</span>
            </div>
          })
        }
      </FlexLines>
    </div>
  }
}

class ChapterTemp extends PureComponent{
  state = {

  };

  render(){
    const {data = {}} = this.props;
    return <div className={css.chapter}>
      <div className="img-box">
        <img src={data.src} />
      </div>
      <div className={css.info}>
        <p className={css.text_title}>{data.name} （{data.size}）</p>
        <p className={css.text_time}>{data.time}</p>
      </div>
    </div>
  }
}


class AuthorInfo extends PureComponent{
  state = {
    info:{
      avatar:'http://css99tel.cdndm5.com/v201904041843/blue/images/header-partner.png',
      count:9,
      name:'掌阅iCiyuan'
    }
  };

  render(){
    const {info = {}} = this.state;
    return <div className={css.author_box}>
      <img className={css.avatar} src={info.avatar} />
      <p className={css.text_title}>{info.name}</p>
      <p className={css.text_tips}>作品数：<span className={css.text_strong}>{info.count}</span></p>
      <img className={css.author_level} src="http://css99tel.cdndm5.com/v201904041843/blue/images/sd/detail-logo-1.png" />
    </div>
  }
}


class OtherWorksView extends PureComponent{
  state = {
    list:[
      {
        src:'http://mhfm2tel.cdndm5.com/36/35205/20180801173719_130x174_11.jpg',
        name:'1龙符之王道天下',
        intro:'问这苍茫大地谁主沉浮？'
      },
      {
        src:'http://mhfm9tel.cdndm5.com/45/44073/20180810105535_130x174_13.jpg',
        name:'2娇妻太甜，帝少宠上天',
        intro:'他对她的宠无人能及'
      },
      {
        src:'http://mhfm5tel.cdndm5.com/45/44074/20180810105329_130x174_12.jpg',
        name:'3娇妻太甜，帝少宠上天',
        intro:'他对她的宠无人能及'
      }
    ]
  };

  swiperRenderItem(item){
    return <div className={css.swiper_item}>
      <img src={item.src} />
      <p className={css.text_title}>{item.name}</p>
      <p className={css.text_intro}>{item.intro}</p>
    </div>
  }

  render(){
    const {state} = this;
    return <div className={css.other_box}>
      <div className={css.right_title}>
        <span className={css.text_title}>其他作品</span>
        <span className={css.text_more}>更多<Icon type="right" /></span>
      </div>
      <div className={css.other_content}>
        <Swiper list={state.list} renderItem={this.swiperRenderItem} />
        <Button icon="user">收藏</Button>
      </div>
    </div>
  }
}


class HotBox extends PureComponent{
  state = {
    list:new Array(14).fill().map(() => ({
      name:'贤者之孙',
      src:'http://mhfm5tel.cdndm5.com/23/22750/20181116214542_130x174_13.jpg',
      intro:'贤者之孙漫画 ，在死人堆里',
      score:4
    }))
  };

  render(){
    const {state} = this;
    return <div className={css.hot_box}>
      <div className={css.right_title}>
        <span className={css.text_title}>热门漫画</span>
        <Radio.Group size="small" defaultValue="周" buttonStyle="solid">
          <Radio.Button value="周">周</Radio.Button>
          <Radio.Button value="月">月</Radio.Button>
        </Radio.Group>
      </div>
      <div className={css.hot_list}>
        {
          state.list.map((item,index) => {
            return <HotItem data={item} key={index} />
          })
        }
      </div>
    </div>
  }
}

class HotItem extends PureComponent{
  state = {

  };

  render(){
    const {data = {}} = this.props;
    return <div className={css.hot_item}>
      <img src={data.src} />
      <div className={css.info}>
        <p className={util.classNames(css.text_title,'text-click')}>{data.name}</p>
        <p className={css.text_intro}>{data.intro}</p>
        <div className={css.text_score}>评分：<Rate value={data.score} disabled /></div>
      </div>
    </div>
  }
}


class NewlyBox extends PureComponent{
  state = {
    list:new Array(14).fill().map(() => ({
      name:'贤者之孙',
      src:'http://mhfm5tel.cdndm5.com/23/22750/20181116214542_130x174_13.jpg',
      intro:'贤者之孙漫画 ，在死人堆里',
      score:4
    }))
  };

  render(){
    const {state} = this;
    return <div className={css.hot_box}>
      <div className={css.right_title}>
        <span className={css.text_title}>最近更新</span>
      </div>
      <div className={css.hot_list}>
        {
          state.list.map((item,index) => {
            return <HotItem data={item} key={index} />
          })
        }
      </div>
    </div>
  }
}

@connect(({comic}) => ({
  data:comic.data,
  list:comic.correlativeList
}))
class CorrelativeBox extends PureComponent{
  state = {

  };

  render(){
    const {data = {}} = this.props;
    return <div className={css.correlative_box}>
      <div className={css.text_title}>看过《{data.name}》的人还看过</div>
      <FlexLines limit={5}>
        {
          this.props.list.map((item,index) => {
            return <ComicItem key={index} data={item} />
          })
        }
      </FlexLines>
    </div>
  }
}

function toChapter(item){
  item && history.push('/chapter/' + item.id);
}
