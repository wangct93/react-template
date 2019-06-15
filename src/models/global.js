
export default {
  namespace: 'global',
  state: {
  },

  effects: {
    *updateTest({ payload }, { call, put }) {  // eslint-disable-line
      const t = yield put({ type: 'updateField' ,field:'w',data:'wangct'});

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
      dispatch({
        type:'updateField',
        field:'pathname',
        data:window.location.pathname
      });
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

