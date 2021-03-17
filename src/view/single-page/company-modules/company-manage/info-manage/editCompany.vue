<template>
    <div class="companyWrap">
        <Card :bordered="false">
            <p slot="title">编辑企业</p>
            <div class="container">
                <Tabs :value="modeTabs">
                    <TabPane :label="label1" name="0" disabled>
                        <Form ref="formValiInfo" :model="formItem"  :rules="ruleValidate"  :label-width="130">
                            <FormItem label="企业名称：" prop="name">
                                <Input v-model="formItem.name" :maxlength="100" placeholder="请输入企业名称" style="width: 200px" ></Input>
                            </FormItem>
                            <FormItem label="企业电话：" prop="telephone">
                                <Input v-model="formItem.telephone" placeholder="请输入企业电话" style="width: 200px" ></Input>
                            </FormItem>
                            <FormItem label="企业地址：" prop="address">
                                <Input v-model="formItem.address" placeholder="请输入企业地址" style="width: 200px" ></Input>
                            </FormItem>
                            <Form :label-width="130" ref="ruleItem" :model="formItem"  >
                                <div v-for="(list, index) in formItem.list" :key="index">
                                    <FormItem :label="index == 0 ? '联系人：': '联系人' + parseInt(index + 1 )  + '：'"  :prop="'list.' + index + '.name'"   :rules="[{required: true, message:'联系人不能为空'}]">
                                        <Input  v-model="list.name"  placeholder="请输入联系人姓名" style="width: 200px" ></Input>
                                    </FormItem>
                                    <FormItem :label="index == 0 ? '联系人电话：': '联系人电话' + parseInt(index + 1 ) + '：' "  :prop="'list.' + index + '.phone'"  :rules="[{required: true, message:'联系人电话不能为空'},{validator: validatePhone, trigger: 'change'}]">
                                        <Input  v-model="list.phone"  placeholder="请输入联系人电话" style="width: 200px" ></Input>
                                    </FormItem>
                                </div>  
                            </Form>
                            <FormItem v-if=" formItem.list.length < 3 ">
                                <Button type="primary" @click="addContact" >添加联系人</Button>
                            </FormItem>
                            <FormItem label="紧急联系人：" prop="emergencyContact">
                                <Input v-model="formItem.emergencyContact" placeholder="请输入紧急联系人" style="width: 200px" ></Input>
                            </FormItem>
                            <FormItem label="紧急联系人电话：" prop="emergencyContactPhone">
                                <Input v-model="formItem.emergencyContactPhone" placeholder="请输入紧急联系人电话" style="width: 200px" ></Input>
                            </FormItem>
                            <FormItem label="统一社会信用代码：" prop="orgCode">
                                <Input v-model="formItem.orgCode" disabled  placeholder="请输入统一社会信用代码" style="width: 200px" ></Input>
                            </FormItem>
                            <FormItem label="管理员账号：" prop="adminAccount">
                                <Input v-model="formItem.adminAccount" disabled  placeholder="请输入管理员账号" style="width: 200px" ></Input><span style="margin-left: 10px;color: #999">请输入手机号，作为管理员登陆账号</span>
                            </FormItem>
                        </Form>
                    </TabPane>
                    <TabPane :label="label2" name="1" disabled>
                        <Form ref="formValiAccout" :model="formItem"  :rules="ruleValidate"  :label-width="130">
                            <FormItem label="开户行：" prop="bankName">
                                <Input v-model="formItem.bankName" placeholder="请输入开户行" style="width: 200px" ></Input>
                            </FormItem>
                            <FormItem label="账户：" prop="bankNo">
                                <Input v-model="formItem.bankNo" placeholder="请输入账户" style="width: 200px" ></Input>
                            </FormItem>
                            <FormItem label="纳税人名称：" prop="taxpayerName">
                                <Input v-model="formItem.taxpayerName" placeholder="请输入纳税人名称" style="width: 200px" ></Input>
                            </FormItem>
                            <FormItem label="纳税人识别号：" prop="taxpayerIdentiNum">
                                <Input v-model="formItem.taxpayerIdentiNum" placeholder="请输入纳税人识别号" style="width: 200px" ></Input>
                            </FormItem>
                            <FormItem label="账户类型：" >
                                <Checkbox :value="cash=='1' ? true : false "  @click.prevent.native="getSingle('1')">现金账户</Checkbox>
                                <Checkbox v-model="single" @click.prevent.native="getSingle('2')">授信账户</Checkbox>
                            </FormItem>
                            <FormItem label="授信额度：" prop="creditMoney" v-if="single">
                                <Input v-model="formItem.creditMoney" placeholder="请输入授信额度" :disabled="accountType != 1" :maxlength="10" style="width: 200px" ></Input>
                                <span style="margin-left: 5px">元</span>
                            </FormItem>
                            <div style="width: 200px; ;display: flex;justify-content:space-between">
                                <FormItem label="账单生成周期：" prop="billFrequency" >
                                    <Select style="width:90px;" clearable v-model="formItem.billFrequency" >
                                        <Option value="1">每月</Option>
                                    </Select>                      
                                </FormItem>
                                <FormItem style="margin-left: -120px"  prop="billDay" >
                                    <Select style="width:90px;" clearable v-model="formItem.billDay" >
                                        <Option v-for="item of 28 " :key="item" :value="String(item)">{{ item }}号</Option>
                                    </Select>                      
                                </FormItem>
                            </div>
                            <FormItem label="最迟结算日：" prop="billDealineDays" v-if="single" style="margin-top: 10px;">
                                <span style="margin-right: 5px">账单生成后</span><Input v-model="formItem.billDealineDays" placeholder="请输入" style="width: 50px" ></Input><span style="margin-left: 5px">日</span>
                            </FormItem>
                        </Form>
                    </TabPane>
                    <TabPane :label="label3" name="2" disabled>
                        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="130">
                            <FormItem label="合同：" >
                                <Upload 
                                multiple
                                :action="upBaseUrl" 
                                :on-success="handleSuccess"
                                :on-error="handleError"
                                :show-upload-list="false"
                                :headers="header"
                                >
                                    <Button type="primary" >上传文件</Button>
                                </Upload>
                               
                            </FormItem>
                            <FormItem label="合同有效期：" prop="validTime">
                                <DatePicker type="daterange" v-model="formItem.validTime" @on-change='selectDate' split-panels placeholder="请输入合同有效日期" style="width: 200px"></DatePicker>
                            </FormItem>
                            <FormItem label="文件：" >
                                <p v-for="(item,index) in formItem.contract" :key="index">
                                    <a  @click="downLoad(item.url)" >{{ item.name }}</a> 
                                </p>
                            </FormItem>
                        </Form>
                    </TabPane>
                </Tabs>
            </div>
            <div class="footer-button">
                <Button style="margin-right: 10px" @click="cancelClick" >取消</Button> 
                <Button type="primary" @click="prevCilck" style="margin-right: 10px" v-if="modeTabs > 0 " >上一步</Button>
                <Button type="primary" @click="nextCilck" style="margin-right: 10px" v-if="modeTabs != 2  " >下一步</Button>
                <Button type="primary" @click="successCilck" v-if="modeTabs == 2 ">完成</Button>
            </div>
        </Card>
    </div>
    
</template>
<script>
import {
    editCompany,
    getCompanyDetail
} from '@/api/company-api/company.js'

import {getToken} from '@/libs/util.js';



export default {
    data() {
        const validTime = (rule, value, callback) => {
            if(this.formItem.validTime[0]) callback()
            else callback(new Error('合同有效期不能为空'))
        }
        const validTele = (rule, val, callback) => {
            var reg = /^\d{3,4}-\d{7,8}$/; 
            if (!reg.test(val)){
                callback(new Error('请输入正确的固定电话'));
            } else {
                callback();
            }
        }
        const validNumber = (rule, val, callback) => {
            var reg=/(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1,2}$)/
            if (!reg.test(val)){
                callback(new Error('请输入正确得数字,并最多保留两位小数'));
            } else {
                callback();
            }
        }
        const validLast= (rule, val, callback) => {
            var reg = /^[0-9]+$/;
            if (!reg.test(val)) {
                callback(new Error('请输入正确的正整数'));
            } else {
                callback();
            }
        }
        return {
            modeTabs: '0',
            label1: '基础信息',
            label2: '账户信息',
            label3: '其他信息',
            upBaseUrl:this._baseUrl + '/common/uploadFile',
            ruleValidate: {
                name: [ { required: true, message: '企业名称不能为空', trigger: 'blur' }],
                address: [ { required: true, message: '企业地址不能为空', trigger: 'blur' }],
                telephone: [ { required: true, message: '企业电话不能为空', trigger: 'blur' },{validator: validTele, trigger: 'blur'}],
                orgCode: [ { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }],
                emergencyContact: [ { required: true, message: '紧急联系人不能为空', trigger: 'blur' }],
                emergencyContactPhone: [ { required: true, message: '紧急联系人电话不能为空', trigger: 'blur' },{validator: this.validatePhone, trigger: 'change'}],
                adminAccount: [ { required: true, message: '管理员账号不能为空', trigger: 'blur' },{validator: this.validatePhone, trigger: 'change'}],
                bankNo: [ { required: true, message: '账户不能为空', trigger: 'blur' }],
                bankName: [ { required: true, message: '开户行不能为空', trigger: 'blur' }],
                taxpayerName: [ { required: true, message: '纳税人不能为空', trigger: 'blur' }],
                taxpayerIdentiNum: [ { required: true, message: '纳税人识别号不能为空', trigger: 'blur' }],
                creditMoney: [ { required: true, message: '纳税人识别号不能为空', trigger: 'blur' }],
                billDealineDays: [ { required: true, message: '最后结算日不能为空', trigger: 'blur' },{validator: validLast, trigger: 'blur'}],
                creditMoney	: [ { required: true, message: '授信额度不能为空', trigger: 'blur' },{validator: validNumber, trigger: 'blur'}],
                billFrequency: [ { required: true, message: '账单生成周期不能为空', trigger: 'change' }],
                billDay:[{ required: true, message: '账单生成周期不能为空', trigger: 'change' }],
                validTime: [{ required: true},{validator: validTime, trigger: 'change'}],
            },
            cash: '1',
            single: false,
            header: {'Authorization': getToken()},
            formItem: {
               list: [
                    {
                        name: '',
                        phone: ''
                    }
                ],
                contract: []
            },
            accountType: null
            
            
        }
    },
    watch:{
         //监听相同路由下参数变化的时候，从而实现异步刷新
        '$route'(to,from){
             //做一些路由变化的响应
            this.init()
         },
     },
    mounted() {
        this.init()
    },
    methods: {
        validatePhone(rule, val, callback) {
            var reg = /^[0-9]{11,11}$/; 
            if (!reg.test(val)){
                callback(new Error('请输入正确的手机号码'));
            } else {
                callback();
            }
        },
        init() {
            let data = {
                uuid: this.$route.params.uuid
            }
            getCompanyDetail(data).then(res =>{
                res.data.data.list = this.arrSplit(res.data.data.contacts);
                this.accountType = res.data.data.accountType
                this.formItem = res.data.data;
                this.formItem.billDealineDays = String(this.formItem.billDealineDays)
                
                if(this.formItem.accountType == '3') {
                    this.single = true;
                }else{
                    this.single = false;
                }
                console.log(this.formItem.validTime)
                this.formItem.validTime = [this.formItem.contractEffictStart,this.formItem.contractEffictEnd];
                this.formItem.billFrequency = String(this.formItem.billFrequency)
                this.formItem.billDay = String(this.formItem.billDay)
                this.formItem.creditMoney = String(this.formItem.creditMoney)
            })
        },
        arrSplit(data) { //数据分割
			let arr =  data.split(";")
			let newArray = []
			arr.forEach( (item) =>{
				if('' != item) {
					newArray.push({
						name: item.split("_")[0],
						phone: item.split("_")[1]
					})
				}
			})
			return newArray;
		},
        handleSuccess(response, file, fileList) {
            this.formItem.contract.push({
                name: file.response.data.fileName,
                url: file.response.data.fileUrl
            });
            this.formItem.contract = this.formItem.contract.slice(0,5)
            if( this.formItem.contract.length > 5) this.$Message.error('最多上传五份合同');
            
        },  
        // getLabel(label, name) {
        //     return h => {
        //         return h(
        //             "div",
        //             {
        //                 style: {
        //                     padding: "8px 16px"
        //                 },
        //                 on: {
        //                 click: e => {
        //                     if( name == '1'){
        //                         let rule1 = false,rule2 =false;
        //                         this.$refs['ruleItem'].validate((valid)=>{
        //                             rule1 = valid;
        //                         })
        //                         this.$refs['formValiInfo'].validate((valid) =>{
        //                             rule2 = valid;
        //                         });
        //                         if(rule1 && rule2) this.modeTabs = name;
        //                         else e.stopPropagation();
        //                     }
        //                     if(name == '2') {
        //                         this.$refs['formValiAccout'].validate((valid) =>{
        //                             if(valid) this.modeTabs = name;
        //                             else e.stopPropagation();
                                        
        //                         });
                                        
        //                     }
        //                 }
        //             }
        //         },label)
        //     }
        // },
        handleError( error, file, fileList) {
           
        },
        downLoad(url){ // 下载
            window.location.href = url;
        },
        addContact(){
            this.formItem.list.push({
                name: '',
                phone: ''
            })
        },
        getSingle(value) {
            if( value == '2'){
                this.single =! this.single;
                if(this.single) {
                    this.formItem.accountType = '3'
                }else{
                    this.formItem.accountType = '1'
                }

            }else{
                this.cash = '1';
            }
        },
        selectDate(value) {
            if(value.length) {
                this.formItem.contractEffictStart = value[0];
                this.formItem.contractEffictEnd = value[1];
            }
        },
        nextCilck() {
            if( this.modeTabs == '0'){
                let bol;
                this.$refs['ruleItem'].validate((valid)=>{
                    bol = valid;
                })
                this.$refs['formValiInfo'].validate((valid) =>{
                    if(valid && bol) {
                        this.modeTabs = '1'
                    }
                });
            }else{
                this.$refs['formValiAccout'].validate((valid) =>{
                    if(valid) {
                        this.modeTabs = '2'
                    }
                });
            }
        },
        prevCilck() {
            if( this.modeTabs == '2'){
                this.modeTabs = '1'
            }else if(this.modeTabs == '1'){
                this.modeTabs = '0'
            }
        },
        successCilck() {
            var arr = []
            this.formItem.list.forEach( (item) =>{
                arr.push( `${item.name}_${item.phone};` )
            })
            this.formItem.contacts = arr.join('');
            this.formItem.uuid = this.$route.params.uuid;
            this.$refs['formValidate'].validate((valid) =>{
                if(valid) {
                   editCompany(this.formItem).then( (res) =>{
                        this.$router.push({
                            name: 'companyInfoManage'
                        });
                        this.$Message.success('修改成功');
                    })
                }
            });
            

        },
        cancelClick() {
            this.$router.push({
                name: 'companyInfoManage'
            })
        }
    }
}
</script>

<style>
    .companyWrap{
        width: 100%;
    }
    .companyWrap .ivu-tabs-nav .ivu-tabs-tab-disabled {
        color: #515a6e!important;
    }
    .companyWrap .footer-button{
        text-align: right;
        padding-right: 40px
    }
</style>

