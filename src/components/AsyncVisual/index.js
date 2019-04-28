import React,{PureComponent} from 'react';
import util from 'wangct-util';


export default class AsyncVisual extends PureComponent {
  state = {};

  componentDidMount(){
    this.addScrollEvent();
    this.scrollEvent();
  }

  componentWillUnmount() {
    this.removeScrollEvent();
  }

  componentDidUpdate(prevProps){
    this.checkScrollElem(prevProps);
  }

  checkScrollElem(prevProps){
    if(prevProps.scrollElem !== this.props.scrollElem){
      this.addScrollEvent();
    }
  }

  addScrollEvent(){
    const elem = this.getEventElem();
    if(elem && elem.addEventListener){
      elem.addEventListener('scroll',this.scrollEvent)
    }
  }

  removeScrollEvent(){
    const elem = this.getEventElem();
    if(elem && elem.removeEventListener){
      elem.removeEventListener('scroll',this.scrollEvent)
    }
  }

  scrollEvent = () => {
    const {top,left,right,bottom} = this.container.getBoundingClientRect();
    if(!(right < 0 || bottom < 0 || left > window.innerWidth || top > window.innerHeight)){
      this.loadComponent();
    }
  };

  getEventElem(){
    return this.props.scrollElem || window;
  }

  loadComponent(){
    this.removeScrollEvent()
    const {content} = this.props;
    this.setState({
      content:util.isFunc(content) ? content() : content,
      loaded:true
    });
  }

  render() {
    const {content,loaded} = this.state;
    const {height} = this.props;
    return loaded ? content || null : <div style={{height}} ref={ref => this.container = ref} />
  }
}
