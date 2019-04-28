/**
 * Created by wangct on 2019/1/1.
 */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Carousel,Input,Icon,Rate,Button} from 'antd';
import util,{reactUtil} from 'wangct-util';
import {Link} from 'wangct-react';
import {FlexLines,Header,ComicItem,Img,AsyncVisual} from '@lib';

import {queryComicList,queryLabelList,queryBannerList,queryRecommendList} from '../../services/api';
import {getEllipseText} from '../../utils/util';

import css from './Home.less';

const dispatch = reactUtil.getDispatch('home');
const history = reactUtil.getHistory();


const {getProps} = reactUtil;
export default class Home extends PureComponent {
  render(){
    return <div className={css.container}>
      <Header />
      <Content />
    </div>
  }
}

class Content extends PureComponent{
  state = {

  };

  render(){
    return <div className={css.content}>
      <div className="fixed-width">
        <TypeList />
        <Banner />
        <YCBox />
        <HotBox />
        <OverBox />
        <TOP50 />
      </div>
    </div>
  }
}

class TypeList extends PureComponent{
  state = {
    list:[]
  };

  componentDidMount() {
    this.loadData();
  }

  loadData(){
    queryLabelList().then(json => {
      this.setState({
        list:json.data.map(item => ({
          text:item,
          path:'/list?type=' + item
        }))
      })
    })
  }

  render(){
    return <div className={css.type_wrap}>
      <ul className={css.type_list}>
        {
          this.state.list.map(item => {
            return <li key={item.path}>
              <Link to={item.path}>{item.text}</Link>
            </li>
          })
        }
      </ul>
      <Link to="/list" className={css.type_right}>
        <Icon type="menu" />
        <span>全部分类</span>
      </Link>
    </div>
  }
}

class Banner extends PureComponent{
  state = {
    list:[]
  };

  loadData = () => {
    queryBannerList().then(json => {
      this.setState({
        list:json.data
      })
    })
  };

  getContent(list){
    return list.map(item => {
      return <div onClick={toComic.bind(this,item)} key={item.id} className="img-box">
        <Img src={item.cover}/>
      </div>
    })
  }

  render(){
    const {list = []} = this.state;
    const len = list.length;
    return <div className={css.banner_box}>
      <AsyncVisual height={380} content={this.loadData} />
      <Carousel className={css.lbt_box}>
        {
          this.getContent(list.slice(0,len - 5))
        }
      </Carousel>
      <div className={css.banner_right}>
        <FlexLines limit={2}>
          {
            this.getContent(list.slice(len - 5,len - 3))
          }
        </FlexLines>
        <FlexLines limit={3}>
          {
            this.getContent(list.slice(len - 3))
          }
        </FlexLines>
      </div>
    </div>
  }
}


class YCBox extends PureComponent{
  state = {
    list:[]
  };

  loadData = () => {
    queryRecommendList().then(json => {
      this.setState({
        list:json.data
      })
    })
  };

  render(){
    return <div className={css.yc_box}>
      <AsyncVisual content={this.loadData} />
      <BoxHeader title="精品推荐" src={'http://css99tel.cdndm5.com/v201904041843/blue/images/sd/index-title-1.png'} />
      <FlexLines limit={3} >
        {
          this.state.list.map((item) => {
            return <YCItem key={item.id} data={item} />
          })
        }
      </FlexLines>
    </div>
  }
}

class YCItem extends PureComponent{
  state = {

  };

  render(){
    const {data = {}} = this.props;
    return <div className={css.yc_item}>
      <div className="img-box">
        <img src={data.cover} />
      </div>
      <div className={css.yc_right}>
        <div className={css.text_title}>
          <span onClick={toComic.bind(this,data)} className="text-click">{data.name}</span>
        </div>
        <div>
          <Rate disabled value={data.score} size={'small'} />
        </div>
        <div className={css.label_box}>
          {
            data.label && data.label.map(item => {
              return <div key={item} className={css.label}>{item}</div>
            })
          }
        </div>
        <div className={css.text_intro}>{getEllipseText(data.intro,50)}</div>
      </div>
    </div>
  }
}

class BoxHeader extends PureComponent{
  state = {
    current:0
  };

  onChange = (data,index) => {
    this.setState({
      current:index
    });
    util.callFunc(this.props.onTabChange,data);
  };

  render(){
    const {props} = this;
    const {tabs = []} = props;
    return <div className={css.box_header}>
      <img src={props.src} />
      <span className={css.text_title}>{props.title}</span>
      <div className={css.box_tabs}>
        {
          tabs.map((item,index) => {
            const {current} = this.state;
            return <a onMouseEnter={this.onChange.bind(this,item,index)} className={util.classNames(css.box_tab,'text-click',current === index && 'active')} key={item.text}>{item.text}</a>
          })
        }
      </div>
      {
        props.moreUrl && <Link to={props.moreUrl} className={util.classNames(css.text_more,'text-click')}>更多<Icon type="right" /></Link>
      }

    </div>
  }
}


class TransformIMG extends PureComponent{
  state = {
    value:0
  };

  onClick = (index) => {
    this.setState({
      value:index
    });
    util.callFunc(this.props.onChange,index);
  };

  render(){
    const {list = []} = this.props;
    const {value} = getProps(this);
    return <div className={css.transform_img_box}>
      {
        list.map((item,index) => {
          const length = list.length;
          let extClassName;
          if((value - 1 + length) % length === index){
            extClassName = css.transform_img_left;
          }else if((value + 1 + length) % length === index){
            extClassName = css.transform_img_right;
          }
          return <a onClick={this.onClick.bind(this,index)} key={index} className={util.classNames(css.transform_img,extClassName)}>
            <img src={item} />
          </a>
        })
      }
    </div>
  }
}


class HotBox extends PureComponent{
  state = {
    tabs:[
      {
        text:'热血'
      },
      {
        text:'恋爱'
      },
      {
        text:'校园'
      },
      {
        text:'奇幻'
      },
      {
        text:'科幻'
      }
    ],
    tabKey:'热血',
    current:0
  };

  loadData = () => {
    const {tabs} = this.state;
    tabs.forEach(item => {
      queryComicList({
        start:0,
        limit:11,
        type:item.text
      }).then(json => {
        this.setState({
          data:{
            ...this.state.data,
            [item.text]:json.data.list
          }
        });
      })
    })
  };

  transformChange = (index) => {
    this.setState({
      current:index
    })
  };

  getList(){
    const {data = {},tabKey} = this.state;
    return data[tabKey] || []
  }

  tabChange = (data) => {
    this.setState({
      tabKey:data.text
    })
  };

  getTransformData(){
    return this.getList().slice(0,3).map(item => item.cover);
  }

  getLeftDetail(){
    return this.getList()[this.state.current];
  }

  render(){
    const {state} = this;
    return <div className={css.hot_box}>
      <AsyncVisual content={this.loadData} />
      <BoxHeader onTabChange={this.tabChange} title="热门分类" tabs={state.tabs} src={'http://css99tel.cdndm5.com/v201904041843/blue/images/sd/index-title-7.png'} moreUrl="/list" />
      <div className={css.hot_content}>
        <div className={css.hot_left}>
          <TransformIMG value={state.current} onChange={this.transformChange} list={this.getTransformData()} />
          <HotLeftItem data={this.getLeftDetail()} />
        </div>
        <div className={css.hot_right}>
          <FlexLines limit={4}>
            {
              this.getList().slice(3,11).map((item) => {
                return <ComicItem data={item} key={item.id} />
              })
            }
          </FlexLines>

        </div>
      </div>
    </div>
  }
}

class HotLeftItem extends PureComponent{
  state = {

  };

  render(){
    const {data = {}} = this.props;
    const {label = []} = data;
    return <div className={css.item}>
      <div className={css.item_title}>
        <span className="text-click">{data.name}</span>
        <div className="wct-flex">
          <Button onClick={toComic.bind(this,data)} type="primary">开始阅读</Button>
        </div>
      </div>
      <p>作者：{data.author}</p>
      <div>评分：<Rate disabled value={data.score} /></div>
      <div className={css.label_box}>
        {
          label.map(item => {
            return <div className={css.label} key={item}>{item}</div>
          })
        }
      </div>
      <p>简介：{getEllipseText(data.intro)}</p>
    </div>
  }
}


class OverBox extends PureComponent {
  state = {
    current: 0,
    list: []
  };

  loadData = () => {
    queryComicList({
      start: 0,
      limit: 11,
      status: 1
    }).then(json => {
      this.setState({
        list: json.data.list
      });
    })
  };

  transformChange = (index) => {
    this.setState({
      current: index
    })
  };

  getList() {
    return this.state.list || []
  }


  getTransformData() {
    return this.getList().slice(0, 3).map(item => item.cover);
  }

  getLeftDetail() {
    return this.getList()[this.state.current];
  }

  render() {
    const {state} = this;
    return <div className={css.hot_box}>
      <AsyncVisual content={this.loadData}/>
      <BoxHeader title="完结佳作" src={'http://css99tel.cdndm5.com/v201904041843/blue/images/sd/index-title-7.png'} moreUrl="/list?status=完结" />
      <div className={css.hot_content}>
        <div className={css.hot_left}>
          <TransformIMG value={state.current} onChange={this.transformChange} list={this.getTransformData()}/>
          <HotLeftItem data={this.getLeftDetail()}/>
        </div>
        <div className={css.hot_right}>
          <FlexLines limit={4}>
            {
              this.getList().slice(3, 11).map((item) => {
                return <ComicItem data={item} key={item.id}/>
              })
            }
          </FlexLines>
        </div>
      </div>
    </div>
  }
}

class TOP50 extends PureComponent{
  state = {
    tabs:[
      {
        text:'人气榜'
      },
      {
        text:'收藏榜'
      }
    ],
    navs:[],
    data:{},
    navKey:'全部漫画'
  };

  loadData = () => {
    queryLabelList().then(json => {
      const navs = json.data.map(item => ({
        text:item,
      })).slice(0,9);
      navs.unshift({
        text:'全部漫画'
      });

      navs.forEach(item => {
        const {text} = item;
        queryComicList({
          start:0,
          limit:50,
          type:text === '全部漫画' ? undefined : text
        }).then(json => {
          this.setState({
            data:{
              ...this.state.data,
              [text]:json.data.list
            }
          })
        })
      });
      this.setState({
        navs
      });
    });
  };

  getList(){
    const {data,navKey} = this.state;
    return data[navKey] || [];
  };

  navChange = (navKey) => {
    this.setState({
      navKey
    })
  };

  render(){
    const {state} = this;
    return <div className={css.top50_box}>
      <AsyncVisual content={this.loadData}/>
      <BoxHeader title="周排行TOP50" tabs={state.tabs} src={'http://css99tel.cdndm5.com/v201904041843/blue/images/sd/index-title-8.png'} moreUrl="/rank" />
      <div className="flex-parent">
        <div className={css.top50_nav}>
          {
            state.navs.map(item => {
              const {text} = item;
              return <div onMouseOver={this.navChange.bind(this,text)} className={util.classNames(css.top50_nav_item,text === state.navKey ? 'active' : '')} key={text}>{text}</div>
            })
          }
        </div>
        <TOP50Content list={this.getList()} />
      </div>
    </div>
  }
}


class TOP50Content extends PureComponent{
  state = {

  };

  render(){
    const {list = []} = this.props;
    return <div className={css.top50_content}>
      {
        list.map((item,index) => {
          return <div className={css.top50_item} key={item.id}>
            <span className={util.classNames(css.rank_order,css['rank_order_' + (index + 1)])}>{index + 1}</span>
            <span onClick={toComic.bind(this,item)} className="text-click" title={item.name}>{item.name}</span>
          </div>
        })
      }
    </div>
  }
}

function toComic(data){
  history.push('/comic/' + data.id);
}


