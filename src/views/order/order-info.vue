<template>
    <section v-loading="infoLoading">
        <div class="king-page-topbar pr20 mb15">
            <h3 class="king-topbar-title mb0"><span>订单号：{{orderInfo.orderId}}</span></h3>
            <ul class="breadcrumb king-breadcrumb pl0 bg-transparent">
                <li>用户订单</li>
                <li class="active">订单详情</li>
            </ul>
        </div>
        <div class="bk-panel">
            <div class="bk-panel-body main-operating">
                <div class="info-user" style="width:50%;">
                    <!-- <h4>订单信息<span class="label label-primary fr">未审核</span></h4> -->
                    <ul class="list-group m0">
                        <li class="list-group-item"><span class="fl">用户姓名：</span><span class="name">{{orderInfo.name}}</span></li>
                        <li class="list-group-item">
                            <span class="fl">订单号：</span>
                            <span class="order">{{orderInfo.orderId}}</span>
                            <span v-if="orderInfo.orderState==430" style="color:#4491e1" class="ml25">已还清</span>
                            <span v-if="orderInfo.orderState==300" style="color:#4491e1" class="ml25">待指派面签员</span>
                            <span v-if="orderInfo.orderState==310" style="color:#4491e1" class="ml25">待审核并进行重组</span>
                            <span v-if="orderInfo.orderState==330" style="color:#4491e1" class="ml25">待用户确认重组</span>
                            <span v-if="orderInfo.orderState==333" style="color:#4491e1" class="ml25">我方代偿中</span>
                            <span v-if="orderInfo.orderState==360" style="color:#4491e1" class="ml25">用户还款中</span>
                            <span v-if="orderInfo.orderState==20" style="color:#4491e1" class="ml25">订单已关闭</span>
                        </li>
                        <!-- <li class="list-group-item"><span class="fl">UID：</span><span class="fr">26556</span></li> -->
                    </ul>
                </div>
                <div v-if="orderInfo.orderState!==430" class="info-btn" style="width:40%;">
                    <a v-if="orderInfo.orderState!==20" @click="remarkOrder('关闭订单','close')" class="bk-button bk-default ml25" title="关闭申请"><span>关闭申请</span></a>
                    <a v-if="orderInfo.orderState==300" @click="getDelivery" class="bk-button bk-primary ml25" title="指派面签"><span>指派面签</span></a>
                    <a v-if="orderInfo.orderState==310" @click="remarkOrder('订单信息确认','isOkOrder')" class="bk-button bk-primary ml25" title="信息确认"><span>信息确认</span></a>
                    <a v-if="orderInfo.orderState==330||orderInfo.orderState==333" @click="remarkOrder('修改信息','chengeOrderInfo')" class="bk-button bk-primary ml25" title="修改信息" :class="orderInfo.orderState!==300?'':'none'"><span>修改信息</span></a>
                    <a v-if="orderInfo.orderState==333" @click="remarkOrder('代偿完成','finishOrder')" class="bk-button bk-primary ml25" title="代偿完成"><span>代偿完成</span></a>
                    <div class="info-close">
                        <span v-if="orderInfo.orderState==20" class="ml15">订单已关闭</span>
                        <a class="bk-button bk-default ml25 none" @click="remarkOrder('重新开启账单','open')" title="重新开启"><span>重新开启</span></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="bk-panel mt20">
            <div class="bk-panel-body row">
                <div class="col-md-4 col-lg-4 col-xs-4 info-label nodata">
                    <!-- 交互说明 : 
                         无数据则给 info-label 添加类 nodata
                         编辑状态则添加类 edit ,同时删除input的readonly
                    -->
                    <div class="label-title">
                        <h4>个人信息</h4>
                        <a v-show="userInfoType.eUinf" class="bk-text-button bk-primary edit-btn" title="修改" @click="changeUsers">修改</a>
                        <a class="bk-text-button bk-primary cancel-btn" :class="userInfoType.uinf?'':'none'" title="取消" @click="notChangUser">取消</a>
                        <a class="bk-text-button bk-primary affirm-btn" :class="userInfoType.uinf?'':'none'" title="确认" @click="isOkChangUser">确认</a>
                    </div>
                    <div v-if="(userForm.name!=''||userForm.idCard!=''||orderInfo.userDegree!='')" class="label-cont mt15">
                        <el-form :model="userForm" class="bk-form" label-textAlign="left" label-width="120px" ref="userForm">
                            <div class="bk-form-item">
                                <label class="bk-label ta-l" style="width:120px;">姓名：</label>
                                <div class="bk-form-content" style="margin-left:120px;">
                                    <input type="text" class="bk-form-input" v-model="userForm.name" maxlength="10" placeholder="" :readonly="userInfoType.ceUinf">
                                </div>
                            </div>
                            <div class="bk-form-item mt5">
                                <label class="bk-label ta-l" style="width:120px;">身份证号：</label>
                                <div class="bk-form-content" style="margin-left:120px;">
                                    <input type="text" class="bk-form-input" v-model="userForm.idCard" maxlength="18" placeholder="" :readonly="userInfoType.ceUinf">
                                </div>
                            </div>
                            <div class="bk-form-item mt5">
                                <label class="bk-label ta-l" style="width:120px;">学历：</label>
                                <div class="bk-form-content" style="margin-left:120px;">
                                    <el-select v-show="!userInfoType.ceUinf" v-model.number="userForm.degree">
                                        <el-option v-for="item in degreeBox" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <span :class="userInfoType.ceUinf?'':'none'" style=" float: left; width:100%; color: #666;text-align:right">{{degreeType(userForm.degree)}}</span>
                                </div>
                            </div>
                            </form>
                        </el-form>
                    </div>
                    <div v-else class="nodata-cont">无个人信息</div>
                </div>
                <div class="col-md-4 col-lg-4 col-xs-4 info-label edit">
                    <!-- 交互说明 : 
                         无数据则给 info-label 添加类 nodata
                         编辑状态则添加类 edit ,同时删除input的readonly
                    -->
                    <div class="label-title">
                        <h4>联系人信息</h4>
                        <a class="bk-text-button bk-primary edit-btn" :class="userInfoType.leUinf?'':'none'" title="修改" @click="changeContact">修改</a>
                        <a class="bk-text-button bk-primary cancel-btn" :class="userInfoType.luinf?'':'none'" title="取消" @click="notChangContact">取消</a>
                        <a v-show="userContact.length>0" class="bk-text-button bk-primary affirm-btn" :class="userInfoType.luinf?'':'none'" title="确认" @click="isOkContact">确认</a>
                        <!--  <a class="bk-text-button bk-primary add-btn" :class="userInfoType.luinf?'':'none'" title="添加" @click="addContact">添加</a> -->
                    </div>
                    <div v-if="userGuarantor.length>0" class="label-cont mt15">
                        <form class="bk-form" id="validate_form" method="POST" action="javascript:;">
                            <div class="bk-form-item">
                                <div class="bk-form-content ml0 pr20 mb10" v-for="(item,key) in userContact">
                                    <input style="width:20%;" v-model="item.relation" maxlength="10" type="text" class="bk-form-input" placeholder="关系" value="" :readonly="userInfoType.cleUinf">
                                    <input style="width:28%;" v-model="item.name" maxlength="10" type="text" class="bk-form-input" placeholder="姓名" value="" :readonly="userInfoType.cleUinf">
                                    <input style="width:42%;" v-model="item.mobile" type="text" class="bk-form-input" placeholder="电话" maxlength="11" value="" :readonly="userInfoType.cleUinf">
                                    <a class="bk-text-button bk-primary delete-btn" @click="deleteContact(key)" :class="userInfoType.luinf?'':'none'" title="删除">删除</a>
                                </div>
                            </div>
                            <a class="add-new-btn" :class="userInfoType.luinf?'':'none'" @click="addContact"><i class="bk-icon icon-plus-circle"></i> 新增联系人</a>
                        </form>
                    </div>
                    <div v-else class="nodata-cont">无联系人细信息</div>
                </div>
                <div class="col-md-4 col-lg-4 col-xs-4 info-label">
                    <!-- 交互说明 : 
                         无数据则给 info-label 添加类 nodata
                         编辑状态则添加类 edit
                    -->
                    <div class="label-title">
                        <h4>担保人信息</h4>
                        <a class="bk-text-button bk-primary edit-btn" :class="userInfoType.deUinf?'':'none'" title="修改" @click="changeGuarantor">修改</a>
                        <a class="bk-text-button bk-primary cancel-btn" :class="userInfoType.duinf?'':'none'" title="取消" @click="notChangGuarantor">取消</a>
                        <a v-show="userGuarantor.length>0" class="bk-text-button bk-primary affirm-btn" :class="userInfoType.duinf?'':'none'" title="确认" @click="isOkGuarantor">确认</a>
                        <a class="bk-text-button bk-primary add-btn" :class="userInfoType.duinf?'':'none'" title="添加" @click="addGuarantor">添加</a>
                    </div>
                    <div v-if="userGuarantor.length>0" class="label-cont mt15">
                        <form class="bk-form" id="validate_form" method="POST" action="javascript:;">
                            <div v-for="(item,key) in userGuarantor" class="clearfix mt15">
                                <div class="bk-form-item clearfix" :class="userInfoType.duinf?'':'none'">
                                    <label class="bk-label ta-l" style="width:150px;"></label>
                                    <div class="bk-form-content ta-r" style="margin-left:150px;">
                                        <a class="bk-text-button bk-primary add-btn" @click="deleteGuarantor(key)">删除</a>
                                    </div>
                                </div>
                                <div class="bk-form-item mt5 clearfix">
                                    <label class="bk-label ta-l" style="width:150px;">姓名：</label>
                                    <div class="bk-form-content" style="margin-left:150px;">
                                        <input type="text" class="bk-form-input" v-model="item.name" maxlength="10" placeholder="" :readonly="userInfoType.cdeUinf">
                                    </div>
                                </div>
                                <div class="bk-form-item mt5">
                                    <label class="bk-label ta-l" style="width:150px;">身份证号：</label>
                                    <div class="bk-form-content" style="margin-left:150px;">
                                        <input type="text" class="bk-form-input" v-model="item.idCard" maxlength="18" placeholder="" :readonly="userInfoType.cdeUinf">
                                    </div>
                                </div>
                                <div class="bk-form-item mt5 clearfix">
                                    <label class="bk-label ta-l" style="width:150px;">抵押物：</label>
                                    <div class="bk-form-content" style="margin-left:150px;">
                                        <el-select v-show="!userInfoType.cdeUinf" v-model="item.pawns">
                                            <el-option v-for="item in pawnsBox" :label="item.name" :value="item.id">
                                            </el-option>
                                        </el-select>
                                        <span :class="userInfoType.cdeUinf?'':'none'" style=" float: left; width:100%; color: #666;text-align:right">{{pawnsType(item.pawns)}}</span>
                                        <!-- <input type="text" class="bk-form-input" v-model="item.pawns" placeholder="" :readonly="userInfoType.cdeUinf"> -->
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div v-else class="nodata-cont">无联担保人细信息</div>
                </div>
            </div>
        </div>
        <!-- 主要表格 -->
        <div class="bk-panel mt20">
            <div class="bk-panel-header" role="tab">
                <div class="bk-panel-info fl">
                    <div class="panel-title">债务明细</div>
                    <!-- <div class="panel-subtitle">(待审核前可以修改)</div> -->
                </div>
                <div class="bk-panel-action fr">
                    <div v-show="orderInfo.orderState==310" class="bk-form bk-inline-form bk-form-small">
                        <button v-if="!typeofFun(repayInfo)" class="bk-button bk-primary bk-button-small" @click="modifyDebt('添加账单','create',{})" title="增加债务">增加债务</button>
                    </div>
                </div>
            </div>
            <div class="bk-panel-body p0">
                <table class="bk-table details-table has-thead-bordered">
                    <thead>
                        <tr>
                            <th>债务平台</th>
                            <th style="width:200px" class="text-r">待还款金额</th>
                            <th>逾期情况</th>
                            <th>逾期天数</th>
                            <th>代偿情况</th>
                            <th>图片资料</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in debtList">
                            <td>{{item.platform}}</td>
                            <td class="text-r">{{fmoney(item.amount,2)}}</td>
                            <td>{{item.overdueStatus==1?'逾期':'未逾期'}}</td>
                            <td>{{item.overdueDays}}</td>
                            <td>{{item.state?'已代偿':'未代偿'}}</td>
                            <td>
                                <a v-if="item.picUrlList" class="bk-text-button" @click="viewImg(item.picUrlList)">查看图片</a>
                                <span v-else>没有图片</span>
                            </td>
                            <td>
                                <template v-if="orderInfo.orderState==310">
                                    <a v-if="!typeofFun(repayInfo)" class="bk-text-button" @click="modifyDebt('编辑账单','modify',item)">编辑</a>
                                    <a v-if="!typeofFun(repayInfo)" class="bk-text-button" @click="delDebt(item.orderDebtId)">删除</a>
                                </template>
                                <template v-else>
                                    <select v-if="orderInfo.orderState==333" v-model="item.state" @change="changeOrderDebtState(item)" class="select">
                                        <option value="0">未代偿</option>
                                        <option value="1">已代偿</option>
                                    </select>
                                    <span v-else>-</span>
                                </template>
                            </td>
                        </tr>
                        <tr class="total">
                            <td>债务总数</td>
                            <td class="text-r">待还金额：{{fmoney(count,2)}}</td>
                            <td>债务个数：{{debtList.length}}</td>
                            <td>&nbsp</td>
                            <td>&nbsp</td>
                            <td>&nbsp</td>
                            <td>&nbsp</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="bk-panel mt20">
            <div class="bk-panel-header" role="tab">
                <div class="bk-panel-info fl">
                    <div class="panel-title">重组明细</div>
                </div>
                <div class="bk-panel-action fr">
                    <div v-if="!typeofFun(repayInfo)&&orderInfo.orderState==310" class="bk-form bk-inline-form bk-form-small">
                        <button v-if="typeofFun(repayPlan)" class="bk-button bk-primary bk-button-small" @click="viewRepayPlan('modify')" title="修改">修改</button>
                        <button v-else class="bk-button bk-primary bk-button-small" @click="viewRepayPlan('create')" title="修改">增加</button>
                    </div>
                </div>
            </div>
            <div class="bk-panel-body p0">
                <table class="bk-table details-table has-thead-bordered">
                    <thead>
                        <tr>
                            <th class="text-r">重组金额</th>
                            <th class="text-r">手续费</th>
                            <th>还款期数</th>
                            <th>逾期天数</th>
                            <th>还款方式</th>
                            <th style="width:360px;">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-r">{{fmoney(repayPlan.capital,2)}}</td>
                            <td class="text-r">{{fmoney(repayPlan.monFee,2)}}</td>
                            <td>{{repayPlan.fqNum}}</td>
                            <td>{{repayPlan.overDueDays}}</td>
                            <td><span v-show="typeofFun(repayPlan)">{{repayPlan.repayType||'等额本息按日计息'}}</span></td>
                            <td>
                                <a v-show="typeofFun(repayPlan)" class="bk-text-button" @click="viewRepayPlan('view')">查看详情</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-if="typeofFun(repayInfo)" class="bk-panel mt20">
            <div class="bk-panel-header" role="tab">
                <div class="bk-panel-info fl">
                    <div class="panel-title">还款明细</div>
                </div>
                <div class="bk-panel-action fr">
                    <div v-show="!(orderInfo.orderState==430||orderInfo.orderState==20)" class="bk-form bk-inline-form bk-form-small">
                        <button class="bk-button bk-primary bk-button-small" @click="viewRepayInfo('modify')" title="修改">修改</button>
                    </div>
                </div>
            </div>
            <div class="bk-panel-body p0">
                <table class="bk-table details-table has-thead-bordered">
                    <thead>
                        <tr>
                            <th class="text-r">还款金额</th>
                            <th class="text-r">手续费</th>
                            <th>还款期数</th>
                            <th>逾期天数</th>
                            <th style="width:360px;">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-r">{{fmoney(repayInfo.capital,2)}}</td>
                            <td class="text-r">{{fmoney(repayInfo.monFee,2)}}</td>
                            <td>{{repayInfo.fqNum}}</td>
                            <td>{{repayInfo.overDueDays}}</td>
                            <td>
                                <a class="bk-text-button" @click="viewRepayInfo('view')">查看详情</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="bk-panel mt20">
            <div class="bk-panel-header" role="tab">
                <div class="bk-panel-info fl">
                    <div class="panel-title">操作日志</div>
                </div>
            </div>
            <div class="bk-panel-body p0">
                <table class="bk-table details-table has-thead-bordered">
                    <thead>
                        <tr>
                            <th>操作时间</th>
                            <th>操作人</th>
                            <th>操作内容</th>
                            <th style="width:360px;">操作备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in logList">
                            <td>{{dateTime(item.createTime)}}</td>
                            <td>{{item.name}}</td>
                            <td>{{item.description}}</td>
                            <td>{{item.remark}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- 指派面签员 [[-->
        <el-dialog title="指派面签员" v-model="deliveryFormVisible" :close-on-click-modal="false">
            <el-form :model="deliveryForm" label-width="80px" :rules="deliveryFormRules" ref="deliveryForm">
                <div style="width: 90%; margin: 0 auto;">
                    <el-form-item label="面签员" prop="mid">
                        <el-select v-model="deliveryForm.mid" placeholder="请选择面签员">
                            <el-option v-for="item in deliveryList" :label="item.name" :value="item.mid">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <textarea style="height: 160px" class="bk-form-textarea" v-model="deliveryForm.remark" placeholder="请填写备注信息"></textarea>
                        <!-- <el-input type="textarea" style="height: 160px" class="bk-form-textarea" v-model="deliveryForm.desc" placeholder="请填写备注信息"></el-input> -->
                    </el-form-item>
                </div>
            </el-form>
            <div class="dialog-btns">
                <a class="bk-button bk-default" @click="deliveryFormVisible = false" title="点错了">点错了</a>
                <a class="bk-button bk-primary mr10" @click="createDelivery" title="确认">确认</a>
            </div>
        </el-dialog>
        <!-- 指派面签员 ]]-->
        <!--  其他同类的可复用该弹层 [[-->
        <el-dialog :title="descTitle" v-model="descFormVisible" :close-on-click-modal="false" @close="closeDescDialog">
            <el-form :model="descForm" label-width="80px" :rules="descFormRules" ref="descForm">
                <div style="width: 90%; margin: 0 auto;">
                    <el-form-item label="备注" prop="remark">
                        <textarea style="height: 160px" class="bk-form-textarea" v-model="descForm.remark" placeholder="请填写备注信息"></textarea>
                    </el-form-item>
                </div>
            </el-form>
            <div class="dialog-btns">
                <a class="bk-button bk-default" @click="descFormVisible = false" title="点错了">点错了</a>
                <a class="bk-button bk-primary mr10" @click="remarkOrderSubmit(descRemarkType)" title="确认">确认</a>
            </div>
        </el-dialog>
        <!-- 关闭用户申请 ]]-->
        <el-dialog title="查看重组明细" v-model="repayPLanViewVisible" :close-on-click-modal="false">
            <form class="bk-form" id="" method="POST" action="javascript:;">
                <table class="bk-table details-table has-thead-bordered">
                    <thead>
                        <tr>
                            <th>期数</th>
                            <th class="text-r">本金</th>
                            <th class="text-r">利息</th>
                            <th>还款日期</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item ,key) in repayPlanList">
                            <td>{{item.repayIndex}}</td>
                            <td class="text-r">{{fmoney(item.capital,2)}}</td>
                            <td class="text-r">{{fmoney(item.monFee,2)}}</td>
                            <td>{{dateTime(item.repayDate)}}</td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <div class="dialog-btns"></div>
        </el-dialog>
        <el-dialog title="查看还款明细" v-model="repayInfoViewVisible" :close-on-click-modal="false">
            <form class="bk-form" id="" method="POST" action="javascript:;">
                <table class="bk-table details-table has-thead-bordered">
                    <thead>
                        <tr>
                            <th>期数</th>
                            <th class="text-r">本金</th>
                            <th class="text-r">利息</th>
                            <th>逾期费</th>
                            <th>还款日期</th>
                            <th>实际还款日期</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item ,key) in repayInfoList">
                            <td>{{key+1}}</td>
                            <td class="text-r">{{fmoney(item.capital,2)}}</td>
                            <td class="text-r">{{fmoney(item.monFee,2)}}</td>
                            <td>{{fmoney(item.penalty,2)}}</td>
                            <td>{{dateTime(item.repayDate)}}</td>
                            <td>{{item.accountDate}}<span></span></td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <div class="dialog-btns"></div>
        </el-dialog>
        <!-- 添加～修改账单-->
        <el-dialog :title="debtTitle" v-model="debtFormVisible" :close-on-click-modal="false" @close="closeDebtDialog">
            <el-form :model="debtForm" label-width="100px" ref="debtForm">
                <el-form-item label="债务平台" prop="platform" :rules="[{ required: true, message: '请输入平台名称', trigger: 'blur'} ]">
                    <el-input v-model="debtForm.platform" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="代还款金额" prop="amount" :rules="[
                        { required: true, message: '请输入代还款金额'}
                    ]">
                    <el-input v-model="debtForm.amount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="逾期情况">
                    <el-select v-model.number="debtForm.overdueStatus" @change="chengeOverdueStatus">
                        <el-option v-for="item in overdueStatus" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="debtForm.overdueStatus==1" label="逾期天数">
                    <el-input v-model="debtForm.overdueDays" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-upload ref="upload" list-type="picture-card" :action="uploadPolicy.host" :multiple="uploadConfig.multiple" :data="uploadConfig.data" :on-success="uploadSuccess" :on-error="uploadError" :on-remove="uploadRemove" :accept="uploadConfig.accept" :file-list="fileList" :before-upload="beforeUpload">
                        <i class="el-icon-plus"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg/webp/gif文件，且不超过5mb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div class="dialog-btns" style="padding-left: 100px;">
                <a class="bk-button bk-default" @click="debtFormVisible = false" title="点错了">点错了</a>
                <a class="bk-button bk-primary mr10" @click="AddDebtSubmit(debtFormType)" title="确认">确认</a>
            </div>
        </el-dialog>
        <!-- ／添加～修改账单 -->
        <!-- /添加／修改重组明细 -->
        <el-dialog title="修改重组明细" v-model="repayPlanFormVisible" :close-on-click-modal="false">
            <el-form :model="repayPlanForm" label-width="100px" :rules="repayPlanForm" ref="repayPlanForm">
                <table class="bk-table details-table has-thead-bordered">
                    <thead>
                        <tr>
                            <th>期数</th>
                            <th class="text-r">本金</th>
                            <th class="text-r">利息</th>
                            <th>还款日期</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item ,key) in repayPlanList">
                            <td>{{key+1}}</td>
                            <td class="text-r">
                                <input v-model="item.capital" style="width:70px;" type="text" value="32">
                            </td>
                            <td class="text-r">
                                <input v-model="item.monFee" style="width:70px;" type="text" value="32">
                            </td>
                            <td>
                                <el-date-picker size="mini" format="yyyy-MM-dd" type="date" placeholder="选择日期" v-model="item.repayDate" style="width:110px">
                                </el-date-picker>
                                <td><a class="bk-text-button bk-primary delete-btn" @click="deleteOneRayPlan(key)" title="删除">删除</a></td>
                        </tr>
                    </tbody>
                </table>
                <div class="mt20" style="text-align: center;">
                    <a class="add-btn mt25" @click="addOneRepayPlan()">
                        <i></i>
                        新增期数
                    </a>
                </div>
            </el-form>
            <div class="dialog-btns" style="padding: 20px 0 0 0; text-align: center;">
                <a class="bk-button bk-default" @click="repayPlanFormVisible=false" title="点错了">点错了</a>
                <a class="bk-button bk-primary mr10" @click="severRepayPlanSubmit()" title="确认">确认</a>
            </div>
        </el-dialog>
        <!-- // 修改重组明细 -->
        <!-- ／添加／修改还款明细 [[-->
        <el-dialog title="修改还款明细" v-model="repayInfoFormVisible" :close-on-click-modal="false">
            <el-form :model="repayInfoForm" label-width="100px" :rules="repayInfoForm" ref="repayInfoForm">
                <table class="bk-table details-table has-thead-bordered">
                    <thead>
                        <tr>
                            <th>期数</th>
                            <th class="text-r">本金</th>
                            <th class="text-r" width="80px">利息</th>
                            <th width="80px">逾期费</th>
                            <th width="102px">还款日期</th>
                            <th width="130px">实际还款日期</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item ,key) in repayInfoList">
                            <td>{{key+1}}</td>
                            <td class="text-r">{{fmoney(item.capital,2)}}</td>
                            <td class="text-r">
                                <input v-if="item.repayState<20" v-model="item.monFee" style="width:60px;" type="text">
                                <span v-else>{{fmoney(item.monFee,2)}}</span>
                            </td>
                            <td>
                                <input v-if="(item.repayState<20&&item.penalty!=0)" v-model="item.penalty" style="width:60px;" type="text">
                                <span v-else>{{fmoney(item.penalty,2)}}</span>
                            </td>
                            <td>
                                <span>{{dateTime(item.repayDate)}}</span>
                            </td>
                            <td>
                                <span>{{item.accountDate}}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="dialog-btns" style="padding: 20px 0 0 0; text-align: center;">
                    <a class="bk-button bk-default" @click="repayInfoFormVisible=false" title="点错了">点错了</a>
                    <a class="bk-button bk-primary mr10" @click="severRepayInSubmit()" title="确认">确认</a>
                </div>
            </el-form>
        </el-dialog>
        <!-- 修改还款明细 ]]-->
        <el-dialog title="查看图片" v-model="dialogImgVisible">
            <div v-show="dialogImgVisible" v-for="item in debtImgBox" style="width:100%; background-color: #000; padding:10px">
                <img :src="item" style="max-width: 100%;">
            </div>
        </el-dialog>
    </section>
</template>
<script>
import moment from 'moment';
import md5 from 'js-md5';
import validate from '../../validate';
export default {
    data() {
        return {

            picUrlList: [],
            debtTitle: '编辑账单',
            debtFormType: 'create',
            debtFormVisible: false,
            dialogImgVisible: false,
            dialogVisible: false,
            dialogImageUrl: '',
            debtImgBox: [],
            debtForm: {
                platform: '',
                amount: 0,
                overdueDays: 0,
                overdueStatus: '',
                picUrlList: [],
            },
            overdueStatus: [
                { name: "未逾期", id: 0 },
                { name: "逾期", id: 1 },
            ],
            pawnsBox: [
                { name: "房子", id: '1' },
                { name: "车子", id: '2' },
                { name: "保险", id: '3' },
                { name: "其它", id: '' }
            ],
            degreeBox: [
                { name: "高中及以下", id: 1 },
                { name: "中专", id: 2 },
                { name: "大专", id: 3 },
                { name: "本科", id: 4 },
                { name: "硕士", id: 5 },
                { name: "博士", id: 6 },
                { name: "其他", id: 7 }
            ],
            userInfoType: {
                ceUinf: true, //点击编辑
                eUinf: true, //个人信息显示修改
                uinf: false, //个人显示 确认取消
                cleUinf: true, //点击编辑
                leUinf: true, //联系人信息显示修改
                luinf: false, //个人显示 确认取消
                cdeUinf: true, //点击编辑
                deUinf: true, //联系人信息显示修改
                duinf: false, //个人显示 确认取消 
                debUinf: false,
                payPlan: false,
                payPlanInfo: false
            },
            userContact: [], //联系人信息
            userGuarantor: [], //担保人信息
            userForm: {
                orderId: '',
                name: '',
                idCard: '',
                degree: ''
            },
            deliveryList: [],
            deliveryFormVisible: false,
            deliveryForm: {
                orderId: '',
                mid: '',
                name: '',
                remark: ''
            },
            deliveryFormRules: {
                mid: [{
                    required: true,
                    message: '请选择面签员',
                    trigger: 'change'
                }],
                remark: [{
                    required: true,
                    message: '请填写备注信息',
                    trigger: 'blur'
                }]
            },
            descFormVisible: false,
            descTitle: '填写备注',
            descRemarkType: '',
            descForm: {
                orderId: '',
                remark: ''
            },
            descFormRules: {
                remark: [{
                    required: true,
                    message: '请填写备注信息',
                    trigger: 'blur'
                }]
            },
            infoLoading: false,
            orderInfo: {}, //订单信息
            logList: [], //操作日志
            debtList: [], //债务明细 
            repayInfo: {}, //还款明细
            repayPlan: {}, //重组明细
            repayInfoList: [],
            repayInfoFormVisible: false,
            repayInfoFormViewVisible: false,
            repayInfoViewVisible: false,
            repayInfoForm: {},
            repayPlanList: [],
            repayPlanForm: {},
            uploadPolicy: {},
            uploadConfig: {
                multiple: true,
                thread: 5,
                data: {},
                accept: 'image/png,image/gif,image/jpeg,image/webp'
            },
            fileList: [],
            repayPlanId: '',
            repayPLanViewVisible: false,
            repayPlanFormVisible: false,
            count: 0,
        }
    },
    methods: {
        fmoney(s, n) {
            n = n > 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(),
                r = s.split(".")[1],
                t = "";
            for (var i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }

            if (s == 'NaN' || s == 'undefined') {
                return '';
            } else {
                return t.split("").reverse().join("") + "." + r;
            }
        },
        rmoney(s) {
            return parseFloat(s.replace(/[^\d\.-]/g, ""));
        },
        chengeOverdueStatus() {
            if (this.debtForm.overdueStatus == 0) {
                this.debtForm.overdueDays = 0;
            }
        },
        getPageName(url) { //获取文件名 
            var tmp = new Array();
            tmp = url.split("/");
            return tmp[tmp.length - 1];
        },
        dateTime(val) {
            return moment(val).format('YYYY-MM-DD');
        },
        typeofFun(obg) { //判断obj是否为空 空返回false，不为空返回true 
            var strObj = JSON.stringify(obg);
            if (strObj === '{}') {
                return false;
            } else {
                return true;
            }
        },
        countFun() { //账单总金额
            this.count = 0;
            for (let i = 0; i < this.debtList.length; i++) {
                this.count += this.debtList[i].amount;
            }
        },
        deliveryName(opts) { //根据面签员mid 获取面签员name
            var name = '';
            for (let i = 0; i < this.deliveryList.length; i++) {
                if (parseInt(opts) == parseInt(this.deliveryList[i].mid)) {
                    name = this.deliveryList[i].name;
                }
            }
            return name;
        },
        degreeType(val) { //
            switch (parseInt(val)) {
                case 1:
                    return '高中及以下';
                case 2:
                    return '中专';
                case 3:
                    return '大专';
                case 4:
                    return '本科';
                case 5:
                    return '硕士';
                case 6:
                    return '博士';
                case 7:
                    return '其他';
                default:
                    return '其他';
            }
        },
        pawnsType(val) { //抵押物
            switch (parseInt(val)) {
                case 1:
                    return '房子';
                case 2:
                    return '车子';
                case 3:
                    return '保险';
                default:
                    return '其他';
            }
        },
        getDataList() { //获取订单详情
            let params = {};
            params = {
                orderId: this.orderInfo.orderId,
            }
            this.infoLoading = true;
            this.$http.ajaxPost({
                url: 'order/getOrderInfo',
                params: params
            }, (res) => {
                this.$http.aop(res, () => {
                    this.changeUserInfo(res.body.data.order.orderState); //显示／隐藏 修改按钮
                    this.orderInfo = res.body.data.order; //订单信息
                    this.repayInfo = res.body.data.repayInfo || {}; //还款明细
                    this.repayPlan = res.body.data.repayPlan || {}; //重组明细
                    this.logList = res.body.data.logList;
                    this.debtList = res.body.data.debtList; //债务信息

                    if (this.typeofFun(this.debtList)) {
                        this.debtList.forEach((item, index) => {
                            this.debtList[index].amount = item.amount / 100;
                        });
                    }
                    if (this.typeofFun(this.repayInfo)) {
                        this.repayInfo.capital = this.repayInfo.capital / 100;
                        this.repayInfo.monFee = this.repayInfo.monFee / 100;
                    }
                    if (this.typeofFun(this.repayPlan)) {
                        this.repayPlan.capital = this.repayPlan.capital / 100;
                        this.repayPlan.monFee = this.repayPlan.monFee / 100;
                    }

                    this.userForm.orderId = this.orderInfo.orderId;
                    this.userForm.degree = this.orderInfo.degree;
                    this.userForm.idCard = this.orderInfo.idCard;
                    this.userForm.name = this.orderInfo.name;

                    this.countFun()
                    this.infoLoading = false;
                    this.gitUserContact();
                    this.gitUserGuarantor();

                });
            });
        },
        gitUserGuarantor() { //获取担保人信息
            let params = {};
            params = {
                uid: this.orderInfo.uid,

            }
            this.infoLoading = true;
            this.$http.ajaxPost({
                url: 'order/queryGuarantor',
                params: params
            }, (res) => {
                this.$http.aop(res, () => {
                    this.userGuarantor = res.body.data.guarantorList || [];
                    this.infoLoading = false;
                });
            });
        },
        addGuarantor() { //添加担保人
            var guarantor = {
                gid: '',
                idCard: '',
                name: '',
                pawns: ''
            };
            this.userGuarantor.push(guarantor);
        },
        deleteGuarantor(key) {
            this.userGuarantor.splice(key, 1);
        },
        addContact() { //添加联系人
            var contact = {
                cid: '',
                mobile: '',
                name: '',
                relation: ''
            }
            this.userContact.push(contact);
        },
        deleteContact(key) {
            this.userContact.splice(key, 1);
        },
        gitUserContact() { //获取联系人信息
            let params = {};
            params = {
                uid: this.orderInfo.uid,

            }
            this.$http.ajaxPost({
                url: 'order/queryContact',
                params: params
            }, (res) => {
                this.$http.aop(res, () => {
                    this.userContact = res.body.data.contactList || [];
                    // for (let i = 0; i < this.userContact.length; i++) {
                    //     this.userContact[i].value = this.userContact[i].name + '/' + this.userContact[i].mobile;
                    // }
                });
            });
        },
        checkUserForm() { //验证个人信息
            if (!validate.checkUserName(this.userForm.name)) {
                this.$message.error('姓名格式不正确');
                return false;
            }
            if (!validate.checkID(this.userForm.idCard)) {
                this.$message.error('身份证格式不正确');
                return false;
            }
            return true;
        },
        isOkChangUser() { // 确认修个人信息 
            if (this.checkUserForm()) {
                this.$confirm('是否确认，修改当前用户信息？', '提示', {}).then(() => {
                    let para = Object.assign({}, this.userForm);
                    this.$http.ajaxPost({
                        url: 'order/modifyUser',
                        params: para
                    }, (res) => {
                        this.$http.aop(res, () => {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.pageNum = 1;
                            this.getDataList();
                            this.notChangUser();
                        })
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            }
        },
        checkContact(data) { //验证联系人 
            let isOk = true;
            let text = '';
            data.forEach((item) => {
                Object.keys(item).forEach((val) => {
                    switch (val) {
                        case 'name':
                            if (item[val] === '') {
                                text = '姓名不能为空';
                                isOk = false;
                            }
                            break;
                        case 'mobile':
                            if (!validate.checkPhoneNum(item[val])) {
                                text = '手机号格式不正确';
                                isOk = false;
                            }
                            break;
                        case 'relation':
                            if (item[val] === '') {
                                text = '请填写联系人的关系';
                                isOk = false;
                            }
                            break;
                    }
                });
            });
            if (!isOk) {
                this.$message.error(text);
                return false;
            }
            return true;
        },
        isOkContact() { //保存联系人 
            var params = {
                contactList: this.userContact,
                uid: this.orderInfo.uid
            };
            if (this.checkContact(params.contactList)) {
                this.$confirm('是否确认，修改联系人信息？', '提示', {}).then(() => {
                    this.$http.ajaxPost({
                        url: 'order/modifyContact',
                        params: params
                    }, (res) => {
                        this.$http.aop(res, () => {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.pageNum = 1;
                            this.getDataList();
                            this.notChangContact();
                        })
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            }
        },
        checkGuarantor(data) { //验证担保人信息
            let isOk = true;
            let text = '';
            data.forEach((item) => {
                Object.keys(item).forEach((val) => {
                    switch (val) {
                        case 'name':
                            if (item[val] === '') {
                                text = '姓名不能为空';
                                isOk = false;
                            }
                            break;
                        case 'idCard':
                            if (!validate.checkID(item[val])) {
                                text = '身份证号格式不正确';
                                isOk = false;
                            }
                            break;
                        case 'pawns':
                            if (item[val] === '') {
                                text = '请选抵押物';
                                isOk = false;
                            }
                            break;
                    }
                });
            });
            if (!isOk) {
                this.$message.error(text);
                return false;
            }
            return true;
        },
        isOkGuarantor() { //保存担保人
            var params = {
                guarantorList: [],
                uid: this.orderInfo.uid
            };
            this.userGuarantor.forEach((item) => {
                let val = {
                    gid: item.gid || 0,
                    name: item.name,
                    idCard: item.idCard,
                    pawns: parseInt(item.pawns)
                }
                params.guarantorList.push(val);
            });
            if (this.checkGuarantor(params.guarantorList)) {
                this.$confirm('是否确认，修改担保信息？', '提示', {}).then(() => {
                    this.$http.ajaxPost({
                        url: 'order/modifyGuarantor',
                        params: params
                    }, (res) => {
                        this.$http.aop(res, () => {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.pageNum = 1;
                            this.getDataList();
                            this.notChangGuarantor();
                        })
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            }
        },
        notChangContact() { //取消修改联系人信息
            this.gitUserContact();
            this.userInfoType.cleUinf = true;
            this.userInfoType.leUinf = true;
            this.userInfoType.luinf = false;
        },
        notChangGuarantor() { //取消修改担保人信息
            this.gitUserGuarantor();
            this.userInfoType.cdeUinf = true;
            this.userInfoType.deUinf = true;
            this.userInfoType.duinf = false;
        },
        notChangUser() { //取消修改个人信息
            this.userInfoType.ceUinf = true;
            this.userInfoType.eUinf = true;
            this.userInfoType.uinf = false;
            this.userForm.userDegree = this.orderInfo.degree;
            this.userForm.idCard = this.orderInfo.idCard;
            this.userForm.name = this.orderInfo.name;
        },
        changeGuarantor() { //修改担保人信息
            this.userInfoType.cdeUinf = false;
            this.userInfoType.deUinf = false;
            this.userInfoType.duinf = true;
        },
        changeContact() { //修改联系人信息
            this.userInfoType.cleUinf = false;
            this.userInfoType.leUinf = false;
            this.userInfoType.luinf = true;
        },
        changeUsers() { //修改个人信息
            this.userInfoType.ceUinf = false;
            this.userInfoType.eUinf = false;
            this.userInfoType.uinf = true;
        },
        changeUserInfo(state) { //显示/隐藏 修改信息 按钮  
            if ((parseInt(state) === 20 || parseInt(state) === 430)) {
                this.userInfoType.eUinf = false;
                this.userInfoType.leUinf = false;
                this.userInfoType.deUinf = false;
                this.userInfoType.type = false;
                this.userInfoType.payPlan = false;
                this.userInfoType.payPlanInfo = false;
            } else if (parseInt(state) === 310) {
                this.userInfoType.eUinf = true;
                this.userInfoType.leUinf = true;
                this.userInfoType.deUinf = true;
                this.userInfoType.type = true;
                this.userInfoType.payPlan = true;
                this.userInfoType.payPlanInfo = true;
            }
        },
        getDelivery() { //获取 面签员
            let params = {};
            params = {
                pageSize: 100,
                pageNum: 1,
            };
            this.infoLoading = true;
            this.deliveryForm.mid = '';
            this.$http.ajaxPost({
                url: 'admin/queryAdminList',
                params: params
            }, (res) => {
                this.$http.aop(res, () => {
                    this.deliveryList = res.body.data.adminList;
                    for (var i = 0; i < this.deliveryList.length; i++) {
                        this.deliveryList[i].mid = this.deliveryList[i].mid + '';
                    }
                    this.deliveryFormVisible = true;
                    this.infoLoading = false;
                });
            });
        },
        createDelivery() { //指派面签员
            this.$refs.deliveryForm.validate((valid) => {
                if (valid) {
                    this.$confirm('是否确认', '提示', {}).then(() => {
                        let para = Object.assign({}, this.deliveryForm);
                        para.orderId = this.orderInfo.orderId;
                        para.name = this.deliveryName(para.mid);
                        this.$http.ajaxPost({
                            url: 'order/createDelivery',
                            params: para
                        }, (res) => {
                            this.$http.aop(res, () => {
                                this.$message({
                                    message: '开启成功',
                                    type: 'success'
                                });
                                this.pageNum = 1;

                                this.getDataList();
                            });
                        });
                        this.deliveryFormVisible = false;

                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消开启'
                        });
                    });
                }
            });
        },
        isOKSubmit() { //确认订单信息   
            this.$confirm('是否确认，当前用户信息？', '提示', {}).then(() => {
                let para = Object.assign({}, this.descForm);
                para.orderId = this.orderInfo.orderId;
                this.$http.ajaxPost({
                    url: 'order/confirmOrder',
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
                this.descFormVisible = false;
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消修改'
                });
            });
        },
        remarkOrder(str, type) { //状态操作按钮
            this.descTitle = str;
            this.descRemarkType = type
            if (!this.typeofFun(this.repayPlan) && type === "isOkOrder") {
                this.$message({
                    type: 'info',
                    message: '重组明细不能为空'
                });
                return;
            }

            this.descFormVisible = true;
        },
        openOrder() { //重新开启账单
            this.$confirm('是否确认，重新开启当前订单？', '提示', {}).then(() => {
                let para = Object.assign({}, this.descForm);
                para.orderId = this.orderInfo.orderId;
                this.$http.ajaxPost({
                    url: 'order/openOrder',
                    params: para
                }, (res) => {
                    this.$http.aop(res, () => {
                        this.$message({
                            message: '开启成功',
                            type: 'success'
                        });
                        this.pageNum = 1;

                        this.getDataList();
                    });
                });
                this.descFormVisible = false;
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取开启'
                });
            });
        },
        closeOrderSubmit() { //关闭订单 
            this.$confirm('是否确认，关闭当前账单？', '提示', {}).then(() => {
                let para = Object.assign({}, this.descForm);
                para.orderId = this.orderInfo.orderId;
                this.$http.ajaxPost({
                    url: 'order/closeOrder',
                    params: para
                }, (res) => {
                    this.$http.aop(res, () => {
                        this.$message({
                            message: '关闭成功成功',
                            type: 'success'
                        });

                        this.getDataList();
                    })
                });
                this.descFormVisible = false;
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        overSubmit() { //代偿完成
            this.$confirm('是否确认，当前用户账单代偿完成？', '提示', {}).then(() => {
                let para = Object.assign({}, this.descForm);
                para.orderId = this.orderInfo.orderId;
                this.$http.ajaxPost({
                    url: 'order/finishOrder',
                    params: para
                }, (res) => {
                    this.$http.aop(res, () => {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.getDataList();
                    })
                });
                this.descFormVisible = false;

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        chengeOrderInfo() { //修改定单信息  
            this.$refs.descForm.validate((valid) => {
                if (valid) {
                    this.$confirm('是否确认，要修改订单信息？', '提示', {}).then(() => {
                        let para = Object.assign({}, this.descForm);
                        para.orderId = this.orderInfo.orderId;
                        this.$http.ajaxPost({
                            url: 'order/modifyOrder',
                            params: para
                        }, (res) => {
                            this.$http.aop(res, () => {
                                this.$message({
                                    message: '修改订单',
                                    type: 'success'
                                });
                                this.getDataList();
                            })
                        });
                        this.descFormVisible = false;
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取修改订单'
                        });
                    });
                }
            });
        },
        remarkOrderSubmit(type) { //填写备注  
            switch (type) {
                case 'close': //关闭订单
                    this.closeOrderSubmit();
                    return;
                case 'open': //重新开启点单
                    this.openOrder();
                    return '本科';
                case 'isOkOrder': //确认订单信息  
                    this.isOKSubmit();
                    return;
                case 'finishOrder':
                    this.overSubmit();
                    return;
                case 'updateOrder':
                    this.updateOrder();
                    return;
                case 'chengeOrderInfo':
                    this.chengeOrderInfo();

                default:
                    return;
            }
        },
        viewRepayPlan(type) { //查看/修改重组明细
            var para = {};
            this.infoLoading = true;
            this.repayPlanList = [];
            para.orderId = this.orderInfo.orderId;
            if (type == "create") {
                this.repayPlanFormVisible = true;
                this.infoLoading = false;
            } else {
                this.$http.ajaxPost({
                    url: 'repay/queryRepayPlan',
                    params: para
                }, (res) => {
                    this.$http.aop(res, () => {
                        this.repayPlanList = JSON.parse(res.body.data.repayPlan.repayInfo);
                        this.repayPlanList.forEach((item, index) => {
                            this.repayPlanList[index].capital = item.capital / 100;
                            this.repayPlanList[index].monFee = item.monFee / 100;
                        });
                        if (type == "modify") { //修改
                            this.repayPlanId = res.body.data.repayPlan.repayPlanId;
                            this.repayPlanFormVisible = true;
                        } else { //查看
                            if (this.repayPlanList.length > 0) {
                                this.repayPLanViewVisible = true;
                            } else {
                                this.$message({
                                    type: 'info',
                                    message: '还没有明细数据，请去添加／修改数据'
                                });
                            }

                        }
                        this.infoLoading = false;
                    })
                });
            }
        },
        addOneRepayPlan() { //添加一条 重组明细数据
            var item = {
                capital: '',
                monFee: '',
                repayDate: "",
                repayIndex: '',
            }
            this.repayPlanList.push(item);
        },
        deleteOneRayPlan(tag) { //删除一条重组明细数据
            this.repayPlanList.splice(this.repayPlanList.indexOf(tag), 1);
        },
        checkRepayPlan(data) { //验证重组明细
            let isOk = true;
            let text = '';
            data.forEach((item) => {
                Object.keys(item).forEach((val) => {
                    switch (val) {
                        case 'capital':
                            if (!validate.checkNums(item[val])) {
                                text = '请填写还款金额(为大于等于0的数字,保留两位小数）';
                                isOk = false;
                            }
                            break;
                        case 'monFee':
                            if (!validate.checkNums(item[val])) {
                                text = '请填写利息（为大于等于0的数字,保留两位小数）';
                                isOk = false;
                            }
                            break;
                        case 'repayDate':
                            if (!validate.checkValidateCode(item[val])) {
                                text = '请选择还款日期';
                                isOk = false;
                            }
                            break;
                    }
                });
            });
            if (!isOk) {
                this.$message.error(text);
                return false;
            }
            return true;
        },
        severRepayPlanSubmit() { //保存重组明细 
            if (this.checkRepayPlan(this.repayPlanList)) {
                this.$confirm('是否确认，当前修改重组明细？', '提示', {}).then(() => {
                    let repayInfoList = [];
                    this.repayPlanList.forEach((item, index) => {
                        item.repayIndex = index + 1;
                        item.capital = item.capital * 100;
                        item.monFee = item.monFee * 100;
                        item.repayDate = this.dateTime(item.repayDate);
                        repayInfoList.push(item);
                    });
                    //return ;
                    let para = {
                        repayInfo: JSON.stringify(repayInfoList),
                        orderId: this.orderInfo.orderId,
                        fqNum: repayInfoList.length,
                        repayPlanId: this.repayPlanId
                    };
                    this.$http.ajaxPost({
                        url: 'repay/modifyRepayPlan',
                        params: para
                    }, (res) => {
                        this.$http.aop(res, () => {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.getDataList();
                        })
                    });
                    this.repayPlanFormVisible = false;

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            }
        },
        viewRepayInfo(type) { //查看还款明细
            var para = {};
            this.infoLoading = true;
            para.orderId = this.orderInfo.orderId;
            this.$http.ajaxPost({
                url: 'repay/queryRepayInfo',
                params: para
            }, (res) => {
                this.$http.aop(res, () => {
                    this.repayInfoList = res.body.data.repayInfoList;
                    this.repayInfoList.forEach((item, index) => {
                        this.repayInfoList[index].capital = item.capital / 100;
                        this.repayInfoList[index].monFee = item.monFee / 100;
                    });
                    if (type == "modify") { //修改
                        this.repayInfoFormVisible = true;
                    } else { //查看
                        this.repayInfoViewVisible = true;
                    }
                    this.infoLoading = false;
                })
            });
        },
        checkRepayInfo(data) { //验证还款明细
            let isOk = true;
            let text = '';
            data.forEach((item) => {
                if (item.repayState < 20) {
                    Object.keys(item).forEach((val) => {
                        switch (val) {
                            case 'penalty':
                                if (item.penalty !== 0) {
                                    if (!validate.checkNums(item[val])) {
                                        text = '请填写逾期费（为大于等于0的数字,保留两位小数）';
                                        isOk = false;
                                    }
                                }
                                break;
                            case 'monFee':
                                if (!validate.checkNums(item[val])) {
                                    text = '请填写利息（为大于等于0的数字,保留两位小数）';
                                    isOk = false;
                                }
                                break;
                        }
                    });
                }

            });
            if (!isOk) {
                this.$message.error(text);
                return false;
            }
            return true;
        },
        severRepayInSubmit() { //修改还款明细  确认 
            if (this.checkRepayInfo(this.repayInfoList)) {
                this.$confirm('是否确认，当前修改还款明细？', '提示', {}).then(() => {
                    this.repayInfoList.forEach((item, index) => {
                        this.repayInfoList[index].monFee = item.monFee * 100;
                        this.repayInfoList[index].penalty = item.penalty * 100;
                        this.repayInfoList[index].repayDate = this.dateTime(this.repayInfoList[index].repayDate);
                    })
                    let para = {
                        repayInfoList: this.repayInfoList,
                        orderId: this.orderInfo.orderId
                    };
                    this.$http.ajaxPost({
                        url: 'repay/modifyRepayInfo',
                        params: para
                    }, (res) => {
                        this.$http.aop(res, () => {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.getDataList();
                        })
                    });
                    this.repayInfoFormVisible = false;
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            }
        },
        delDebt(id) { // 删除债务明细
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                let para = {
                    orderDebtId: id
                };
                this.$http.ajaxPost({
                    url: 'debt/deleteOrderDebt',
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
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        modifyDebt(val, type, obj) { // 增加／修改债务按钮 初始化上传空间 
            this.$http.get('upload/getAliyunPostPolicy', {}, {
                emulateJSON: false
            }).then((res) => {
                this.$http.aop(res, () => {
                    this.uploadPolicy = res.body.data || {};
                    this.uploadConfig.data.policy = this.uploadPolicy.policy;
                    this.uploadConfig.data.OSSAccessKeyId = this.uploadPolicy.accessid;
                    this.uploadConfig.data.signature = this.uploadPolicy.signature;
                    if (this.typeofFun(obj)) {
                        if (obj.picUrlList) {
                            for (var i = 0; i < obj.picUrlList.length; i++) {
                                this.picUrlList.push({
                                    name: i + '.png',
                                    url: obj.picUrlList[i]
                                });
                            }
                        }
                        this.fileList = this.picUrlList;
                        this.debtForm = {
                            orderDebtId: obj.orderDebtId,
                            platform: obj.platform,
                            amount: obj.amount,
                            overdueDays: obj.overdueDays,
                            overdueStatus: obj.overdueStatus,
                            picUrlList: obj.picUrlList,
                            state: obj.state
                        };
                    } else {
                        this.debtForm = {
                            platform: '',
                            amount: 0,
                            overdueDays: 0,
                            overdueStatus: 1,
                            picUrlList: [],
                        };
                    }
                    this.debtTitle = val;
                    this.debtFormType = type;
                    this.debtFormVisible = true;
                });
            }, (res) => {
                this.$http.aop(res);
            });
        },
        AddDebtSubmit(type) { //保存债务
            if (type == 'create') {
                this.createOrderDebt();
            } else {
                this.modifyOrderDebt();
            }
        },
        checkOrderDebt(data) { //验证联系人 
            let isOk = true;
            let text = '';
            Object.keys(data).forEach((val) => {
                switch (val) {
                    case 'amount':
                        if (!validate.checkNums(data[val])) {
                            text = '请填写代还款金额（为大于等于0的数字,保留两位小数）';
                            isOk = false;
                        }
                        break;
                    case 'overdueDays':
                        if (data.overdueStatus == 1) {
                            if (!validate.checkNum(data[val])) {
                                text = '请填写代逾期天数（为正整数）';
                                isOk = false;
                            }
                        }
                        break;
                }
            });
            if (!isOk) {
                this.$message.error(text);
                return false;
            }
            return true;
        },
        createOrderDebt() { //添加债务
            var debt = Object.assign({}, this.debtForm);
            for (var i = 0; i < this.picUrlList.length; i++) {
                var imgUrl = this.picUrlList[i].url;
                debt.picUrlList.push(imgUrl);
            }
            if (this.checkOrderDebt(debt)) {
                this.$refs.debtForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('是否确认，添加当前账单？', '提示', {}).then(() => {
                            debt.amount = debt.amount * 100;
                            let para = {
                                debt: debt,
                                orderId: this.orderInfo.orderId
                            };
                            this.$http.ajaxPost({
                                url: 'debt/createOrderDebt',
                                params: para
                            }, (res) => {
                                this.$http.aop(res, () => {
                                    this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                    this.getDataList();
                                })
                            });
                            this.debtFormVisible = false;
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            });
                        });
                    }
                });
            }
        },
        modifyOrderDebt() { //编辑债务 
            var debt = Object.assign({}, this.debtForm);
            //var user = JSON.parse(sessionStorage.getItem('user'));
            debt.picUrlList = [];
            for (var i = 0; i < this.picUrlList.length; i++) {
                var imgUrl = this.picUrlList[i].url;
                debt.picUrlList.push(imgUrl);
            }
            if (this.checkOrderDebt(debt)) {
                this.$refs.debtForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('是否确认，修改当前账单？', '提示', {}).then(() => {
                            debt.amount = debt.amount * 100;
                            let para = {
                                debt: debt,
                                orderId: this.orderInfo.orderId
                            };
                            this.$http.ajaxPost({
                                url: 'debt/modifyOrderDebt',
                                params: para
                            }, (res) => {
                                this.$http.aop(res, () => {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.getDataList();
                                })
                            });
                            this.debtFormVisible = false;
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            });
                        });
                    }
                });
            }
        },
        changeOrderDebtState(item) { //修改债务状态
            this.$confirm('是否确认，修改当前债务状态？', '提示', {}).then(() => {
                let para = {
                    orderDebtId: item.orderDebtId,
                    state: item.state
                };
                this.$http.ajaxPost({
                    url: 'debt/modifyDebtState',
                    params: para
                }, (res) => {
                    this.$http.aop(res, () => {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.getDataList();
                    })
                });
                this.debtFormVisible = false;
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消修改'
                });
            });
        },
        closeDescDialog() { //关闭填写备注弹框
            this.descForm.remark = '';
        },
        closeDebtDialog() { //关闭弹框
            this.fileList = [];
            this.picUrlList = [];
            this.$refs.upload.clearFiles();
        },
        viewImg(aImg) { //查看图片
            this.debtImgBox = [];
            this.debtImgBox = aImg;

            this.dialogImgVisible = true;
        },
        uploadSuccess(response, file, fileList) { //文件长传成功  
            this.picUrlList.push({
                name: file.name,
                url: this.uploadPolicy.host + '/' + this.uploadConfig.data.key
            });
        },
        beforeUpload(file) {
            let key = this.uploadPolicy.dir + '/' + md5('' + Date.now + this.uploadPolicy.uid + Math.random());
            this.uploadConfig.data.key = key;
            const isLt5M = file.size / 1024 / 1024 < 5;
            const isFileLength = this.picUrlList.length <= 4;
            if (!isFileLength) {
                this.$message.error('最多只添加五张图片');
            }
            if (!isLt5M) {
                this.$message.error('上传图片大小不能超过 5MB!');
            }

            return isFileLength && isLt5M;
        },
        uploadRemove(file, fileList) {
            if (this.picUrlList.length < 5) {
                for (var i = 0; i < this.picUrlList.length; i++) {
                    if (this.picUrlList[i].name == file.name) {
                        this.picUrlList.splice(i, 1);
                        break;
                    }
                }
            }
        },
        uploadError(file, fileList) {
            this.$message({
                type: 'info',
                message: '文件上传失败'
            });
        }
    },
    mounted() {
        this.orderInfo.orderId = this.$route.params.id;
        this.getDataList();
    }
}
</script>
<style scoped>
</style>