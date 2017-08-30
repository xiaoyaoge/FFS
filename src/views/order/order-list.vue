<template>
    <section>
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
                        <div id="status" class="col-md-12 col-lg-12 col-xs-12">
                            <label class="bk-label pr15" style="width:100px;">当前状态：</label>
                            <el-radio-group v-model="orderType">
                                <el-radio-button label="全部"></el-radio-button>
                                <!-- <el-radio-button label="发起请求"></el-radio-button> -->
                                <el-radio-button label="待指派面签员"></el-radio-button>
                                <el-radio-button label="待审核并进行重组"></el-radio-button>
                                <el-radio-button label="待用户确认重组"></el-radio-button>
                                <el-radio-button label="我方代偿中"></el-radio-button>
                                <el-radio-button label="用户还款中"></el-radio-button>
                                <el-radio-button label="已还清"></el-radio-button>
                                <el-radio-button label="关闭"></el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="row more-query-cont mt15" :class="collapsed?'none':''">
                        <div class="col-md-4 col-lg-4 col-xs-4">
                            <div class="bk-form-item mb20">
                                <label class="bk-label pr15" style="width:100px;">身份证：</label>
                                <div class="bk-form-content" style="margin-left:100px;">
                                    <input type="text" v-model="form.idCard" class="bk-form-input" placeholder="请输入身份证号码" style="width:100%;">
                                </div>
                            </div>
                            <div class="bk-form-item mb20">
                                <label class="bk-label pr15" style="width:100px;">手机号：</label>
                                <div class="bk-form-content" style="margin-left:100px;">
                                    <input type="text" v-model="form.mobile" class="bk-form-input" placeholder="请输入手机号码" style="width:100%;">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-4 col-xs-4">
                            <div class="bk-form-item mb20">
                                <label class="bk-label pr15" style="width:100px;">面签员姓名：</label>
                                <div class="bk-form-content" style="margin-left:100px;">
                                    <input type="text" v-model="form.deliveryName" class="bk-form-input" placeholder="请输入面签员姓名" style="width:100%;">
                                </div>
                            </div>
                            <div class="bk-form-item mb20">
                                <label class="bk-label pr15" style="width:100px;">面签员手机：</label>
                                <div class="bk-form-content" style="margin-left:100px;">
                                    <input type="text" v-model="form.deliveryMobile" class="bk-form-input" placeholder="请输入面签员手机" style="width:100%;">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-4 col-xs-4">
                            <!-- <div class="bk-form-item mb20">
                                <label class="bk-label pr15" style="width:100px;">用户姓名：</label>
                                <div class="bk-form-content" style="margin-left:100px;">
                                    <input type="text" class="bk-form-input" placeholder="请输入用户姓名" style="width:100%;">
                                </div>
                            </div> -->
                            <div class="bk-form-item mb20">
                                <label class="bk-label pr15" style="width:100px;">订单号：</label>
                                <div class="bk-form-content" style="margin-left:100px;">
                                    <input type="text" v-model="form.orderId" class="bk-form-input" placeholder="请输入关键字" style="width:100%;">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12 col-lg-12 col-xs-12">
                            <div class="bk-form-item mb20">
                                <label class="bk-label pr15" style="width:100px;">所在地区：</label>
                                <el-cascader size="large" :options="provinceAndCityDataPlus" v-model="selectedOptions" @change="handleChange">
                                </el-cascader>
                                <span class="none">{{CodeToText[selectedOptions[0]]}}->{{CodeToText[selectedOptions[1]]}}->{{CodeToText[selectedOptions[2]]}}</span>
                            </div>
                        </div>
                    </div>
                    <a class="more-query-link" style="margin-top: 10px; margin-bottom: 10px;" @click="moreQuery">{{collapsedText}}</a>
                    <div class="col-md-12 col-lg-12 col-xs-12">
                        <div class="bk-form-content" style="margin-left:85px;">
                            <button class="bk-button bk-success">查询</button>
                            <!-- 交互说明 ：收起时更改文案为 展开更多查询条件，同时隐藏 more-query-cont -->
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
                                <th style="width:25px">
                                    <input type="checkbox" name="checkall" value="">
                                </th>
                                <th>订单号</th>
                                <th>姓名</th>
                                <th>地区</th>
                                <th>面签员</th>
                                <th>状态</th>
                                <th>提交时间</th>
                                <th style="width:265px">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in table.dataList">
                                <td>
                                    <input type="checkbox" name="checkall" value="">
                                </td>
                                <td>{{item.orderId}}</td>
                                <td>{{item.name}}</td>
                                <td>{{CodeToText[item.area[0]]}}{{CodeToText[item.area[1]]}}{{CodeToText[item.area[2]]}}</td>
                                <td>{{item.delivery}}</td>
                                <td>{{OrderState(item.orderState)}}</td>
                                <td>{{dateTime(item.createDate)}}</td>
                                <td>
                                    <span v-if="item.orderState==100">用户未提交资料</span> 
                                    <router-link :to="{path:'/orderInfo/'+item.orderId}" class="bk-icon-button bk-warning bk-button-mini" v-else title="查看">
                                        <i class="bk-icon icon-eye bk-icon"></i>
                                        <i class="bk-text">查看详情</i>
                                    </router-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                <div class="bk-panel-footer p10">
                    <el-col :span="24" class="toolbar mt20">
                        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="table.pageSize" :total="table.total" style="float:right;">
                        </el-pagination>
                    </el-col>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import {
    regionDataPlus,
    CodeToText,
    TextToCode
} from '../../area'
import moment from 'moment'
export default {
    data() {
            return {
                topTime: '全部',
                orderType: '全部',
                form: {
                    idCard: '', //身份证
                    mobile: '', //手机号  
                    provinceId: '', //省id
                    cityId: '', //市id
                    areaId: '', //区id
                    deliveryMobile: '', //面签员手机号
                    deliveryName: '', //面签员姓名
                    createTime: '', //创建时间
                    orderId: '', //订单号
                    orderState: '' //订单状态 
                },
                collapsed: true,
                collapsedText: '显示更多查询条件',
                TextToCode: TextToCode,
                CodeToText: CodeToText,
                selectedOptions: ['', '', ''],
                provinceAndCityDataPlus: regionDataPlus,
                table: {
                    dataList: [],
                    total: 0,
                    pageSize: 10,
                    pageNum: 1
                },
                listLoading: false,
            }
        },
        methods: {
            dateTime(val) {
                return moment(val).format('YYYY-MM-DD');
            },
            OrderState(val) {
                switch (val) {
                    case 20:
                        return '关单';
                    case 100:
                        return '用户未提交资料';
                    case 300:
                        return '待指派面签员';
                    case 310:
                        return '待审核并进行重组';
                    case 330:
                        return '待用户确认重组';
                    case 333:
                        return '我方代偿中';
                    case 360:
                        return '用户还款中';
                    case 430:
                        return '还款完成(全部期数还完)';
                    default:
                        return '未知状态';
                }
            },
            queryOrderState(val) { 
                switch (val) {
                    case '关闭':
                        return 20;
                    case '用户未提交资料':
                        return 100;
                    case '待指派面签员':
                        return 300;
                    case '待审核并进行重组':
                        return 310;
                    case '待用户确认重组':
                        return 330;
                    case '我方代偿中': 
                        return 333;
                    case '用户还款中':
                        return 360;
                    case '已还清':
                        return 430;
                    case '全部':
                        return '';
                    default:
                        return '';
                }
            },
            queryCreateTime(val) {
                switch (val) {
                    case '全部':
                        return '';
                    case '最近一小时':
                        return 1;
                    case '最近一天':
                        return 24;
                    default:
                        return '';
                }
            },
            handleCurrentChange(val) {
                this.table.pageNum = val;
                this.getDataList();
            },
            moreQuery() {
                if (this.collapsed) {
                    this.collapsed = false;
                    this.collapsedText = '收起更多查询条件';
                } else {
                    this.collapsed = true;
                    this.collapsedText = '显示更多查询条件';
                }

            },
            getDataList() {
                let params = {};
                params = {
                    pageSize: this.table.pageSize,
                    pageNum: this.table.pageNum,
                    orderId: this.form.orderId, //订单号
                    idCard: this.form.idCard, //身份证
                    mobile: this.form.mobile, //手机号  
                    provinceId: this.selectedOptions[0], //省id
                    cityId: this.selectedOptions[1], //市id
                    areaId: this.selectedOptions[2], //区id
                    deliveryMobile: this.form.deliveryMobile, //面签员手机号
                    deliveryName: this.form.deliveryName, //面签员姓名
                    createTime: this.queryCreateTime(this.topTime), //创建时间 
                    orderState: this.queryOrderState(this.orderType) //订单状态 
                }
                this.listLoading = true;
                this.$http.ajaxPost({
                    url: 'order/queryOrder',
                    params: params
                }, (res) => {
                    this.$http.aop(res, () => {
                        this.table.total = res.body.data.total;
                        this.table.dataList = res.body.data.orderList;
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
            convertTextToCode(provinceText, cityText, regionText) {
                let code = ''
                if (provinceText && this.TextToCode[provinceText]) {
                    const province = this.TextToCode[provinceText]
                    code += province.code + ', '
                    if (cityText && province[cityText]) {
                        const city = province[cityText]
                        code += city.code + ', '
                        if (regionText && city[regionText]) {
                            code += city[regionText].code
                        }
                    }
                }
                return code
            }
        },
        mounted() {
            this.getDataList();
        }
}
</script>
<style scoped>
</style>
