<!--准驾司机列表-->
<template>
    <div>
        <div v-if="loading" style="height: 666px;" class="table-spin-wrap">
            <Spin fix>
                <Icon type="ios-loading" size=20 class="table-spin-icon-load"></Icon>
                <div style="margin-top: 5px;">加载中...</div>
            </Spin>
        </div>
        <div v-else>
            <Card v-for="(item,index) in list" :key="index">
                <Row>
                    <Col span="5">
                        <div class="circlebox">
                            <img v-bind:src="item.photo" alt="" width="100%" height="100%">
                        </div>
                        <div class="info">
                            <span class="premire" v-if="item.businessType==2"> 
                               专车
                            </span>
                            <span class="premire" v-if="item.businessType==4"> 
                               快车
                            </span>
                            <br>
                            <span>司机姓名 {{item.name}}</span>
                            <br>
                            <a @click="goToDetail(item.uuid)">查看详情</a>
                            <a @click="handleEdit(item)" style="marginLeft:15px">授权编辑</a>
                            <!-- <a @click="handleCancel(item)" style="marginLeft:15px">解绑司机</a> -->
                        </div>
                    </Col>
                </Row>
                <Row :style="{marginTop:'20px'}">
                    <Col span="8">
                         <span>准驾时间段: {{item.authorizationStart}} ~  {{item.authorizationEnd}}</span>
                    </Col>
                    <Col span="8">
                         <span>联系电话: {{item.mobile}} </span>
                    </Col>
                    <Col span="8">
                         <span>身份证 {{item.identityCardNumber}}</span>
                    </Col>
                </Row>
            </Card>
            <div v-if="list.length == 0" class="no-data-text">
                暂无数据
            </div>
        </div>
        <Page 
            show-total
            :total="totalCount" 
            :current="currPage" 
            :page-size="pageSize"  
            @on-change="changePage" 
            style="float: right;margin: 20px 0;"/>
        <Modal 
            v-model="authModal" 
            title="司机授权"  
            width="540"
            :mask-closable="false">
            <Form :model="driverForm" ref="driverForm" :rules="ruleDriverForm" :label-width='145'>
                <FormItem  label="司机身份证号:" prop='identityCardNumber'>
                    <span>{{driverForm.identityCardNumber}}</span>
                </FormItem>
                <FormItem  label="司机姓名：" prop='identityCardNumber'>
                    <span >{{driverForm.name}} </span> 
                </FormItem>
                <FormItem  label="准驾开始时间：" prop='identityCardNumber'>
                    <span >{{driverForm.authorizationStart}} </span> 
                </FormItem>

                 <FormItem label="选择授权结束时间段：" prop= 'authEndTime'>
                      <DatePicker v-if="authModal" 
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss" 
                      placeholder="选择时间" 
                      style="width: 300px" 
                      :options= "options3"  
                      @on-change="timePicker"></DatePicker>
                 </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="submitDriver('driverForm')">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {getAuthorizedDriver,handleDriverAuth} from '@/api/vehicle.js'

export default {
    mounted(){
        this.getData()
    },
    data(){
        const validateIDCheck = (rule, value, callback) => {
            let reg =  /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
            if (value === '') {
                callback(new Error('请输入身份证号'));
            } else if (reg.test(value)===false) {
                callback(new Error('请输入正确的身份证号'));
            } else {
                callback();
            }
        };
        const validateEnd= (rule, value, callback) => {
            let timestamp = Date.parse(new Date());
            if (this.driverForm.authEndTime === '' || this.driverForm.authEndTime === null ||this.driverForm.authEndTime === undefined) {
                callback(new Error('请输入'));
            } else if(Date.parse(this.driverForm.authEndTime) < timestamp){
                callback(new Error('不得小于当前时间'));
            } 
            else {
                callback();
            }
        }
        return {
            list:[],
            loading: true,
            totalCount: null,
            pageSize: 3,
            currPage: 1,
            authModal:false,
            driverForm: {},
            ruleDriverForm:{
                authEndTime:[
                    {required: true, validator: validateEnd, trigger: 'blur'}
                ],
            },
            options3: {
                disabledDate (date) {
                    let today= new Date()
                    let h = today.getHours()*3600000
                    let m = today.getMinutes()*60000
                    let overTime = h + m
                    return date && date.valueOf() < Date.now()- 86400000 ;
                }
            },
        }
    },
    methods:{
        getData(){
            let data ={
                currPage: this.currPage,
                pageSize: this.pageSize,
                vin: this.$route.params.id
            }
            this.loading = true
            getAuthorizedDriver(data).then(res=>{
                this.loading = false
                this.list = res.data.data.list
                this.currPage = res.data.data.currPage
                this.totalCount = res.data.data.totalCount
            })
        },
        goToDetail(id){
            this.$router.push({name:'staff-detail',params:{id:id}})
        },
        changePage(val){
            this.currPage = val
            this.getData()
        },
        //编辑
        handleEdit(item){
            this.authModal = true
            this.driverForm = item
        },
        handleCancel(){
            this.$Modal.confirm({
                title: '解绑司机',
                maskClosable:false,
                content: '<p>确认解绑该司机？</p>',
                onOk: () => {
                    this.$Message.info('解绑成功');
                },
                onCancel: () => {
                    this.$Message.info('已取消');
                }
            });
        },
        timePicker(date){
            this.driverForm.authEndTime = date
        },
        submitDriver(name){
            let data = {}
            data.vin = this.$route.params.id
            data.identityCardNumber = this.driverForm.identityCardNumber
            data.authStartTime = this.driverForm.authorizationStart
            data.authEndTime = this.driverForm.authEndTime
            this.$refs[name].validate((valid) => {
                if(valid){
                    handleDriverAuth(data).then(res=>{
                        this.$Message.success('授权成功')
                        this.authModal = false
                    })
                }
            })
        }     
    }
}
</script>
<style lang="less" scoped>
    .circlebox{
        width: 80px;
        height: 80px;
        border-radius: 40px;
        overflow: hidden;
        float: left;
    }
    .info{
        float: left;
        margin-left: 20px
    }
    .premire{
        background-color: rgba(24, 144, 255, 1);
            border-radius: 4px;
            color: #FFFFFF;
            padding: 3px
    }
    .table-spin-wrap{
        position: relative;
        border: 1px solid #e8eaec;
    }
    .table-spin-icon-load{
        animation: ani-table-spin 1s linear infinite;
    }
    .no-data-text{
        text-align: center;
        height: 666px;
        line-height: 666px;
        border: 1px solid #e8eaec;
    }
</style>
