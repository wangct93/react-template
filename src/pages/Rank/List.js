import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button,Rate,Icon,Radio,Pagination} from 'antd';
import util, {reactUtil} from 'wangct-util';

import {Header,Text,Swiper,ComicItem,FlexLines,PageTool} from '@lib/index';

import css from './List.less';

const {getProps} = reactUtil;
const dispatch = reactUtil.getDispatch('list');
const history = reactUtil.getHistory();


export default class RankPage extends PureComponent{
  state = {
    list:new Array(25).fill().map(() => ({
      name:'花梨步',
      src:'http://mhfm3tel.cdndm5.com/49/48968/20190327212937_480x369_51.jpg',
      updateTime:'15分钟前更新',
      newly:'第2话',
      intro:'大学毕业却找不到工作，即将沦为社会乐色的重度妹控市井花...',
      author:'柳原望'
    }))
  };

  render(){
    return <div className={css.container}>
      <PageTool />
      <Header />
      <div className={css.body}>
        <div className="fixed-width">
          <FilterBox />
          <div className={css.list_header}>
            <Pagination />
          </div>
          <ListView list={this.state.list} />
          <div className={css.list_footer}>
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  }
}

@connect(({list}) => ({
  value:list.filterValue
}))
class FilterBox extends PureComponent{
  state = {
    list:[
      {
        name:'题材',
        field:'type',
        type:'border',
        options:[
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
            text:'百合'
          },
          {
            text:'彩虹'
          },
          {
            text:'冒险'
          },
          {
            text:'后宫'
          },
          {
            text:'科幻'
          },
          {
            text:'战争'
          },
          {
            text:'悬疑'
          },
          {
            text:'推理'
          },
          {
            text:'搞笑'
          },
          {
            text:'奇幻'
          },
          {
            text:'恐怖'
          },
          {
            text:'神鬼'
          },
          {
            text:'历史'
          },
          {
            text:'同人'
          },
          {
            text:'绅士'
          },
          {
            text:'机甲'
          }
        ]
      },
      {
        name:'地区',
        field:'area',
        options:[
          {
            text:'港台'
          },
          {
            text:'日韩'
          },
          {
            text:'大陆'
          },
          {
            text:'欧美'
          }
        ]
      },
      {
        name:'状态',
        field:'status',
        options:[
          {
            text:'连载'
          },
          {
            text:'完结'
          }
        ]
      },
      {
        name:'受众',
        field:'label',
        options:[
          {
            text:'少年向'
          },
          {
            text:'少女向'
          },
          {
            text:'青年向'
          }
        ]
      },
      {
        name:'收费',
        field:'charge',
        options:[
          {
            text:'免费'
          },
          {
            text:'付费'
          },
          {
            text:'VIP免费'
          }
        ]
      },
      {
        name:'字母',
        field:'letter',
        options:new Array(26).fill().map((item,index) => {
          return {
            text:String.fromCharCode(65 + index)
          }
        }).concat({
          text:'0-9'
        })
      }
    ],
    isOpen:true
  };

  componentDidMount() {
    this.initElemHeight();
  }

  initElemHeight(){
    this.collapseElem.style.height = this.getContentHeight() + 'px';
  }

  openChange = () => {
    this.setState({
      isOpen:!this.state.isOpen
    })
  };

  getValue(){
    return getProps(this).value || {}
  }

  getContentHeight(){
    const elem = this.collapseElem;
    const {isOpen} = this.state;
    return isOpen ? elem.children[0].offsetHeight : elem.children[0].children[0].offsetHeight + 20
  }

  getCollapseBoxStyle(){
    const elem = this.collapseElem;
    if(!elem){
      return {};
    }
    return {
      height:this.getContentHeight()
    }
  };

  render(){
    const {isOpen} = this.state;
    const value = this.getValue();
    return <div className={css.filter_box}>
      <div className={css.collapse_box} ref={t => this.collapseElem = t} style={this.getCollapseBoxStyle()}>
        <div className={css.filter_content}>
          {
            this.state.list.map(item => {
              return <FilterItem value={value[item.field]} data={item} key={item.name} />
            })
          }
        </div>
      </div>
      <div className={css.filter_bottom} onClick={this.openChange}>{isOpen ? '收起' : '展开'}选项<Icon type={isOpen ? 'up' : 'down'} /></div>
    </div>
  }
}

class FilterItem extends PureComponent{
  state = {

  };

  getData(){
    return this.props.data || {};
  }

  change = (value) => {
    const data = this.getData();
    dispatch({
      type:'updateFilter',
      field:data.field,
      data:value
    })
  };

  render(){
    const data = this.getData();
    const props = getProps(this);
    return <div className={util.classNames(css.filter_item,data.type === 'border' && css.filter_item_border)}>
      <div className={css.filter_label}>{data.name}：</div>
      <div className={css.filter_value}>
        <FilterSelect value={props.value} onChange={this.change} options={data.options} />
      </div>
    </div>
  }
}

class FilterSelect extends PureComponent{
  state = {

  };

  getOptions(){
    const {options = []} = this.props;
    return [{text:'全部'}].concat(options);
  }

  onChange = (data) => {
    util.callFunc(this.props.onChange,data.text);
  };

  render(){
    const {value} = this.props;
    return <div className={css.filter_select}>
      {
        this.getOptions().map(item => {
          const checked = util.isUndefined(value) ? item.text === '全部' : item.text === value;
          return <span className={util.classNames(css.filter_select_item,checked && 'active')} key={item.text} onClick={this.onChange.bind(this,item)}>{item.text}</span>
        })
      }
    </div>
  }
}

class ListView extends PureComponent{
  state = {

  };

  getList(){
    return this.props.list || [];
  }

  render(){
    return <div className={css.list_view}>
      <FlexLines limit={7}>
        {
          this.getList().map((item,index) => {
            return <ComicItem data={item} key={index} />
          })
        }
      </FlexLines>
    </div>
  }
}
