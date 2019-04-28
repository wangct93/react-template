/**
 * Created by wangct on 2019/3/24.
 */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import util, {reactUtil,arrayUtil,objectUtil} from 'wangct-util';
import {Input,Button,Pagination,Modal} from 'antd';
import Text from '@lib/Text';
import css from './index.less';
import {queryCommentList,submitComment} from '../../services/api';

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

  queryList = () => {
    this.setState({
      loading:true
    });
    const params = this.getParams();
    queryCommentList(params).then(({data = {}}) => {
      const {total,list:queryList} = data;
      const {list} = getProps(this);
      queryList.forEach((item,i) => {
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
      parent:props.id
    }
  }

  pageChange = (pageNum,pageSize) => {
    this.setState({
      pageNum,
      pageSize
    },() => {
      this.checkList();
    })
  };

  render() {
    const props = getProps(this);
    return <div className={css.container}>
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
        <MyInput />
        <ul className={css.comment_list}>
          {
            this.getList().map(item => {
              return <li key={item.id}>
                <Item queryList={this.queryList} mode={props.mode} data={item}/>
              </li>
            })
          }
        </ul>
        <MyInput />
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
    // showReply:true,
    // showInput:true
  };

  inputChange = (e) => {
      this.setState({
        message:e.target.value
      })
  };

  submit = () => {
    const {message,data,userInfo} = getProps(this);
    if(userInfo){
      const isReply = this.isReply();
      submitComment({
        parent:isReply ? data.parent : data.id,
        to:isReply ? data.id : undefined,
        content:message,
        type:'reply',
        toUserId:data.userId
      }).then(json => {
        if(json.success){
          Modal.success({
            title:'成功提示',
            content:'提交成功！'
          });
          this.setState({
            showInput:false,
            message:''
          });
          if(isReply){
            util.callFunc(this.props.queryList);
          }else if(this.childTarget){
            util.callFunc(this.childTarget.queryList);
          }
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

  showReply = () => {
    this.setState({
      showReply:!getProps(this).showReply
    });
  };

  showInput = () => {
    this.setState({
      showInput:!getProps(this).showInput
    });
  };


  isReply(){
    return getProps(this).mode === 'reply';
  }

  imgError = (e) => {
    e.target.src = NORMALUSERCOVER;
  };

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
        <img alt="error" onError={this.imgError} src={data.cover || NORMALUSERCOVER} />
      </div>
      <div className={util.classNames('wct-flex',css.info_box)}>
        <div className={css.title}>
          <span className={css.text_title}>{data.userName}</span>
        </div>
        {
          data.children && <ul className={css.child_list}>123</ul>
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
    this.setState({
      value:e.target.value
    })
  };

  submit = () => {
    const {value} = this.state;
    util.callFunc(this.props.onSubmit,value);
  };

  render(){
    const {state,props} = this;
    return <div className={css.input_wrap}>
      <div className={css.input_box}>
        <Input.TextArea placeholder={props.placeholder} value={state.value} onChange={this.onChange}/>
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

  };

  submit = (v) => {
    console.log(v)
  };

  render(){
    const {data = {}} = this.props;
    return <div className={util.classNames(css.comment_item,css.my_input_wrap)}>
      <div className="img-box">
        <img alt="error" onError={this.imgError} src={data.cover || NORMALUSERCOVER} />
      </div>
      <div className={util.classNames('wct-flex',css.info_box)}>
        <InputBox onSubmit={this.submit} placeholder="我来说两句..." isComment />
      </div>
    </div>
  }
}
