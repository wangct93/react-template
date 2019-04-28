import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button,Rate,Icon,Radio,Pagination} from 'antd';
import util, {stringUtil,reactUtil} from 'wangct-util';

import {Header,Text,Swiper,ComicItem,FlexLines,PageTool,Loading} from '@lib/index';

import css from './List.less';
import {queryLabelList} from '../../services/api';

const {getProps} = reactUtil;
const dispatch = reactUtil.getDispatch('list');
const history = reactUtil.getHistory();

@connect(({list}) => ({
  loading:list.loading
}))
export default class ListPage extends PureComponent{
  state = {

  };

  render(){
    const {props} = this;
    return <div className={css.container}>
      <PageTool />
      <Header />
      <div className={css.body}>
        <div className="fixed-width">
          <FilterBox />
          <div className={css.content}>
            {
              props.loading && <Loading />
            }
            <div className={css.list_header}>
              <PaginationBox />
            </div>
            <ListView />
            <div className={css.list_footer}>
              <PaginationBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

@connect(({list}) => ({
  ...list.pageOption,
  total:list.total
}))
class PaginationBox extends PureComponent{
  state = {

  };

  onChange = (num,size) => {
    dispatch({
      type:'pageChange',
      data:{
        num,
        size
      }
    })
  };

  render(){
    const {props} = this;
    return <Pagination onChange={this.onChange} current={props.num} pageSize={props.size} total={props.total} />
  }
}

@connect(({list}) => ({
  value:list.filterValue
}))
class FilterBox extends PureComponent{
  state = {
    list:[
      {
        name:'类型',
        field:'type',
        type:'border',
        options:[],
        promise:new Promise(cb => {
          queryLabelList().then(json => {
            cb(json.data.map(item => ({
              text:item
            })));
          })
        })
      },
      {
        name:'状态',
        field:'status',
        options:[
          {
            text:'连载',
            value:'0'
          },
          {
            text:'完结',
            value:'1'
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
    this.initList();
  }

  initList(){
    const list = this.state.list.filter(item => util.isPromise(item.promise));
    Promise.all(list.map(item => item.promise)).then(result => {
      result.forEach((item,index) => {
        list[index].options = item;
      });
      this.setState({
        list:this.state.list.map(item => ({...item}))
      },() => {
        this.initOption();
      })
    });
  }

  initOption(){
    this.initElemHeight();
    this.initFilterValue();
  }

  initFilterValue(){
    const params = util.getQsParams();
    const {list} = this.state;
    const target = {};
    list.forEach(({field,options}) => {
      const opt = options.find(item => item.text === params[field]);
      if(opt){
        target[field] = opt.value || opt.text;
      }
    });

    dispatch({
      type:'initFilter',
      data:{
        ...target,
        pageNum:parseInt(params.p || 1)
      }
    });
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

  change = (value,{text}) => {
    const {field} = this.getData();
    if(text === '全部'){
      value = undefined;
      text = undefined
    }
    window.history.pushState(null,null,window.location.pathname + '?' + util.getQsString({[field]:text},util.getQsParams()))
    dispatch({
      type:'updateFilter',
      field,
      data:value
    });

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
    util.callFunc(this.props.onChange,this.getItemValue(data),data);
  };

  getItemValue(data){
    return data.value || data.text;
  }

  render(){
    const {value:checkValue} = this.props;
    return <div className={css.filter_select}>
      {
        this.getOptions().map(item => {
          const value = this.getItemValue(item);
          const checked = util.isUndef(checkValue) ? value === '全部' : value === checkValue;
          return <span className={util.classNames(css.filter_select_item,checked && 'active')} key={item.text} onClick={this.onChange.bind(this,item)}>{item.text}</span>
        })
      }
    </div>
  }
}

@connect(({list}) => ({
  list:list.list
}))
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
            return <ComicItem data={item} key={item.id} />
          })
        }
      </FlexLines>
    </div>
  }
}
