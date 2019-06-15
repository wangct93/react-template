import React from 'react';import Async from '../components/Async';
export default [{path:'/',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Test')} />}]