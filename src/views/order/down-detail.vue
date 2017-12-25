<template>
    <section>
        <div class="bk-panel mb20" v-loading="listLoading">
            <div class="bk-panel-body p25">
                <div class="row">
                    <!-- 交互说明: 选中条件后给A标签添加类 on -->
                    <div id="time" class="col-md-4 col-lg-4 col-xs-4 mb10">
                        <label class="bk-label pr15" style="width:85px;">起始时间：</label>
                        <el-date-picker v-model="value" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                        </el-date-picker>
                    </div>
                    <div id="status" class="col-md-8 col-lg-8 col-xs-8 mb10">
                        <label class="bk-label pr15" style="width:85px;">订单来源：</label>
                        <el-radio-group v-model="orderStateSelect">
                            <el-radio-button label="全部"></el-radio-button>
                            <el-radio-button label="短信"></el-radio-button>
                            <el-radio-button label="邮件"></el-radio-button>
                        </el-radio-group>
                        <a class="bk-button bk-success ml20" @click="searchBtn">下载</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import moment from 'moment'
export default {
    data() {
        return {
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            value: '',
            orderStateSelect: '全部',
            collapsed: true,
            listLoading: false
        }
    },
    methods: {
        dateTime(val) {
            let minute = moment(val).startOf('minute').fromNow();
            return (minute.indexOf('分钟') > -1 || minute.indexOf('秒') > -1) ? moment(val).startOf('minute').fromNow() : moment(val).format('YYYY-MM-DD HH:mm:ss');
        },
        dateTimes(val) {
            return moment(val).format('YYYY-MM-DD');
        },
        orderState(val) {
            switch (val) {
                case '全部':
                    return '';
                case '短信':
                    return '10';
                case '邮件':
                    return '20';
                default:
                    return '';
            }
        },
        searchBtn() {
            let start = this.dateTimes(this.value[0]),
                end = this.dateTimes(this.value[1]),
                type = this.orderState(this.orderStateSelect);

            if (this.value.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '请选着起止时间'
                });
                return;
            };
            if (type === "") {
                this.$message({
                    type: 'warning',
                    message: '请选选着订单来源'
                });
                return;
            }
            console.log(start, end, type);

            this.$confirm('确定要下载当前条件下的数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                this.$http.ajaxPost({
                    url: 'order/deliveryDetailDownload',
                    params: { orderType: parseInt(type), beginDate: start, endDate: end }
                }, (res) => {
                    this.$http.aop(res, () => {
                        console.log(res);
                        //document.location.href= res.body.data.excelUrl
                        this.listLoading = false;
                    });

                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: ' 下载已取消'
                });
            });


        }
    },
    mounted() {}
}
</script>
<style scoped>
</style>