import 'antd/dist/antd.css';
import './less/global.less';
import React from 'react';
import dva from 'dva';
import {Switch,Router,Route,Redirect} from 'dva/router';
import {createBrowserHistory} from 'history';
import models from './temp/model';
import routerConfig from './temp/router';
// 1. Initialize
const app = dva({
  history:createBrowserHistory()
});

// 2. Plugins
// app.use({});

// 3. Model
models.forEach(model => app.model(model));

// 4. Router
app.router(({history}) => <Router history={history}>{getRoutes(routerConfig)}</Router>);

// 5. Start
app.start('#root');


function getRoutes(routes,indexPath){
  return <Switch>
    {
      routes.map(({path:oPath,component:RouteComponent = React.Fragment,children = [],indexPath}) => {
        const path = (oPath.startsWith('/') ? '' : '/') + oPath;
        const props = {
          key:path,
          path
        };
        if(children.length){
          const basePath = path === '/' ? '' : path;
          props.render = props => {
            const option = RouteComponent === React.Fragment ? {} : props;
            return <RouteComponent {...option}>
              {
                getRoutes(children.map(childRoute => ({...childRoute,path:basePath + childRoute.path})),indexPath && basePath + indexPath)
              }
            </RouteComponent>
          }
        }else{
          props.component = RouteComponent;
        }
        return <Route {...props} />
      })
    }
    {
      indexPath ? <Redirect key="redirectRoute" to={indexPath}/> : ''
    }
  </Switch>
}
