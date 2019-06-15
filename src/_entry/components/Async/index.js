

import React, {PureComponent} from 'react';

export default class Async extends PureComponent {
    state = {};

    componentDidMount(){
      this.getComponent();
    }

    getComponent(){
      const {getComponent} = this.props;
      if(getComponent){
        getComponent().then(result => {
          this.setState({
            component:result.default ? result.default : result
          })
        })
      }
    }

    getLoadingView(){
      return this.props.loading || <p>loading...</p>
    }

    render() {
      const {component: Com} = this.state;
      return Com ? <Com {...this.props} getComponent={undefined}/> : this.getLoadingView()
    }
}
