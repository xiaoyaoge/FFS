<template>
    <section>
        <div class="bk-panel bk-demo">
            <div class="bk-panel-header" role="tab">
                <div class="bk-panel-info fl">
                    <div class="panel-title">运营商短信详情</div>
                    <div class="panel-subtitle"></div>
                </div>
                <div class="bk-panel-action fr">
                </div>
            </div>
            <div class="bk-panel-body" v-loading="listLoading">
                <el-row>
                    <el-col :span="11" style="margin-top:10px;margin-bottom: 10px" v-for="(item, index) in getlist" :key="item.providerId" :offset="index>0&&((index+1)%3!==0)? 1 : 0">
                        <el-card :body-style="{ padding: '15px'}">
                            <div class="cont" style="border:none">
                                <form class="bk-form" id="validate_form" method="POST" action="javascript:;">
                                    <div class="b-manage-title">
                                        <h5 class="fl">{{item.providerName}}</h5>
                                    </div>
                                    <div class="bk-form-item">
                                        <label class="bk-label"> 短信剩余条数：</label>
                                        <div class="bk-form-content">
                                            {{smsData[item.providerId].smsnumber||'点击按钮查询剩余条数'}}
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="clearfix">
                                <div class="bottom fr">
                                    <a class="bk-button bk-primary bk-button-small" @click="searchBtn(item)">查询剩余条数</a>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
    </section>
</template>
<script>
import moment from 'moment'
import md5 from 'js-md5'
export default {
    data() {
        return {
            dataList: [],
            listLoading: false,
            getlist: [],
            smsData: []
        }
    },
    methods: {
        dateTime(val) {
            return moment(val).format('YYYY-MM-DD HH:mm:ss');
        },
        mobileView(val) {
            //return val;
            return val.replace(/\B(?=(?:\d{4})+$)/g, '-');
        },
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getDataList();
        },
        getyunyinshan() {
            let _page = this;
            let params = {};
            this.listLoading = true;
            this.$http.ajaxPost({
                url: 'sms/query',
                params: params
            }, (res) => {
                this.$http.aop(res, () => {
                    this.getlist = res.body.data.smsProviderList || [];
                    this.getlist.forEach(function(item, index) {
                        _page.smsData[item.providerId] = { 'smsnumber': '' };
                    });
                    this.listLoading = false;
                });
            });

        },
        searchBtn(opts) {
            let params = { providerId: opts.providerId };
            this.listLoading = true;
            this.$http.ajaxPost({
                url: 'sms/balance',
                params: params
            }, (res) => {
                this.$http.aop(res, () => { 
                    this.smsData[opts.providerId].smsnumber = res.body.data.balance,
                    this.listLoading = false;
                });
            });
        },
    },
    mounted() {
        this.$parent.parentUrlName = "办公管理";
        this.$parent.parentUrls = '/manage';
        this.getyunyinshan();
    }
}
</script>
<style scoped>
</style>