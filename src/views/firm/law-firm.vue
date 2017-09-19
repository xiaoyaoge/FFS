<template>
    <section>
        <div class="info" v-loading="listLoading">
            <div class="cont">
                <div class="b-manage-title">
                    <h5 class="fl">短信模板</h5>
                    <div class="edit-btns b-manage-btns fr">
                        <!-- 交互说明 
                             点击修改后，把保存于取消按钮显示出来，同时把info里所有input 的 readonly 去除
                        -->
                        <a class="bk-button bk-success bk-button-small ml10 fr" @click="create('msg')" title="添加"><span>添加</span></a>
                    </div>
                </div>
                <table class="bk-table has-table-bordered has-table-hover">
                    <thead>
                        <tr>
                            <th>模板名称</th>
                            <th>是否有效</th>
                            <th>创建时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="items in dataList">
                            <td>{{items.templateName}}</td>
                            <td>
                                <select v-model="items.status" class="table-select" @change="changeMsgStatus(items)">
                                    <option value="0">未生效</option>
                                    <option value="1">有效</option>
                                </select>
                            </td>
                            <td>{{dateTime(items.modifyTime)}}</td>
                            <td>
                                <a @click="preview(items,'msg')" class="bk-text-button">查看详情</a> 
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="cont">
                <div class="b-manage-title">
                    <h5 class="fl">信函模板</h5>
                    <div class="edit-btns b-manage-btns fr">
                        <!-- 交互说明 
                             点击修改后，把保存于取消按钮显示出来，同时把info里所有input 的 readonly 去除
                        -->
                        <a class="bk-button bk-success bk-button-small ml10 fr" @click="create('email')" title="添加"><span>添加</span></a>
                    </div>
                </div>
                <table class="bk-table has-table-bordered has-table-hover">
                    <thead>
                        <tr>
                            <th>模板名称</th>
                            <th>是否有效</th>
                            <th>创建时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in emailList">
                            <td>{{item.templateName}}</td>
                            <td>
                                <select v-model="item.status" class="table-select" @change="changeMsgStatus(item)">
                                    <option value="0">未生效</option>
                                    <option value="1">有效</option>
                                </select>
                            </td>
                            <td>{{dateTime(item.modifyTime)}}</td>
                            <td><a @click="preview(item,'email')" class="bk-text-button">查看详情</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <el-dialog :title="(previewSize=='msg'?'短信模板':'信函模板')" v-model="previewVisible" :close-on-click-modal="false">
            <div class="temp ffs-modal">
                <h5>模板明细</h5>
                <div class="cont" style=" margin: 0 auto;">
                    <p>{{msgForm.templateName}}</p>
                </div>
                <div v-if="previewSize=='msg'" class="cont" style=" margin: 0 auto;">
                    <p>{{msgForm.templateContent}} </p>
                </div>
                <iframe v-else ref="iframe" :src="msgForm.templateContent" style="width: 100%; height: 600px; margin: 0 auto; border: 0;"></iframe>
            </div>
            <div class="modal-footer ta-c">
                <a class="bk-button bk-primary" @click="previewVisible = false" title="取消">取消</a>
            </div>
        </el-dialog>
        <el-dialog title="新建模版" v-model="formVisible" :close-on-click-modal="false">
            <div class="temp ffs-modal">
                <el-form class="bk-form pb15" ref="form" label-width="80px">
                    <div class="bk-form-item mt5">
                        <label class="bk-label w100 pr20">模版名称：</label>
                        <div class="bk-form-content" style="margin-left: 100px">
                            <input type="text" class="bk-form-input" placeholder="输入模版名字" v-model="msgForm.templateName" maxlength="10">
                        </div>
                    </div>
                    <div class="bk-form-item mt5">
                        <label class="bk-label w100 pr20">内容：</label>
                        <div class="bk-form-content" style="margin-left: 100px">
                            <!-- <input class="bk-form-input" v-model="msgForm.templateContent" placeholder="输入email模版url地址"> -->
                            <el-upload v-if="formType==='email'" class="upload-demo" :action="uploadPolicy.host" :multiple="uploadConfig.multiple" :data="uploadConfig.data" :on-success="uploadSuccess" :on-change="uploadChange" :on-error="uploadError" :on-remove="uploadRemove" :accept="uploadConfig.accept" :file-list="fileList" :on-preview="uploadPictureCardPreview" :before-upload="beforeUpload">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <span slot="tip" class="el-upload__tip ml15">只能上传html文件，且不超过5mb</span>
                            </el-upload>
                            <textarea v-else v-model="msgForm.templateContent" row="5" class="bk-form-textarea h80" placeholder="输入信息模版内容"></textarea>
                        </div>
                    </div>
                    <div class="bk-form-item mt5">
                        <label class="bk-label w100 pr20">内容：</label>
                        <el-select v-model="msgForm.status" placeholder="请选择活动区域">
                            <el-option label="不生效" :value="0"></el-option>
                            <el-option label="生效" :value="1"></el-option>
                        </el-select>
                    </div>
                </el-form>
            </div>
            <div class="modal-footer ta-c">
                <a class="bk-button bk-default" @click="formVisible = false" title="取消">取消</a>
                <a class="bk-button bk-primary" @click="severForm" title="保存">保存</a>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import moment from 'moment'
import md5 from 'js-md5'
import validate from '../../validate'
export default {
    data() {
        return {
            listLoading: false,
            previewVisible: false,
            previewSize: 'msg',
            formVisible: false,
            formType: 'msg',
            dataList: [],
            emailList: [],
            msgForm: {
                lawFirmId: 2,
                status: 0,
                templateContent: '',
                templateId: 0,
                templateName: '',
                templateType: 0,
            },
            uploadPolicy: {
                host: '',
            },
            uploadConfig: {
                multiple: true,
                thread: 5,
                data: {},
                accept: '.html'
            },
            fileList: []
        }
    },
    methods: {
        dateTime(val) {
            return moment(val).format('YYYY-MM-DD,hh:mm');
        },
        preview(opts, type) {
            this.previewVisible = true;
            this.msgForm = opts;
            this.previewSize = type;
        },
        checkForm(data) { //验证担保人信息
            let isOk = true;
            let text = '';
            Object.keys(data).forEach((val) => {
                switch (val) {
                    case 'templateName':
                        if (data[val] === '') {
                            text = '模版名称不能为空';
                            isOk = false;
                        }
                        break;
                    case 'templateContent':
                        if (data.templateType == 1) {
                            if (data[val] === '') {
                                text = '模版内容不能为空';
                                isOk = false;
                            }
                        } else {
                            if (data[val] == '') {
                                text = '模版email地址不能为空';
                            }
                            if (!validate.checkUrl(data[val])) {
                                text = '模版email地址不正确';
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
        severForm() {
            let params = {};
            params = {
                templateInfo: this.msgForm
            }
            if (this.checkForm(params.templateInfo)) {
                this.$confirm('确认要保存吗？', '提示', {}).then(() => {
                    this.$http.ajaxPost({
                        url: 'template/create',
                        params: params
                    }, (res) => {
                        this.$http.aop(res, () => {
                            this.$message({
                                message: '创建成功',
                                type: 'success'
                            });
                            this.formVisible = false;
                            this.gitData(this.msgForm.templateType);
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        },
        changeMsgStatus(opts) {
            let params = {};
            params = {
                status: opts.status,
                templateId: opts.templateId
            }
            this.listLoading = true;
            this.$http.ajaxPost({
                url: 'template/modifyStatus',
                params: params
            }, (res) => {
                this.$http.aop(res, () => {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.listLoading = false;
                });
            });
        },
        gitData(type) {
            let params = {};
            params = {
                lawFirmId: 2,
                templateType: type
            }
            this.listLoading = true;
            this.$http.ajaxPost({
                url: 'template/query',
                params: params
            }, (res) => {
                this.$http.aop(res, () => {
                    if (type == 1) {
                        this.dataList = res.body.data.templateInfoList;
                    } else {
                        this.emailList = res.body.data.templateInfoList;
                    }

                    this.listLoading = false;
                });
            });

        },
        create(type) {
            this.formType = type;
            if (type !== 'msg') {
                this.$http.post('upload/getAliyunPostPolicy', { dir: 'template' }).then((res) => {
                    this.$http.aop(res, () => {
                        this.uploadPolicy = res.body.data || {};
                        this.uploadConfig.data.policy = this.uploadPolicy.policy;
                        this.uploadConfig.data.OSSAccessKeyId = this.uploadPolicy.accessid;
                        this.uploadConfig.data.signature = this.uploadPolicy.signature;

                    });
                }, (res) => {
                    this.$http.aop(res);
                });
            }
            this.formVisible = true;
            this.msgForm = {
                lawFirmId: 2,
                status: 0,
                templateContent: '',
                templateName: '',
                templateType: (type == 'msg' ? 1 : 2)
            };
        },
        uploadSuccess(response, file, fileList) { //文件长传成功  
            let url = this.uploadPolicy.host + '/' + this.uploadConfig.data.key;
            this.msgForm.templateContent = url;
        },
        beforeUpload(file) {
            let key = this.uploadPolicy.dir + '/' + md5('' + Date.now + this.uploadPolicy.mid + Math.random());
            this.uploadConfig.data.key = key;
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                this.fileList = [];
                this.$message.error('上传图片大小不能超过 5MB!');
            }
            return isLt5M;
        },
        uploadPictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        uploadRemove(file, fileList) {
            if (fileList.length > 0) { this.fileList = fileList.slice(-1); }
        },
        uploadChange(file, fileList) {
            if (fileList.length > 0) {
                this.fileList = fileList.slice(-1);
            } else {
                this.fileList = [];
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
        this.gitData(1);
        this.gitData(2);
    }
}
</script>