import {updateUserInfo} from "../utils/util";

/**
 * 用户state
 */
export default {
  namespace: 'user',
  state: {
    // authMap:{
    //   [auths.menuSearch]:true,
    //   [auths.menuCreate]:true,
    //   [auths.menuUpdate]:true,
    //   [auths.menuDelete]:true,
    //   [auths.menuSearch]:true,
    //   [auths.menuCreate]:true,
    //   [auths.menuUpdate]:true,
    //   [auths.menuDelete]:true,
    // }
    // userInfo:{
    //   user_id:1,
    // },
    bookshelfMap:{},
    authMap:null,
  },

  effects: {

  },

  reducers: {
  },
  subscriptions: {
    updateUserInfo,
  },
};
