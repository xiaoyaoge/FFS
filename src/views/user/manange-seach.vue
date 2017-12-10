<template>
    <section>
        <div class="bk-panel mb20">
            <div class="bk-panel-body p25">
                <form class="bk-form" @submit="onSubmit">
                    <div class="row">
                        <!-- 交互说明: 选中条件后给A标签添加类 on -->
                        <div id="time" class="col-md-12 col-lg-12 col-xs-12 mb10">
                            <label class="bk-label pr15" style="width:100px;">提交时间：</label>
                            <el-radio-group v-model="topTime" class="rows">
                                <el-radio-button label="最近七天"></el-radio-button>
                                <el-radio-button label="最近一个月"></el-radio-button>
                                <el-radio-button label="最近半年"></el-radio-button>
                                <el-radio-button label="最近一年"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div id="ferOwen" class="col-md-12 col-lg-12 col-xs-12 mb10">
                            <label class="bk-label pr15" style="width:100px;">订单来源：</label>
                            <el-radio-group v-model="orderSource">
                                <el-radio-button label="全部"></el-radio-button>
                                <el-radio-button label="短信"></el-radio-button>
                                <el-radio-button label="邮件"></el-radio-button>
                                <el-radio-button label="信函"></el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 col-lg-12 col-xs-12">
                            <label class="bk-label pr15" style="width:100px;">查询条件：</label>
                            <div class="bk-form-content" style="margin-left:100px;">
                                <div class="bk-form bk-inline-form bk-form-small">
                                    <div class="bk-form-item is-required">
                                        <div class="bk-form-content">
                                            <input type="text" class="bk-form-input" v-model="keyword" placeholder="请输入手机号或邮件查询" style="width:320px;">
                                        </div>
                                    </div>
                                    <button class="bk-button bk-primary bk-button-small">查询</button>
                                    <!-- <button class="bk-button bk-primary bk-button-small" @click="searchBtn({orderId:orderInfo.orderId})" title="查询">查询</button> -->
                                </div>
                                <!-- 交互说明 ：收起时更改文案为 展开更多查询条件，同时隐藏 more-query-cont -->
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <!-- 主要表格 -->
        <div class="bk-panel bk-demo">
            <div class="bk-panel-header" role="tab">
                <div class="bk-panel-info fl">
                    <div class="panel-title">所有订单</div>
                    <!-- <div class="panel-subtitle">(最高权限)</div> -->
                </div>
                <div class="bk-panel-action fr none">
                    <div class="bk-form bk-inline-form bk-form-small">
                        <div class="bk-form-item is-required">
                            <div class="bk-form-content">
                                <input type="text" class="bk-form-input" placeholder="请输入搜索关键字" style="width:290px;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bk-panel-body p0" v-loading="listLoading">
                <form>
                    <table class="bk-table has-thead-bordered">
                        <thead>
                            <tr>
                                <th>订单号</th>
                                <th>来源名称</th>
                                <th>类别</th>
                                <th>姓名</th>
                                <th>联系电话</th>
                                <!-- <th>律所</th> -->
                                <th style="width:165px">提交时间</th>
                            </tr>
                        </thead>
                        <tbody v-if="table.dataList.length>0">
                            <tr v-for="(item,index) in table.dataList">
                                <td>{{item.orderId}}</td>
                                <td>{{item.platformFullName}}</td>
                                <td>{{templateType(item.orderType)}}</td>
                                <td>{{item.name}}</td>
                                <td>{{mobileView(item.mobile)}}</td>
                                <!-- <td>{{item.lawFirmName}}</td> -->
                                <td>{{dateTime(item.createTime)}}</td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="7" align="center">输入手机号或邮件地址搜索数据</td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                <div class="bk-panel-footer p10">
                    <button v-show="false" class="bk-button bk-default bk-button-small fl" title="下载搜索结果">
                        下载搜索结果
                    </button>
                    <el-pagination v-show="table.total>10" layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="table.pageSize" :total="table.total" style="float:right;">
                    </el-pagination>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import moment from 'moment'
import validate from '../../validate';
export default {
    data() {
        return {
            topTime: '最近七天',
            orderSource: '全部',
            collapsed: true,
            table: {
                dataList: [],
                total: 0,
                pageSize: 10,
                pageNum: 1
            },
            listLoading: false,
            keyword: '',

        }
    },
    methods: {
        dateTime(val) {
            let minute = moment(val).startOf('minute').fromNow();
            return (minute.indexOf('分钟') > -1 || minute.indexOf('秒') > -1) ? moment(val).startOf('minute').fromNow() : moment(val).format('YYYY-MM-DD HH:mm:ss');
        },
        dateTimes(val) {
            return moment(val).format('YYYY年MM月DD日 HH:mm:ss');
        },
        querySource(val) {
            switch (val) {
                case '全部':
                    return '';
                case '短信':
                    return '10';
                case '邮件':
                    return '20';
                case '信函':
                    return '30';
                default:
                    return '';
            }
        },
        queryTime(val) {
            switch (val) {
                case '最近七天':
                    return '7';
                case '最近一个月':
                    return '30';
                case '最近半年':
                    return '180';
                case '最近一年':
                    return '360';
                default:
                    return '';
            }
        },
        templateType(val) {
            switch (val) {
                case 10:
                    return '短信';
                case 20:
                    return '电子信函';
                case 30:
                    return '纸质信函';
                default:
                    return '';
            }
        },
        mobileView(val) {
            //return val;
            return val.replace(/\B(?=(?:\d{4})+$)/g, '-');
        },
        handleCurrentChange(val) {
            this.table.pageNum = val;
            this.getDataList();
        },
        onSubmit() {
            let params = {};
            params = {
                pageSize: this.table.pageSize,
                pageNum: this.table.pageNum,
                //idCard: '',
                orderType: this.querySource(this.orderSource),
                days: this.queryTime(this.topTime),
            }
            if (this.keyword) {
                if (validate.checkPhoneNum(this.keyword)) {
                    params.mobile = this.keyword;
                } else {
                    params.email = this.keyword
                }
            } else {
                this.$message({
                    message: '请输入手机号或邮件地址查询',
                    type: 'warning'
                });
                return;
            }

            this.listLoading = true;
            this.$http.ajaxPost({
                url: 'deliveryDetail/queryOrder',
                params: params
            }, (res) => {
                this.$http.aop(res, () => {
                    this.listLoading = false;
                    if (res.body.data) {
                        this.table.total = res.body.data.total;
                        this.table.dataList = res.body.data.orderDeliveryDetailList || [];
                    } else {
                        this.$message({
                            message: '没有找到数据',
                            type: 'warning'
                        });
                    }

                });
            });
        }
    },
    mounted() {
        this.$parent.parentUrlName = "办公管理";
        this.$parent.parentUrls = '/manage';
    }
}
</script>
<style scoped>
</style>