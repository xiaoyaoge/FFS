<template>
    <section>
        <div class="bk-panel bk-demo">
            <div class="bk-panel-header" role="tab">
                <div class="bk-panel-info fl">
                    <div class="panel-title">管理员</div>
                    <div class="panel-subtitle">({{filters.users}})</div>
                </div>
                <div class="bk-panel-action fr">
                    <button id="addUser" class="bk-button bk-primary bk-button-small" @click="handleAdd" title="新增">新增</button>
                </div>
            </div>
            <div class="bk-panel-body" v-loading="listLoading">
                <table class="bk-table">
                    <thead>
                        <tr>
                            <th style="width:20%;">日期</th>
                            <th>姓名</th>
                            <th>电话</th>
                            <th style="width:270px;">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in dataList">
                            <td>{{dateTime(item.modifyDate)}}</td>
                            <td>{{item.name}}</td>
                            <td>{{item.mobile}}</td>
                            <td>
                                <a class="bk-icon-button bk-warning bk-button-mini" title="修改" @click="handleEdit(index, item)">
                                    <i class="bk-icon icon-edit bk-icon"></i>
                                    <i class="bk-text">修改</i>
                                </a>
                                <a class="bk-icon-button bk-danger bk-button-mini" title="关闭" @click="handleDel(index,item)">
                                    <i class="bk-icon icon-close bk-icon"></i>
                                    <i class="bk-text">删除</i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--列表-->
                <!--工具条-->
                <el-col :span="24" class="toolbar mt20">
                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
                    </el-pagination>
                </el-col>
            </div>
        </div>
        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <div style="width: 90%; margin: 0 auto;">
                    <el-form-item 
                        label="姓名" 
                        prop="name" 
                    >
                        <el-input v-model="editForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item  label="手机号码" prop="mobile"> 
                        <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="editForm.password" placeholder="............................" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" prop="orderType" class="type-class">
                        <el-radio-group v-model="orderType">
                            <el-radio-button label="超级管理员"></el-radio-button>
                            <el-radio-button label="面签员"></el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </el-form>
            <div class="dialog-btns">
                <a class="bk-button bk-primary mr10" @click="editSubmit" title="保存">保存</a>
                <a class="bk-button bk-default" @click="editFormVisible = false" title="取消">取消</a>
            </div>
        </el-dialog>
        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <div style="width: 90%; margin: 0 auto;">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="addForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="mobile">
                        <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="addForm.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" prop="orderType" class="type-class">
                        <el-radio-group v-model="orderType">
                            <el-radio-button label="超级管理员"></el-radio-button>
                            <el-radio-button label="面签员"></el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </el-form>
            <div class="dialog-btns">
                <a class="bk-button bk-primary mr10" @click="addSubmit" title="添加">添加</a>
                <a class="bk-button bk-default" @click="addFormVisible = false" title="取消">取消</a>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import moment from 'moment'
export default {
    data() {
            return {
                filters: {
                    users: '',
                },
                user: {},
                dataList: [],
                total: 0,
                pageSize: 10,
                pageNum: 1,
                listLoading: false,
                sels: [], //列表选中列 
                editFormVisible: false, //编辑界面是否显示 
                editFormRules: {
                    name: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }],
                    mobile: [{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    },{
                        type: 'string', 
                        pattern: /^\d{11}$/,
                        message: '请输入正确的手机号码', 
                        trigger: 'blur,change' 
                    }],
                    password: [{
                        type: 'string', 
                        pattern: /^\w{6,16}$/,
                        message: '请输入6~16密码', 
                        trigger: 'blur,change' 
                    }]
                },
                //编辑界面数据
                editForm: {
                    uid: 0,
                    name: '',
                    mobile: '',
                    password: '',
                    role: 0
                },
                addFormVisible: false, //新增界面是否显示 
                addFormRules: {
                    name: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }],
                    mobile: [{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    },{
                        type: 'string', 
                        pattern: /^\d{11}$/,
                        message: '请输入正确的手机号码', 
                        trigger: 'blur,change' 
                    }],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },{
                        type: 'string', 
                        pattern: /^\w{6,16}$/,
                        message: '请输入6~16密码', 
                        trigger: 'blur,change' 
                    }]
                },
                orderType: '超级管理员',
                addForm: { //新增界面数据 
                    name: '',
                    mobile: '',
                    password: '',
                    role: 1
                }

            }
        },
        methods: {
            dateTime(val) {
                return moment(val).format('YYYY-MM-DD');
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getDataList();
            },
            getUs(fun) {
                this.user = JSON.parse(sessionStorage.getItem('user'));
                this.filters.users = (this.user.role && this.user.role === 99) ? '最高权限' : '面签员';
                fun && fun();
            },
            //获取用户列表
            getDataList() {
                let params = {};
                if (this.user) {
                    params = {
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }
                }
                this.listLoading = true;
                this.$http.ajaxPost({
                    url: 'admin/queryAdminList',
                    params: params
                }, (res) => {
                    this.$http.aop(res, () => {
                        this.total = res.body.data.total;
                        this.dataList = res.body.data.adminList;
                        this.listLoading = false;
                    });
                });
            },
            //删除
            handleDel: function(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    let para = {
                        id: row.uid
                    };
                    this.$http.ajaxPost({
                        url: 'admin/deleteAdmin',
                        params: para
                    }, (res) => {
                        this.$http.aop(res, () => {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getDataList();
                        });
                    });

                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function(index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row); 
                delete(this.editForm['modifyDate']); 
            },
            //显示新增界面
            handleAdd: function() {
                this.addFormVisible = true;
                this.orderType = '超级管理员'
                this.addForm = {
                    name: '',
                    mobile: '',
                    password: '',
                    role: 1
                };
            },
            //编辑
            editSubmit: function() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认要修改当前帐号吗？', '提示', {}).then(() => {
                            let para = Object.assign({}, this.editForm);
                            para.role = ((this.orderType === '超级管理员') ? 99 : 1);
                            this.$http.ajaxPost({
                                url: 'admin/modifyAdmin',
                                params: para
                            }, (res) => {
                                this.$http.aop(res, () => {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.pageNum = 1;
                                    this.getDataList();
                                })
                            }); 
                            this.editFormVisible = false;
                        });
                    }
                });
            },
            //新增
            addSubmit: function() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let para = Object.assign({}, this.addForm);
                            para.role = ((this.orderType === '超级管理员') ? 99 : 1);
                            this.$http.ajaxPost({
                                url: 'admin/createAdmin',
                                params: para
                            }, (res) => {
                                this.$http.aop(res, () => {
                                    this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                    this.pageNum = 1;
                                    this.getDataList();
                                });

                            });
                            this.addFormVisible = false;
                        });
                    }
                });
            }
        },
        mounted() {
            this.getUs(() => {
                if (this.user.role === 99) {
                    this.getDataList();
                } else {
                    this.$router.push({
                        path: '/orderConten'
                    });
                }

            });

        }
}
</script>
<style scoped>
</style>
