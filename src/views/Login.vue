<template>
    <div class="index-cont">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
            <h1 class="logo"></h1>
            <input type="text" class="bk-form-input" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></input>
            <input type="password" class="bk-form-input" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></input>
            <el-form-item prop="account"></el-form-item>
            <el-form-item prop="checkPass"></el-form-item>
            <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
            <el-form-item style="width:100%;">
                <el-button type="primary" class="button" style="width:100%; margin-top: 0;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
                <!-- <el-button @click.native.prevent="handleReset2">重置</el-button> -->
            </el-form-item>
            <span class="note">忘记密码请联系管理员找回</span>
        </el-form>
    </div>
</template>
<script>
import '../style/index.css'
import {
    requestLogin
} from '../api/index'
export default {
    data() {
            return {
                logining: false,
                ruleForm2: {
                    account: '',
                    checkPass: ''
                },
                rules2: {
                    account: [{
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    }, ],
                    checkPass: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }]
                },
                checked: true
            };
        },
        methods: {
            handleReset2() {
                this.$refs.ruleForm2.resetFields();
            },
            handleSubmit2(ev) {
                var _this = this;
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        var loginParams = {
                            mobile: this.ruleForm2.account,
                            password: this.ruleForm2.checkPass
                        };
                        this.$http.ajaxPost({
                            url: 'login',
                            params: loginParams
                        }, (res) => {
                            this.$http.aop(res, () => {
                                sessionStorage.setItem('user', JSON.stringify(res.body.data)); 
                                this.$router.push({
                                    path: '/users'
                                }); 

                            });

                        });


                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        mounted() {

        }
}
</script>
