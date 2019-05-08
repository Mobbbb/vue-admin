<template>
    <div>
        <Form ref="formValidate" :model="params" :rules="ruleUser" :label-width="100">
            <FormItem label="运营商：" prop="name">
                <Input clearable v-model="params.name" placeholder="请输入运营商名称"></Input> 
            </FormItem>
            <FormItem label="所属机构：" prop="organItem">
                <Cascader
                    :disabled="type === 'add' ? false : true"
                    change-on-select
                    :data="organList"
                    v-model="params.organItem"
                    placeholder="请选择所属机构"> 
                </Cascader>
            </FormItem>
            <FormItem label="运营区域：" prop="carrierArea">
                <Cascader 
                    :data="cityList"
                    :clearable="false"
                    v-model="params.carrierArea"
                    placeholder="请选择运营区域">  
                </Cascader>
            </FormItem>
            <FormItem label="联系电话：" prop="mobileList">
                <div v-for="(item, index) in params.mobileList" class="mobile-wrap" :key="index">
                    <numberInput v-model="item.area" class="area-number no-arrow" placeholder="区号" :max="4"></numberInput>
                    <span class="link-mobile">--</span>
                    <numberInput v-model="item.number" class="real-number no-arrow" placeholder="请输入手机或电话号码" :max="13"></numberInput>
                </div>
            </FormItem>
            <FormItem label="邮箱：" prop="email">
                <Input clearable v-model="params.email" placeholder="请输入邮箱地址"></Input> 
            </FormItem>
            <FormItem label="运营商账号：" prop="accountNumber">
                <Input v-model="params.accountNumber" placeholder="请输入运营商账号" :disabled="editorstatus"></Input>
            </FormItem>
            
            <FormItem label="地址：" prop="address" style="width: 400px;">
                <Input clearable v-model="params.address" placeholder="请输入地址"></Input>
            </FormItem>
            <FormItem label="面试地址：" prop="addressList" style="width: 400px;margin-bottom: 0;">
                <div v-for="(item, index) in params.addressList" class="addressList-wrap" :key="index">
                    <Input clearable v-model="item.address" placeholder="请输入面试地址"></Input> 
                    <span v-if="index" class="iconfont icon-delete" @click="deleteConfig(index)"></span>
                </div>
            </FormItem>
            <div class="add-list-btn" style="margin-left: 100px;" @click="addConfig">添加面试地址</div>
        </Form>
        <div class="popView-footer-wrap">
            <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
            <Button size="large" type="primary" @click="commit(1)">确定</Button>
        </div>
    </div>
</template>

<script>
import '@/styles/cyk-style.css'
import '@/styles/icon-font/iconfont.css'
import numberInput from '_c/number-input/number-input'
import { regTest, changeListKey, treeDataTranslate, getAllParentsId } from '@/libs/tools'
import { addCarrier, editCarrier, getCarrierInfo, getAllOrgan } from '@/api/operator-carrier'

export default {
    components: {
        numberInput
    },
    props: {
        popView: Boolean,
        type: String,
        uuid: {
            default: '',
            type: String
        },
        cityList: {
            default: () => {
                return []
            },
            type: Array
        }
    },
    data () {
        const mobileList = (rule, value, callback) => {
            let temp = false, flag = true
            value.forEach(function(item, index){
                if((item.area !== '' || item.number !== '') && (item.area !== null || item.number !== null)) {
                    if(!regTest(item.number, 'phone&mobile')) flag = false
                }
                if(item.area !== '' && item.area !== null && item.number !== '') temp = true // 存在一条不为空
            })
            if(temp && flag) callback()
            else if (!temp) callback(new Error('至少填写一个联系电话'))
            else callback(new Error('输入的号码格式不正确'))
        }
        const addressList = (rule, value, callback) => {
            let temp = true
            value.forEach(function(item, index){
                if(item.address === '') temp = false
            })
            if(temp) callback()
            else callback(new Error('请填写面试地址'))
        }
        const carrierArea = (rule, value, callback) => {
            if(this.params.carrierArea.length > 0) callback()
            else callback(new Error('运营区域不得为空'))
        }
        const email = (rule, value, callback) => {
            if(regTest(value, 'email')) callback()
            else callback(new Error('请填写正确的邮箱'))
        }
        const organItem = (rule, value, callback) => {
            if(this.params.organItem.length > 0) callback()
            else callback(new Error('组织机构不得为空'))
        }
        return {
            searchList: [],
            organList: [],
            params: {
                carrierArea: [],
                addressList: [
                    {address: ''}
                ],
                mobileList: [
                    {area: '', number: ''},
                    {area: '', number: ''},
                    {area: '', number: ''}
                ]
            },
            ruleUser: {
                name: [{
                    required: true, trigger: 'change', message: '运营商名称不得为空'
                }],
                carrierArea: [{
                    required: true, trigger: 'change', validator: carrierArea
                }],
                email: [{
                    required: true, trigger: 'change', validator: email,
                }],
                accountNumber: [{
                    required: true, trigger: 'change', message: '运营商账号不得为空'
                }],
                address: [{
                    required: true, trigger: 'change', message: '地址不得为空'
                }],
                addressList: [{
                    required: true, validator: addressList, trigger: 'change'
                }],
                mobileList: [{
                    required: true, validator: mobileList, trigger: 'change'
                }],
                organItem: [{
                    required: true, validator: organItem, trigger: 'change'
                }],
            },
            editorstatus: false
        }
    },
    watch: {
        'popView': function(){
            if(this.popView){
                if(this.type === "add"){
                    this.params = {
                        carrierArea: [],
                        addressList: [
                            {address: ''}
                        ],
                        mobileList: [
                            {area: '', number: ''},
                            {area: '', number: ''},
                            {area: '', number: ''}
                        ]
                    }
                    this.editorstatus = false
                } else {
                    this.editorstatus = true
                    this.getCarrierInfo()
                }
            }
            this.$refs.formValidate.resetFields()
        }
    },
    mounted() {
        this.getAllOrgan()
    },
    methods: {
        getAllOrgan: function(){
            getAllOrgan({}).then(res => {
                let data = res.data.data
                this.searchList = JSON.parse(JSON.stringify(data))
                changeListKey(data, 'name', 'label')
                changeListKey(data, 'id', 'value')
                this.organList = treeDataTranslate(data)
            })
        },
        deleteConfig: function(index){
            this.params.addressList.splice(index, 1)
            this.$refs.formValidate.validateField('addressList')
        },
        addConfig: function(){
            if(this.params.addressList.length < 3){
                this.params.addressList.push({address: ''})
            } else {
                this.$Message.warning('最多可添加3个面试地址')
            }
        },
        getCarrierInfo: function(){
            getCarrierInfo({uuid: this.uuid}).then(res => {
                let length = res.data.data.mobileList.length
                res.data.data.carrierArea = [res.data.data.provinceId, res.data.data.cityCode]
                res.data.data.addressList = res.data.data.interviewAddressList
                res.data.data.organItem = getAllParentsId(this.searchList, res.data.data.organId)
                this.params = res.data.data
                for(let i = 0; i < (3 - length); i++){
                    this.params.mobileList.push({
                        area: '',
                        number: ''
                    })
                }
            })
        },
        commit: function(temp){
            if(temp){
                this.$refs.formValidate.validate().then(res => {
                    let params = JSON.parse(JSON.stringify(this.params))
                    params.cityId = this.params.carrierArea[1]
                    params.interviewAddressList = this.params.addressList
                    params.organId = this.params.organItem[this.params.organItem.length-1]
                    if(res){
                        for(let i = 0; i < params.mobileList.length; i++){
                            if(params.mobileList[i].area === '' || params.mobileList[i].area === null) {
                                params.mobileList.splice(i, 1)
                                i --
                            }
                        }
                        if(this.type === 'add'){
                            addCarrier(params).then(res => {
                                this.$Message.success('添加成功')
                                this.$emit('on-confirm', 1)
                            })
                        } else {
                            params.uuid = this.uuid
                            editCarrier(params).then(res => {
                                this.$Message.success('修改成功')
                                this.$emit('on-confirm', 1)
                            })
                        }
                    }
                })           
            } else {
                this.$emit('on-confirm')
            }
        }
    }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped> 
    .mobile-wrap{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        position: relative;
    }
    .mobile-wrap:last-child{
        margin-bottom: 0;
    }
    .icon-delete{
        font-size: 14px;
        position: absolute;
        right: -25px;
    }
    .icon-delete:hover{
        cursor: pointer;
    }
    .link-mobile{
        display: block;
        width: 20px;
        height: 22px;
        line-height: 22px;
        text-align: center;
    }
    .real-number{
        width: 200px;
    }
    .area-number{
        width: 100px;
    }
    .addressList-wrap{
        margin-bottom: 15px;
    }
</style>
