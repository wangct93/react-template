import Async from 'wangct-react/lib/Async';
export default [{path:'/comic/:id',
component:(props) => <Async {...props} getComponent={() => import('../pages/Comic/Comic')} />},
{path:'/list',
component:(props) => <Async {...props} getComponent={() => import('../pages/List/List')} />},
{path:'/chapter/:id',
component:(props) => <Async {...props} getComponent={() => import('../pages/Chapter/Chapter')} />},
{path:'/',
component:(props) => <Async {...props} getComponent={() => import('../pages/Home/Home')} />}]