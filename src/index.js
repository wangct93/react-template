import {appStart} from "./frame";
import './styles/global.less';
import {initConfig} from "./utils/util";
import {updateRoutes} from "./json/routes";

initConfig();

appStart().then(() => {
  updateRoutes();
});
