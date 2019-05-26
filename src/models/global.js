import {reactUtil} from 'wangct-util';

export default {
  namespace: 'global',
  state: {
    pathname:window.location.pathname,
    history:reactUtil.getHistory()
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    updateField(state,{field,data}){
      const extState = field === 'multiple' ? data : {[field]:data};
      return {
        ...state,
        ...extState
      }
    },
    loading(state,{message}){
      return {
        ...state,
        loading:message,
      }
    }
  },
  subscriptions: {
    setup({ history,dispatch}) {
      history.listen((match) => {
        dispatch({
          type:'updateField',
          field:'pathname',
          data:match.pathname
        });
      });
    }
  },
};

