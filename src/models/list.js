import util,{stringUtil,reactUtil} from 'wangct-util';
import {queryComicList} from "../services/api";

export default {
  namespace: 'list',
  state: {
    filterValue:{},
    pageOption:{
      num:1,
      size:70
    },
    total:10,
    list:[]
  },

  effects: {
    getList,
    updateFilter,
    pageChange,
    initFilter
  },

  reducers: {
    updateField(state,{field,data}){
      const extState = field === 'multiple' ? data : {[field]:data};
      return {
        ...state,
        ...extState
      }
    },
    updateFilterValue(state,{field,data}){
      const extState = field === 'multiple' ? data : {[field]:data};
      const value = {
        ...state.filterValue,
        ...extState
      };
      return {
        ...state,
        filterValue:value
      }
    }
  }
};

function updateUrl(params){
  window.history.pushState(null,null,window.location.pathname + '?' + util.getQsString(params,util.getQsParams()))
}


function* getList(action,{call,put,select}) {
  const {filterValue:values,pageOption:{num,size}} = yield select(({list}) => list);
  util.scroll(0);
  yield put({
    type:'updateField',
    field:'multiple',
    data:{
      loading:true,
      list:[]
    }
  });

  const result = yield call(queryComicList,{
    start:(num - 1) * size,
    limit:size,
    status:values.status,
    type:values.type
  });
  yield put({
    type:'updateField',
    field:'multiple',
    data:{
      ...result.data,
      loading:false
    }
  });
}

function* updateFilter(action,{call,put,select}){
  yield put({
    ...action,
    type:'updateFilterValue'
  });
  const pageOption = yield select(({list}) => list.pageOption);
  yield put({
    type:'updateField',
    field:'pageOption',
    data:{
      ...pageOption,
      num:1
    }
  });
  yield put({
    type:'getList'
  });
}

function* pageChange(action,{call,put,select}){
  yield put({
    type:'updateField',
    field:'pageOption',
    data:action.data
  });
  updateUrl({
    p:action.data.num
  });
  yield put({
    type:'getList'
  });
}

function* initFilter({data},{call,put,select}){
  const state = yield select(({list}) => list);

  yield put({
    type:'updateField',
    field:'multiple',
    data:{
      filterValue:{
        ...state.filterValue,
        ...data,
        pageNum:undefined
      },
      pageOption:{
        ...state.pageOption,
        num:data.pageNum
      }
    }
  });
  yield put({
    type:'getList'
  });
}
