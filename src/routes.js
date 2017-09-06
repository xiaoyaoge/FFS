import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import UserCenter from './views/user/user-center.vue'
import OrderList from './views/order/order-list.vue'
import OrderInfo from './views/order/order-info.vue'
import Enterprise from './views/enterprise/enterprise-center.vue'
import EnterInfo from './views/enterprise/enterprise-info.vue'
import EnterMsg from './views/enterprise/enterprise-msg.vue'
import EnterEmail from './views/enterprise/enterprise-email.vue'

let routes = [{
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '订单管理',
        iconCls: 'icon-order', //图标样式class
        leaf: false, //只有一个节点
        hidden: false,
        paths: '/orderConten,/page2,/page3,/orderInfo',
        children: [
            { path: '/msgOder', component: NotFound, name: '短信订单' },
            { path: '/orderConten', component: OrderList, name: '电子信函' },
            { path: '/page2', component: NotFound, name: '纸质信函' },
            { path: '/page3', component: NotFound, name: '专人律师' },
            { path: '/orderInfo/:id', component: NotFound, name: '', hidden: true }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '律所管理',
        iconCls: 'icon-id',
        hidden: false,
        leaf: true, //只有一个节点
        paths: '/page4',
        children: [
            { path: '/page4', component: NotFound, name: '律所管理' }

        ]
    },
    {
        path: '/',
        component: Home,
        name: '企业管理',
        iconCls: 'icon-apps',
        leaf: true, //只有一个节点
        hidden: false,
        paths: '/enterprise,/enterInfo,/enterMsg,/enterEmail',
        children: [
            { path: '/enterprise', component: Enterprise, name: '企业管理' },
            { path: '/enterInfo/:id', component: EnterInfo, name: '短信管理', hidden: true },
            { path: '/enterMsg/:id', component: EnterMsg, name: '短信管理', hidden: true },
            { path: '/enterEmail/:id', component: EnterEmail, name: '短信管理', hidden: true }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '办公管理',
        iconCls: 'icon-empty',
        hidden: false,
        leaf: true, //只有一个节点
        paths: '/manager',
        children: [
            { path: '/manager', component: UserCenter, name: '办公管理' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];



export default routes;