<template>
    <section>
        <div class="cont-btns mb15">
            <a class="bk-button bk-default bk-button-small fl" title="返回" @click="$router.push('/enterprise')">
                <span>返回</span>
            </a>
        </div>
        <div class="bk-panel mb20">
            <div class="bk-panel-body p25">
                <form class="bk-form" :model="form" @submit="onSubmit">
                    <div class="row">
                        <!-- 交互说明: 选中条件后给A标签添加类 on -->
                        <div id="time" class="col-md-12 col-lg-12 col-xs-12 mb10">
                            <label class="bk-label pr15" style="width:100px;">提交时间：</label>
                            <el-radio-group v-model="topTime" class="rows">
                                <el-radio-button label="全部"></el-radio-button>
                                <el-radio-button label="最近一小时"></el-radio-button>
                                <el-radio-button label="最近一天"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div id="status" class="col-md-12 col-lg-12 col-xs-12 mb10">
                            <label class="bk-label pr15" style="width:100px;">当前状态：</label>
                            <el-radio-group v-model="orderStateSelect">
                                <el-radio-button label="全部"></el-radio-button>
                                <el-radio-button label="申请中"></el-radio-button>
                                <el-radio-button label="已发送"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div id="ferOwen" class="col-md-12 col-lg-12 col-xs-12">
                            <label class="bk-label pr15" style="width:100px;">订单来源：</label>
                            <el-radio-group v-model="orderSource">
                                <el-radio-button label="全部"></el-radio-button>
                                <el-radio-button label="企业"></el-radio-button>
                                <el-radio-button label="用户"></el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="row more-query-cont mt15">
                        <div class="col-md-4 col-lg-4 col-xs-4">
                            <div class="bk-form-item mb20">
                                <label class="bk-label pr15" style="width:100px;">订单号：</label>
                                <div class="bk-form-content" style="margin-left:100px;">
                                    <input type="text" v-model="form.orderId" class="bk-form-input" placeholder="请输入订单号" style="width:100%;">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-4 col-xs-4">
                            <div class="bk-form-item mb20">
                                <label class="bk-label pr15" style="width:100px;">联系电话：</label>
                                <div class="bk-form-content" style="margin-left:100px;">
                                    <input type="text" v-model="form.telephone" class="bk-form-input" placeholder="请输入联系电话" style="width:100%;">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 col-lg-12 col-xs-12">
                            <div class="bk-form-content" style="margin-left:85px;">
                                <button class="bk-button bk-success">查询</button>
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
                                <th>订单来源</th>
                                <th>联系电话</th>
                                <th>律所</th>
                                <th>当前状态</th>
                                <th>提交时间</th>
                                <th style="width:255px">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in table.dataList">
                                <td>{{item.orderId}}</td>
                                <td>{{sourceText(item.userType)}}</td>
                                <td>{{item.telephone}}</td>
                                <td>{{item.lawFirmName}}</td>
                                <td>{{item.orderState}}<span class="fb bk-text-success">发送成功</span> <span class="fb bk-text-info">申请中</span><span class="fb bk-text-danger">发送失败</span></td>
                                <td>{{dateTime(item.createTime)}}</td>
                                <td>
                                    <a @click="previewInfo(item)" class="bk-text-button">查看详情</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                <div class="bk-panel-footer p10">
                    <button class="bk-button bk-default bk-button-small fl" title="下载搜索结果">
                        下载搜索结果
                    </button>
                    <el-pagination v-show="table.total>10" layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="table.pageSize" :total="table.total" style="float:right;">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog title="订单详情" v-model="previewVisible" :close-on-click-modal="false">
            <div class="modal-body ffs-modal">
                <div class="info">
                    <div class="cont">
                        <h5>下单信息</h5>
                        <form class="bk-form" id="validate_form" method="POST" action="javascript:;">
                            <div class="bk-form-item">
                                <label class="bk-label">订单类型：</label>
                                <div class="bk-form-content">
                                    {{templateType(orderInfo.orderType)}}
                                </div>
                            </div>
                            <div class="bk-form-item mt5">
                                <label class="bk-label">订单来源：</label>
                                <div class="bk-form-content">
                                    {{orderInfo.name}}
                                </div>
                            </div>
                            <div class="bk-form-item mt5">
                                <label class="bk-label">订单单号：</label>
                                <div class="bk-form-content">
                                    {{orderInfo.orderId}}
                                </div>
                            </div>
                            <div class="bk-form-item mt5">
                                <label class="bk-label">下单时间：</label>
                                <div class="bk-form-content">
                                    {{dateTimes(orderInfo.createTime)}}
                                </div>
                            </div>
                            <div class="bk-form-item mt5">
                                <label class="bk-label">联系电话：</label>
                                <div class="bk-form-content">
                                    {{orderInfo.telephone}}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="cont">
                        <h5>业务信息</h5>
                        <form class="bk-form" id="validate_form" method="POST" action="javascript:;">
                            <div class="bk-form-item mt5">
                                <label class="bk-label">律所：</label>
                                <div class="bk-form-content">
                                    {{orderInfo.lawFirmName}}
                                </div>
                            </div>
                            <div class="bk-form-item mt5">
                                <label class="bk-label">模板：</label>
                                <div class="bk-form-content">
                                    {{orderDeliveryInfo.templateName}}
                                </div>
                            </div>
                            <div class="bk-form-item mt5">
                                <label class="bk-label">发送时间：</label>
                                <div class="bk-form-content">
                                    {{dateTimes(orderDeliveryInfo.sendTime)}}
                                </div>
                            </div>
                            <div class="bk-form-item mt5">
                                <label class="bk-label">第三方：</label>
                                <div class="bk-form-content">
                                    {{orderInfo.name}}
                                </div>
                            </div>
                            <div class="bk-form-item mt5">
                                <label class="bk-label">到达时间：</label>
                                <div class="bk-form-content">
                                    <p class="mb0"><span class="fb bk-text-success ml10">发送成功</span>({{orderInfo.succNum}}/{{orderInfo.sendNum}}) {{dateTimes(orderDeliveryInfo.sendTime)}}</p>
                                </div>
                            </div>
                            <div class="bk-form-item mt5">
                                <label class="bk-label">发送明细：</label>
                                <div class="bk-form-content">
                                    <a id="toggle_cont" class="bk-text-button bk-info ml10" title="查看明细">查看明细</a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="detail">
                    <div class="cont-btns">
                        <a id="back_cont" class="bk-button bk-default bk-button-small mb15 fl" title="返回"><span>返回</span></a>
                        <a class="bk-button bk-default bk-button-small mb15 fr" title="批量导入"><span>批量导入</span></a>
                    </div>
                    <div class="bk-panel bk-demo">
                        <div class="bk-panel-header" role="tab">
                            <div class="bk-panel-info fl">
                                <div class="panel-title">短信发送明细</div>
                            </div>
                            <div class="bk-panel-action fr">
                                <div class="bk-form bk-inline-form bk-form-small">
                                    <div class="bk-form-item is-required">
                                        <div class="bk-form-content">
                                            <input type="text" class="bk-form-input" placeholder="请输入关键字" style="width:150px;">
                                        </div>
                                    </div>
                                    <button class="bk-button bk-primary bk-button-small" title="查询">查询</button>
                                </div>
                            </div>
                        </div>
                        <div class="bk-panel-body">
                            <table class="bk-table">
                                <thead>
                                    <tr>
                                        <th>号码</th>
                                        <th>发送状态</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>188-4884-4546</td>
                                        <td>
                                            <span class="fb bk-text-success">发送成功</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>188-4884-4546</td>
                                        <td>
                                            <span class="fb bk-text-danger">发送失败</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>188-4884-4546</td>
                                        <td><span class="send">发送中</span></td>
                                    </tr>
                                    <tr>
                                        <td>188-4884-4546</td>
                                        <td><span class="send">发送中</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="bk-panel-footer"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer ta-c">
                <a class="bk-button bk-primary" @click="previewVisible=false" title="添加">关闭</a>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import moment from 'moment'
export default {
    data() {
        return {
            topTime: '全部',
            orderStateSelect: '全部',
            orderSource: '全部',
            form: {
                uid: '',
                orderId: '', //订单号
                telephone: '', //企业联系电话  
                hours: '', //提交时间
                orderState: '', //当前状态
                orderType: 20, // msg:10,email:20,纸质:30
                userType: 1, //订单来源 企业:1,用户:2
            },
            collapsed: true,
            table: {
                dataList: [],
                total: 0,
                pageSize: 10,
                pageNum: 1
            },
            listLoading: false,
            previewVisible: false,
            orderDeliveryInfo: {},
            orderInfo: {},
        }
    },
    methods: {
        dateTime(val) {
            return moment(val).format('YYYY-MM-DD');
        },
        dateTimes(val) {
            return moment(val).format('YYYY年MM月DD日 hh:mm:ss');
        },
        orderState(val) {
            switch (val) {
                case '全部':
                    return '';
                case '申请中':
                    return '1';
                case '已发送':
                    return '2';
                default:
                    return '未知状态';
            }
        },
        querySource(val) {
            switch (val) {
                case '全部':
                    return '';
                case '企业':
                    return '1';
                case '用户':
                    return '2';
                default:
                    return '';
            }
        },
        sourceText(val) {
            switch (val) {
                case '':
                    return '全部';
                case 1:
                    return '企业';
                case 2:
                    return '用户';
                default:
                    return '';
            }
        },
        queryTime(val) {
            switch (val) {
                case '全部':
                    return '';
                case '最近一小时':
                    return '1';
                case '最近一天':
                    return '24';
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
        handleCurrentChange(val) {
            this.table.pageNum = val;
            this.getDataList();
        },
        getDataList() {
            let params = {};
            params = {
                pageSize: this.table.pageSize,
                pageNum: this.table.pageNum,
                orderId: this.form.orderId,
                telephone: this.form.telephone,
                userType: this.form.userType,
                hours: this.queryTime(this.topTime),
                orderState: this.orderState(this.orderStateSelect),
                orderType: this.form.orderType,
                uid: this.$route.params.id
            }
            this.listLoading = true;
            this.$http.ajaxPost({
                url: 'order/query',
                params: params
            }, (res) => {
                this.$http.aop(res, () => {
                    this.table.total = res.body.data.total;
                    this.table.dataList = res.body.data.orderInfoList;
                    this.listLoading = false;
                });
            });
        },
        onSubmit() {
            this.getDataList();
            // console.log('submit!', this.form);
        },
        handleChange(value) {
            //console.log(value)
        },
        previewInfo(opts) {
            let params = {};
            params = {
                orderId: opts.orderId,
            }
            this.listLoading = true;
            this.$http.ajaxPost({
                url: 'order/getInfo',
                params: params
            }, (res) => {
                this.$http.aop(res, () => {
                    this.orderDeliveryInfo = res.body.data.orderDeliveryInfo || {
                        createTime: '',
                        lawFirmName: '',
                        name: '',
                        orderId: '',
                        orderState: '',
                        orderType: 20,
                        sendNum: '',
                        status: '',
                        succNum: '',
                        telephone: '',
                        userType: ''
                    };
                    this.orderInfo = res.body.data.orderInfo || {
                        templateId: '',
                        templateName: '',
                        sendTime: '',
                        smsList: null
                    };
                    this.previewVisible = true;
                });
            });
            this.listLoading = false;
        }
    },
    mounted() {
        this.$parent.parentUrlName = "企业管理";
        this.$parent.parentUrls = '/enterprise';
        this.getDataList();
    }
}
</script>