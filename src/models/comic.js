import util,{stringUtil,reactUtil} from 'wangct-util';
import {queryComic,queryCorrelativeList} from "../services/api";

const defaultState = {
  data:{},
  correlativeList:[]
};

export default {
  namespace: 'comic',
  state: defaultState,

  effects: {
    getInfo,
    getCorrelativeList,
    loadData
  },

  reducers: {
    updateField(state,{field,data}){
      const extState = field === 'multiple' ? data : {[field]:data};
      return {
        ...state,
        ...extState
      }
    },
    clear(){
      return defaultState;
    }
  }
};


function* getInfo({comicId},{call,put,select}) {
  yield put({
    type:'updateField',
    field:'loading',
    data:true
  });
  const {data = {}} = yield call(queryComic,{
    id:comicId
  });
  yield put({
    type:'updateField',
    field:'multiple',
    data:{
      data,
      loading:false
    }
  });
}

function* getCorrelativeList({comicId},{call,put,select}) {
  const {data = []} = yield call(queryCorrelativeList,{
    id:comicId
  });
  yield put({
    type:'updateField',
    field:'correlativeList',
    data
  });
}

function* loadData({id},{call,put,select}) {
  document.documentElement.scrollTop = 0;
  yield put({
    type:'clear'
  });
  yield put({
    type:'getInfo',
    comicId:id
  });
  yield put({
    type:'getCorrelativeList',
    comicId:id
  });
}
