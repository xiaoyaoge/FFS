import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import UserCenter from './views/user/user-center.vue'
import OrderList from './views/order/order-list.vue'
import OrderInfo from './views/order/order-info.vue'
let routes = [ 
    { path: "/", redirect: "/home" },//重定向
    { path: '/', name: '', component: Login, hidden: true }, // 帐密登录
    { path: '/login', component: Login, name: '', hidden: true }, // 帐密登录
    {
        path: '/',
        component: Home,
        iconCls: '', //图标样式class
        name: '菜单',
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/users', component: UserCenter, name: '人员管理' },
            { path: '/orderConten', component: OrderList, name: '用户订单' }, 
            { path: '/orderInfo/:id', component: OrderInfo, name: '', hidden: true},
            { path: '*', name: '', component: NotFound, hidden: true },
            { path: '/404', component: NotFound, name: '', hidden: true }
        ]
    },
    
];



export default routes;
