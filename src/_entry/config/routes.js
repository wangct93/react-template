import React from 'react';import Async from 'wangct-react/lib/Async';
export default [{path:'/',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Layout')} />,
children:[{path:'/newProject',
component:(props) => <Async {...props} getComponent={() => import('../../pages/NewProject')} />},
{path:'/newBranch',
component:(props) => <Async {...props} getComponent={() => import('../../pages/NewBranch')} />},
{path:'/project/:id',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Project')} />},
{path:'/branch/:id',
component:(props) => <Async {...props} getComponent={() => import('../../pages/Branch')} />},
{path:'/',
component:(props) => <Async {...props} getComponent={() => import('../../pages/ProjectList')} />}]}]