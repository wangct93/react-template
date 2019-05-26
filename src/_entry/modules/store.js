import {createStore} from "redux";
import util, {arrayUtil,reactUtil} from "wangct-util";
import history from './history';
import models from '../config/models';

export default getStore(models);

export function getStore(models){

  const store = createStore((state,action) => {
    const [namespace,funcField] = (action.type || '').split('/');
    const {reducers = {},effects = {}} = models.find(item => item.namespace === namespace) || {};
    const updateState = {};
    if(effects[funcField]){
      const gener = effects[funcField](action,{
        put:put.bind(this,namespace),
        select,
        call
      });
      loopGenerator(gener);
    }

    if(reducers[funcField]){
      updateState[namespace] = reducers[funcField](state[namespace],action);
    }
    return {
      ...state,
      ...updateState
    }
  },arrayUtil.toObject(models,'namespace',item => item.state))


  function put(namespace,action){
    getDispatch(namespace)(action);
    return Promise.resolve(action);
  }

  function select(func){
    return Promise.resolve(func(store.getState()))
  }

  function call(...args){
    const target = args[0];
    if(util.isPromise(target)){
      return target;
    }else if(util.isFunc(target)){
      return target(...args.slice(1));
    }else{
      return Promise.resolve(args);
    }
  }

  models.forEach(({subscriptions,namespace}) => {
    if(subscriptions){
      Object.keys(subscriptions).forEach(key => {
        util.callFunc(subscriptions[key],{
          dispatch:getDispatch(namespace),
          history
        })
      })
    }
  });

  function getDispatch(namespace = 'global'){
    return (action) => {
      store.dispatch({
        ...action,
        type:formatType(action.type,namespace)
      })
    }
  }

  function formatType(type = '',namespace){
    const [typespace,funcField] = type.split('/');
    return funcField ? type : namespace + '/' + typespace
  }

  reactUtil.setDispatch(getDispatch());

  return store;
}



function loopGenerator(gener,params){
  const {value,done} = gener.next(params);
  if(!done){
    if(util.isPromise(value)){
      value.then(data => {
        loopGenerator(gener,data);
      })
    }else{
      loopGenerator(gener,value);
    }
  }
}
