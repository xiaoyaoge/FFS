<template>
    <div class="h100s">
        <nav class="bk-horz-nav bk-horz-nav-min">
            <div class="bk-nav-logo fl">
                <!-- <img src="https://magicbox.bkclouds.cc/static_api/v3/components_pro/horizontal_nav1/images/logo.png"> -->
                {{sysName}}
            </div>
            <div class="bk-nav-user fr"> 
                <el-dropdown class="bk-nav-user fr" trigger="hover">
                    <span class="el-dropdown-link userinfo-inner mr5"> {{sysUserName}}</span> 
                    <img src="https://magicbox.bkclouds.cc/static_api/v3/components_pro/horizontal_nav1/images/avatar.png">
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </nav> 
        <div class="bk-layout bk-layout-has-sidebar" style="height:calc(100% - 60px)">
            <div class="bk-sidebar" :class="collapsed?'slide-close':'slide-open'">
                <div class="slide-switch" @click="collapse">
                    <i class="icon bk-icon icon-dedent f14"></i>
                </div>
                <div class="nav-list">
                    <ul>
                        <li class="pureLink" :class="$route.path ==='/users'? 'open': ''">
                            <a href="#/users" :class="sysUserAvatar!==99?'none':''">
                                <span class="icon-box"><i class="bk-icon icon-user"></i></span>
                                <span class="nav-name">人员管理</span>
                            </a>
                        </li>
                        <li class="pureLink" :class="($route.path ==='/orderConten'||$route.path.indexOf('/orderInfo')>-1)? 'open': ''">
                            <a href="#/orderConten">
                                <span class="icon-box"><i class="bk-icon icon-order"></i></span>
                                <span class="nav-name">用户订单</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="copyright">
                    <p>Copyright &copy; 2012-2017 目目学院.</p>
                    <span>All Rights Reserved.</span>
                </div>
            </div>
            <div class="page-content">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>
<script>
import '../style/css/bootstrap.min.css';
import '../style/css/bk.css';
import '../style/css/bk_pro.css';
import '../style/css/iconfont.css';
import '../style/css/common.css';
export default {
    data() {
            return {
                sysName: '目目学院客户管理系统',
                collapsed: false,
                sysUserName: '',
                sysUserAvatar: '',
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                }
            }
        },
        methods: {
            collapse: function() { //折叠导航栏
                this.collapsed = !this.collapsed;
            },
            pureLink: function() { //折叠导航栏
                //this.collapsed = !this.collapsed; 
            },
            onSubmit() {
                console.log('submit!');
            },
            handleopen() {
                //console.log('handleopen');
            },
            handleclose() {
                //console.log('handleclose');
            },
            handleselect: function(a, b) {},
            //退出登录
            logout: function() {
                var _this = this;
                // this.$confirm('确认退出吗?', '提示', {
                //     //type: 'warning'
                // }).then(() => {
                    sessionStorage.removeItem('user');
                    _this.$router.push('/login');
                // }).catch(() => {

                // }); 
            },
            //折叠导航栏
            collapse: function() {
                this.collapsed = !this.collapsed;
            },
            showMenu(i, status) {
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
            }
        },
        mounted() {
            var user = sessionStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.sysUserName = user.name || '';
                this.sysUserAvatar = user.role || '';
                if (this.sysUserAvatar !== 99) {
                    this.$router.push('/orderConten');
                }
            }

        }
}
</script>
