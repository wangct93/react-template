import util from 'wangct-util';
import {getUserInfo as getUserInfoFunc} from '../services/api';

export default {
  namespace: 'user',
  state: {
    auths:[]
  },

  effects: {
    getUserInfo
  },
  reducers: {
    updateField(state,{field,data}){
      const extState = field === 'multiple' ? data : {[field]:data};
      return {
        ...state,
        ...extState
      }
    }
  },
  subscriptions: {
    getUserInfo({dispatch}){
      dispatch({
        type:'getUserInfo'
      })
    }
  },
};


function *getUserInfo(action,{put,call}){
  const result = yield call(getUserInfoFunc);
  if(result.success){
    yield put({
      type:'updateField',
      field:'userInfo',
      data:result.data
    })
  }
}
