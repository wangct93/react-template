import {history,dispatch} from 'wangct-react-entry';
import {objectUtil, random} from 'wangct-util';

export default {
  namespace: 'global',
  state: {
    ...getPathData(history.location),
  },

  effects: {

  },

  reducers: {
    updateField(state,{field,data,parentField}){
      let extState = field === 'multiple' ? data : {[field]:data};
      if(parentField){
        extState = {
          [parentField]:{
            ...state[parentField],
            ...extState,
          },
        };
      }
      return {
        ...state,
        ...extState
      }
    },
  },
  subscriptions: {
    addWatch() {
      addPathnameWatch();
      addResizeWatch();
    }
  },
};


function addPathnameWatch(){
  history.listen((location) => {
    dispatch({
      type:'updateField',
      field:'multiple',
      data:getPathData(location),
    });
  });
}

function getPathData(location){
  return objectUtil.clone(location,['search','hash','pathname']);
}

function addResizeWatch(){
  window.addEventListener('resize',() => {
    dispatch({
      type:'updateField',
      field:'resizeSign',
      data:random(),
    });
  })
}
