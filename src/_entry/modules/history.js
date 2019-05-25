import {createBrowserHistory,createHashHistory} from 'history';
import {reactUtil} from 'wangct-util';
import config from '../config/config';
const history = config.history === 'hash' ?  createHashHistory() : createBrowserHistory();
reactUtil.setHistory(history);
export default history;