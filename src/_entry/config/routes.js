import React from 'react';import Async from 'wangct-react/lib/Async';
export default [{path:'/',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Layout')} />}]