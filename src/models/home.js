import {stringUtil,reactUtil} from 'wangct-util';
import {queryComicList} from '../services/api';
export default {
  namespace: 'home',
  state: {
    list:[]
  },

  effects: {

  },

  reducers: {
    updateField(state,{field,data}){
      const extState = field === 'multiple' ? data : {[field]:data};
      return {
        ...state,
        ...extState
      }
    }
  }
};
