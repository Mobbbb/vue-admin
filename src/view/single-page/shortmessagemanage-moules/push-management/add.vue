<template>
<div>
    <Card :bordered="false">
        <p slot="title">新增push</p>
        <Form :label-width="140" :model="pushForm" :rules="ruleValidate" ref="pushForm">
            <Row>
                <Col span="8">
                <FormItem label='push状态'>
                    <span>未推送</span>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8">
                <FormItem label='push标题' prop='title'>
                    <Input v-model="pushForm.title" placeholder="请输入"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8">
                <FormItem label='push副标题'>
                    <Input v-model="pushForm.subTitle" placeholder="请输入"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8">
                <FormItem label='发送对象' prop='pushRole'>
                    <Select v-model="pushForm.pushRole"  style="width:200px" @on-change ="handelChangeItem">
                        <Option v-for="(item,index) in roleTypes" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
             <Row>
                <Col span="8">
                <FormItem label='发送范围' v-if="pushForm.pushRole==2" prop='target'>
                    <RadioGroup v-model="pushForm.target" @on-change="handelChangeItem">
                        <Radio label = 1 >指定乘客</Radio>
                        <Radio label = 2> 指定条件</Radio>
                        <Radio label = 3>批量</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label='发送范围' v-if="pushForm.pushRole==1" prop='target'>
                    <RadioGroup v-model="pushForm.target" @on-change="handelChangeItem">
                        <Radio label = 1 >指定司机</Radio>
                        <Radio label = 2> 指定条件</Radio>
                        <Radio label = 3 >批量</Radio>
                    </RadioGroup>
                </FormItem>
                </Col>
             </Row>
            
             <Row>
                <Col span="8">
                    <FormItem  v-if="pushForm.pushRole== 1 && pushForm.target == 1  " prop='pushRangeDetail'>
                        <Input v-model="mobileStr" type="textarea" placeholder="请输入司机手机号，以英文逗号隔开"  @change.native="changeCommaToArr()"/>
                    </FormItem>
                    <FormItem  v-if="pushForm.pushRole== 2 && pushForm.target == 1  " prop='pushRangeDetail'>
                        <Input v-model="mobileStr" type="textarea" placeholder="请输入乘客手机号，以英文逗号隔开" @change.native="changeCommaToArr()"/>
                    </FormItem>

                    <FormItem label='' v-if="pushForm.pushRole == 1 && pushForm.target == 2  " >
                        <input type="hidden" v-model="pushForm.operatorName">
                        <TreeInput  
                        :TreeData= 'opGroup' 
                        :parentData.sync = "targetGroup"
                        :parentKeyData.sync = 'targetGroup2' 
                        :position= "position1" 
                        :selectAll='true'  > </TreeInput>
                        <!-- <Cascader :data="opGroup" v-model="targetOpGroup" @on-change="test"></Cascader> -->
                    </FormItem>
                    <FormItem label='' v-if="pushForm.pushRole== 2 && pushForm.target == 2 " >
                        <input type="hidden" v-model="pushForm.cityName">
                        <TreeInput  
                            :TreeData= 'userGroup' 
                            :parentData.sync = "targetGroup" 
                            :position= "position1" 
                            :selectAll ='true' 
                            IndexId='cityID'
                            title="city"
                            allTitle="全部已开通城市"
                            :parentKeyData.sync = 'targetGroup2'
                            ref="treeInput">
                        </TreeInput>
                    </FormItem>
                    <FormItem v-if=" pushForm.target == 3 " >
                        <ImportFile
                            :toDownTemplateUrl='downloadUrl'  
                            :importFileUrl='importUrl'
                            @on-success='uploadSuc'>
                        </ImportFile>
                        <span v-show="pushForm.uploadFileUrl">已上传</span>
                    </FormItem>
                </Col>
             </Row>
              <Row>
                <Col span="8">
                    <FormItem label='业务类型' style="display:inline-block;" v-if="pushForm.pushRole==1 && pushForm.target ==2 ">
                        <Select v-model="pushForm.businessType" multiple clearable filterable style="width:200px">
                        <Option v-for="(item, index) in businessTypes" :value="item.value" :key="index">{{ item.text }}</Option>
                        </Select>
                    </FormItem>
                </Col>
             </Row>
            <Row>
                <Col span="8">
                <FormItem label='性别' v-if="pushForm.target == 2" prop='sex'> 
                    <Select v-model="pushForm.sex" style="width:200px">
                        <Option v-for="(item,index) in sexList" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                </Col>
                <!-- <Col span="8"> <span>dfd{{rangeIds}}</span></Col> -->
            </Row>
            <Row>
                <Col span="8">
                <FormItem label='跳转链接（非必填）'>
                    <Input v-model="pushForm.pushLink" placeholder="请输入"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8">
                <FormItem label='推送时间（必填）' prop='pushTime'>
                    <DatePicker type="datetime" v-model="pushForm.pushTime" format="yyyy-MM-dd HH:mm" placeholder="" :options="timeOptions"  :disabled-hours="[1,5,10]" style="width: 200px"></DatePicker>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8"  offset="4">
                <Button type="primary" @click="handleSave('pushForm')">保存</Button>
                 <Button  :style="{'marginLeft': '10px'}" @click="backOneStep">返回</Button>  
                </Col>
            </Row>
        </Form>
    </Card>
</div>
</template>

<script>
// import {treeDataTranslate} from '@/libs/tools.js'
import TreeInput from '_a/treeInput/treeInput.vue'
import ImportFile from '_a/import-file/index.vue'
import { addPush } from '@/api/announcement.js'
import { getCityOperatorTree, getCitys } from '@/api/common.js'
import {changeKeyMethod} from '@/libs/tools.js'

export default {
    name:'add-push',
    components: {TreeInput,ImportFile},
    data() {
        const validateNN = (rule, value, callback) => {
            if(value !== '') callback()
            else callback(new Error('不得为空'))
        }
        const validateNExist = (rule, value, callback) => {
           if(!value) 
            {callback(new Error('不得为空'))}
            else callback()
        }
        return {
            arr: [],
            targetGroup:[],
            targetGroup2:[],
            targetOpGroup: [],
            mobileStr:'',
            downloadUrl: '/admin/system/push/getExcel',
            importUrl: '/admin/system/push/importExcel',
            pushForm: {
                // targetGroup: ''
            },
            roleTypes: [
                {
                    label: '司机',
                    value: 1
                },
                {
                    label: '乘客',
                    value: 2
                }
            ],
            sexList: [{
                    label: '全部',
                    value: '1'
                },
                {
                    label: '男',
                    value: '2'
                },{
                    label: '女',
                    value: '3'
                }],
            businessTypes: [
                {
                text: '出租车',
                value: 1
                },
                {
                text: '专车',
                value: 2
                },
                {   
                text: '跨域',
                value: 3
                },
                {
                text: '快车',
                value: 4
                }
            ],
            ruleValidate: {
                title: [
                        { required: true, message: '请填写', trigger: 'blur' }
                    ],
                pushRole: [
                        { required: true, validator: validateNExist, trigger: 'blur' }
                    ],
                pushTime:[
                        { required: true, validator: validateNExist, trigger: 'blur' }
                    ],
                target: [
                        { required: true, validator: validateNExist, trigger: 'blur' }
                    ],
                operatorName:[
                        { required: true, message: '请填写', trigger: 'blur' }
                    ],
                cityName:[
                        { required: true,  validator: validateNN, trigger: 'change' }
                    ],
                businessType:[
                     {required: true, validator: validateNExist, trigger: 'blur'}
                ],
                sex:[
                     {required: true, validator: validateNExist, trigger: 'blur'}
                ]
            },
            timeOptions:{
                disabledDate (date) {
                    return date && date.valueOf() < Date.now()-86400001
                }
            },
            position1: 'right-start',
            dropVisible: false,
            userList: [],
            selectItems: [],
            userGroup:  [],
            opGroup: []
        }
    },
    computed: {
        // 转换id
        rangeIds: function(){
            let str = ''
            let station = []
            station = this.targetGroup
            if(this.targetGroup.indexOf('_000') != -1){
                station = ['_000']
            }
            return station
        },
        // 转换key
        rangeKeys: function(){
            let str = ''
            let station = []
            station = this.targetGroup2
            if(station.indexOf('全部') != -1){
                station = ['全部']
            }
            return station
        },
    },
    created() {
        this.getCitys()
        this.getOperatorsList()
        this.pushForm = {}
    },
    beforeRouteEnter  (to, from, next) {
        next(vm =>{
            vm.pushForm = {}
            vm.$refs.pushForm.resetFields()
            vm.$forceUpdate()
        })
    },
    methods: { 
        getCitys() { // 获取已开通城市list
            getCitys().then(res => {
                this.userGroup = res.data.data
            })
        },
        //获取运营商列表
        getOperatorsList () {
            getCityOperatorTree().then(res =>{
                let oriData = res.data.data
                changeKeyMethod (oriData)
                changeKeyMethod(oriData,'uuid','value')
                this.opGroup = oriData
            })
        },
        handleBulk(val){
            this.pushForm.pushRangeDetail = ''
            this.pushForm.pushRangeIds = ''
        },
        handelChangeItem(){
            this.targetGroup = []
            this.targetGroup2 =[]
        },
        backOneStep(){
            this.$router.go(-1)
        },
        uploadSuc(res){
            this.pushForm.uploadFileUrl = res.data
        },
        //新增push
        changeCommaToArr(){
            let str = this.mobileStr
            let arr = str.split(',')
            this.pushForm.mobile = arr
        },
        handleSave(name){
            //指定条件时赋值
            if(this.pushForm.target==2 && this.pushForm.pushRole ==1){
                this.pushForm.operatorUuid = this.rangeIds
                this.pushForm.operatorName = this.rangeKeys
            }
            if(this.pushForm.target ==  2 && this.pushForm.pushRole ==2) {
                this.pushForm.cityId = this.rangeIds
                this.pushForm.cityName = this.rangeKeys
            }
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let data = JSON.parse(JSON.stringify(this.pushForm))
                    data.pushTime = Date.parse(data.pushTime)
                    data.target = Number(data.target)
                    addPush(data).then(res =>{
                        this.$Message.success('保存成功!')
                        this.$router.push({name:'push-center'})
                    })
                } else {
                    this.$Message.error('请完成表单!');
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.dropShower {
    display: inline-block;
    width: 300px;
    min-height: 36px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    color: #515a6e;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;

    ul li {
        height: 24px;
        line-height: 22px;
        margin: 3px 4px 3px 0;
        display: inline-block;
        line-height: 22px;
        padding: 0 8px;
        border: 1px solid #e8eaec;
        border-radius: 3px;
        background: #f7f7f7;
        font-size: 12px;
        vertical-align: middle;
        opacity: 1;
        overflow: hidden;
        cursor: pointer;

        span {
            color: #515a6e;
        }

        i {
            font-size: 16px;
        }
    }
}
</style>
