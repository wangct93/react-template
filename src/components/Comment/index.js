/**
 * Created by wangct on 2019/3/24.
 */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import util, {reactUtil,arrayUtil,objectUtil} from 'wangct-util';
import {Input,Button,Pagination,Modal} from 'antd';
import {Img,Text} from '@lib';
import css from './index.less';
import {queryList,submit as submitComment} from '../../services/comment';

const {getProps} = reactUtil;
const dispatch = reactUtil.getDispatch('comment');

const NORMALUSERCOVER = '/file/getNormalUserCover';

export default class Comment extends PureComponent {
  state = {
    pageNum:1,
    pageSize:20,
    total:1,
    list:[]
  };

  componentDidMount() {
    this.queryList();
  }

  getStart(){
    const {pageNum,pageSize} = getProps(this);
    return (pageNum - 1) * pageSize;
  }

  getViewLength(){
    const {pageSize,total} = getProps(this);
    return Math.min(pageSize,total - this.getStart());
  }

  getList(){
    const {pageSize,list} = getProps(this);
    const start = this.getStart();
    return list.slice(start,start + pageSize);
  }

  checkList(){
    const {pageSize,list} = getProps(this);
    const start = this.getStart();
    const viewList = list.slice(start,start + pageSize).filter(item => !!item);
    if(viewList.length !== this.getViewLength()){
      this.queryList();
    }
  }

  fitView(){
    if(this.containerElem){
      const scrollElem = document.documentElement;
      scrollElem.scrollTop = scrollElem.scrollTop + this.containerElem.getBoundingClientRect().top - 86;
    }
  }

  queryList = () => {
    this.setState({
      loading:true
    });
    this.fitView();
    const params = this.getParams();
    queryList(params).then(({data = {}}) => {
      const {total,list:result} = data;
      const {list} = getProps(this);
      result.forEach((item,i) => {
        list[params.start + i] = item;
      });
      this.setState({
        total,
        list:[...list],
        loading:false
      })
    });
  }

  getParams(){
    const props = getProps(this);
    const start = this.getStart();
    return {
      start,
      limit:props.pageSize,
      rootId:props.id
    }
  }

  pageChange = (pageNum,pageSize) => {
    this.fitView();
    this.setState({
      pageNum,
      pageSize
    },() => {
      this.checkList();
    })
  };

  doSubmit = (keyword,cb) => {
    submitComment({
      content:keyword,
      rootId:this.props.id,
      type:'comic'
    }).then(json => {
      if(json.success){
        this.queryList();
      }
      util.callFunc(cb,json);
    })
  };

  refresh = () => {
    this.setState({
      pageNum:1
    },() => {
      this.queryList()
    });
  };

  render() {
    const props = getProps(this);
    const {state} = this;
    return <div className={css.container} ref={ref => this.containerElem = ref}>
      <div className={css.header}>
        <div className={css.header_left}>
          <span className={util.classNames(css.tabs_item,'active')}>全部评论</span>
          <span className={css.text_tips}>(共有3506条评论)</span>
          <span className={css.tabs_sep} />
          <span className={css.tabs_item}>最热评论</span>
        </div>
        <Pagination current={props.pageNum} pageSize={props.pageSize} total={props.total} onChange={this.pageChange} />
      </div>
      <div className={css.body}>
        <MyInput submit={this.doSubmit} />
        <ul className={css.comment_list}>
          {
            this.getList().map(item => {
              return <li key={item.id}>
                <Item refresh={this.refresh} rootId={props.id} queryList={this.queryList} mode={props.mode} data={item}/>
              </li>
            })
          }
        </ul>
        {
          state.total ? <MyInput submit={this.doSubmit} /> : ''
        }
      </div>

      <div className={css.footer}>
        <Pagination current={props.pageNum} pageSize={props.pageSize} total={props.total} onChange={this.pageChange} />
      </div>
    </div>
  }
}

@connect(({comment}) => ({activeId:comment.activeId}))
class Item extends PureComponent{
  state = {

  };

  submit = (keyword) => {
    const {data} = getProps(this);
    const {props} = this;
    const userInfo = {id:1};
    if(userInfo){
      submitComment({
        parent:data.parent ? data.parent + ',' + data.id : data.id,
        rootId:props.rootId,
        content:keyword,
        type:'comic',
        toUserId:data.userId
      }).then(json => {
        if(json.success){
          Modal.success({
            title:'成功提示',
            content:'提交成功！'
          });
          this.activeChange();
          util.callFunc(this.props.refresh);
        }else{
          Modal.error({
            title:'失败提示',
            content:json.message || '提交失败！'
          });
        }
      })
    }else{
      reactUtil.getDispatch()({
        type:'global/updateField',
        field:'loginMode',
        data:'login'
      })
    }
  };

  showInput = () => {
    this.setState({
      showInput:!getProps(this).showInput
    });
  };


  isReply(){
    return getProps(this).mode === 'reply';
  }


  isActive(){
    return this.props.activeId === this.getData().id;
  }

  getData(){
    return this.props.data || {};
  }

  activeChange = () => {
    const data = this.getData();
    const isActive = this.isActive();
    dispatch({
      type:'updateField',
      field:'activeId',
      data:isActive ? null : data.id
    });
  };

  render(){
    const {props} = this;
    const {data = {}} = props;
    const isActive = this.isActive();
    return <div className={css.comment_item}>
      <div className="img-box">
        <Img src={data.cover || NORMALUSERCOVER} />
      </div>
      <div className={util.classNames('wct-flex',css.info_box)}>
        <div className={css.title}>
          <span className={css.text_title}>{data.userName}</span>
        </div>
        {
          data.children && <ul className={util.classNames(css.comment_list,css.child_list)}>
            {
              data.children.map(item => {
                return <li key={item.id}>
                  <Item {...props} data={item}/>
                </li>
              })
            }
          </ul>
        }
        <div className={css.text_content}>{data.content}</div>
        <div className={css.bottom}>
          <span className={css.text_time}>{data.time}</span>
          <div className="wct-flex">
            <Text className="text-click" icon="like">赞</Text>
            <Text className="text-click" onClick={this.activeChange} icon="message">{isActive ? '收起' : '回复'}</Text>
          </div>
        </div>
        {
          isActive && <InputBox placeholder={`回复 ${data.userName}`} onSubmit={this.submit} />
        }
      </div>
    </div>
  }
}

class InputBox extends PureComponent{
  state = {
  };

  onChange = (e) => {
    const value = e.target.value;
    this.setState({
      value
    });
    util.callFunc(this.props.onChange,value);
  };

  submit = () => {
    const {value} = this.state;
    util.callFunc(this.props.onSubmit,value);
  };

  getValue(){
    return getProps(this).value
  }

  render(){
    const {state,props} = this;
    return <div className={css.input_wrap}>
      <div className={css.input_box}>
        <Input.TextArea placeholder={props.placeholder} value={this.getValue()} onChange={this.onChange}/>
      </div>
      <div className={css.input_bottom}>
        <span className={css.text_tips}>请您文明上网，理性发言，注意文明用语</span>
        <Button type="primary" onClick={this.submit}>{props.isComment ? '发表评论' : '回复'}</Button>
      </div>
    </div>
  }
}


class MyInput extends PureComponent{
  state = {
    inputValue:''
  };

  submit = (keyword) => {
    util.callFunc(this.props.submit,keyword,(json) => {
      if(json.success){
        this.setState({
          inputValue:''
        })
      }
    })
  };

  inputValueChange = (value) => {
    this.setState({
      inputValue:value
    })
  }

  render(){
    const {props,state} = this;
    const {data = {}} = props;
    return <div className={util.classNames(css.comment_item,css.my_input_wrap)}>
      <div className="img-box">
        <Img src={data.cover || NORMALUSERCOVER} />
      </div>
      <div className={util.classNames('wct-flex',css.info_box)}>
        <InputBox value={state.inputValue} onChange={this.inputValueChange} onSubmit={this.submit} placeholder="我来说两句..." isComment />
      </div>
    </div>
  }
}
