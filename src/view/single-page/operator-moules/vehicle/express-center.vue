<!--车辆管理主页-->
<template>
    <div class="container_box">
        <Row>
            <search-list
                :inputList="inputList"
                @on-search="handelSearch"
                @on-reset="reset">  
            </search-list>
        </Row>
        <Row>
            <Col span="4" >
                <!--<Col span="8">
                    <ImportFile 
                        importFileUrl="/admin/carManager/importCar"  
                        btnText="导入" 
                        toDownTemplateUrl="/download/carImportTemplate.zip" 
                    > 
                    </ImportFile>
                </Col>
                <Button :style="{marginLeft:'10px'}" type="primary" @click="exportList"> 导出 </Button>-->
            </Col>
        </Row>
        <Row :style="{marginTop:'20px'}">
            <VTable
                :total="total"
                :current="current"
                :pageSize="pageSize"
                :parColumns="carColumn"
                :parTableData="carList"
                 @changePage="changePage"
                @changePageSize="changePageSize">
            </VTable>
        </Row>
        <Modal v-model="statusModal">
            <div slot="header" class="someHeader">
                <span class="someHeaderh">车辆状态</span>
                <span class="pd-lf-20">{{currentTime}}</span>
            </div>
            <Form :model="statusForm" :label-width="150">
                <FormItem  label="剩余电量：" v-if="fuelType== 'C' || fuelType== 'O'">
                    <span>{{statusForm.soc}} %</span>
                </FormItem>
                <FormItem  label="剩余油量：" v-if="fuelType== 'A' || fuelType== 'O' || fuelType== 'B' ">
                    <span>{{statusForm.gasRemain}} </span>
                </FormItem>
                <FormItem  label="续航里程（km）：">
                    <span>{{statusForm.enduranceMileage}}</span>
                </FormItem>
                <FormItem  label="总行驶里程（km）：">
                    <span>{{statusForm.totalMileage}}</span>
                </FormItem>
                <FormItem  label="当前车速（km/h）：">
                    <span>{{statusForm.speed}}</span>
                </FormItem>
                <FormItem  label="空调使用情况：">
                    <span></span>
                </FormItem>
                <FormItem  label="车内温度（℃）：">
                    <span>{{statusForm.tempInCar}}</span>
                </FormItem>
                <FormItem  label="当前位置：">
                    <a @click="showMap">查看地图</a>
                </FormItem>
            </Form>
        </Modal>
        <Modal 
            v-model="authModal" 
            title="司机授权"  
            width="340"
            :mask-closable='false'>
            <Form :model="driverForm" ref="driverForm" :rules="ruleDriverForm">
                <FormItem  label="司机身份证号:" prop='identityCardNumber'>
                    <Input v-model="driverForm.identityCardNumber"> </Input>
                    <span v-if="getDriverName">司机姓名：{{preDriveName}} 
                        <span v-if="!preDriveName">{{preDriverError}}</span>
                    </span> 
                </FormItem>
                 <FormItem label="选择授权开始时间段" prop= 'authEndTime'>
                      <DatePicker v-if="authModal" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间" style="width: 300px" @on-change="timePicker" :options= "options3" ></DatePicker>
                 </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="submitDriver('driverForm')">确定</Button>
            </div>
        </Modal>
        <Modal v-model="contrlModal" title="远程控制" :mask-closable = false >
            <Row type="flex" justify="center" align="middle" :style="{marginTop:'10px'}">
                <Col span='12'>
                    <div class="mid-sty">
                        <div>中控锁 </div>
                        <div class="round-img" style="marginTop: 20px">
                            <img :src="clock">
                        </div>
                        <div style="marginTop: 20px">
                            <ButtonGroup size="large">
                                <Button v-if="!openFlag.centerLock" type="primary" @click="turnOn(0,'centerLock','落锁',2)">落锁</Button>
                                <Button v-if="openFlag.centerLock"  @click="turnOn(0,'centerLock','落锁',2)">落锁</Button>
                                <Button v-if="openFlag.centerLock" type="primary" @click="turnOn(1,'centerLock','开锁',2)">开锁</Button>
                                <Button  v-if="!openFlag.centerLock"  @click="turnOn(1,'centerLock','开锁',2)">开锁</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </Col>
                <Col span='12'>
                    <div class="mid-sty">
                        <div>允许启动 </div>
                        <div class="round-img" style="marginTop: 20px">
                            <img :src="close" alt="" >
                        </div>
                        <div style="marginTop: 20px">
                            <ButtonGroup size="large">
                                <Button v-if="!openFlag.allowed" type="primary" @click="turnOn(0, 'allowed', '关闭允许启动',3)">关闭</Button>
                                <Button v-if="openFlag.allowed"  @click="turnOn(0, 'allowed', '关闭允许启动',3)">关闭</Button>
                                <Button v-if="openFlag.allowed" type="primary" @click="turnOn(1, 'allowed', '开启允许启动',3)">开启</Button>
                                <Button  v-if="!openFlag.allowed"  @click="turnOn(1, 'allowed', '开启允许启动',3)">开启</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle" :style="{marginTop:'10px'}">
                <!-- <Col span='12'>
                    <div class="mid-sty">
                      <div>空调 </div>
                      <div class="round-img" style="marginTop: 20px">
                          <img :src="firgent" alt="" >
                      </div>
                      <div style="marginTop: 20px">
                            <ButtonGroup size="large">
                                <Button v-if="!openFlag.aircondition" type="primary" @click="turnOn(0, 'aircondition', '关闭空调')">关闭</Button>
                                <Button v-if="openFlag.aircondition"  @click="turnOn(0, 'aircondition', '关闭空调')">关闭</Button>
                                <Button v-if="openFlag.aircondition" type="primary" @click="turnOn(1, 'aircondition', '开启空调')">开启</Button>
                                <Button  v-if="!openFlag.aircondition"  @click="turnOn(1, 'aircondition', '开启空调')">开启</Button>
                            </ButtonGroup>
                      </div>
                  </div>
                </Col> -->            
                <Col span='12'>
                    <div class="mid-sty">
                        <div>一键鸣笛 </div>
                        <div class="round-img" style="marginTop: 20px">
                            <img :src="noise" alt="" >
                        </div>
                        <div style="marginTop: 20px">
                            <ButtonGroup size="large">
                                <Button v-if="openFlag.flashLight" type="primary" @click="turnOn(0, 'flashLight', '关闭一键鸣笛',1)">关闭</Button>
                                <Button v-if="!openFlag.flashLight"  @click="turnOn(1, 'flashLight', '开启一键鸣笛',1)">开启</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </Col>
                <Col span='12'></Col>
            </Row>
            <div slot="footer"></div>
        </Modal>
        <Modal v-model="showPosition" width="630">
            <Amap v-if="showPosition" :pit='exactPosition'></Amap>
        </Modal>
    </div>
</template>

<script>
import {
    getVehicleList,
    exportCars, 
    getDriverWholeName,
    handleDriverAuth,
    getRealTimeStatus,
    controlCar 
} from '@/api/vehicle.js'
import axios from 'axios'
import fileDownload from 'js-file-download'
import Amap from './detailContent/amap.vue'
import clock from '@/assets/images/optcontrol/clock.png'
import close from '@/assets/images/optcontrol/close.png'
import firgent from '@/assets/images/optcontrol/firgent.png'
import noise from '@/assets/images/optcontrol/noise.png'

export default {
    name: "express-center",
    components: {
        Amap
    },
    props:{
        bussinessType: String
    },
    computed:{
        getDriverName:function (){
            if(this.driverForm.identityCardNumber.length==18){
                let data = {identityCardNumber: this.driverForm.identityCardNumber} 
                getDriverWholeName(data).then(res=>{
                    if(res.data.success){
                        this.preDriveName = res.data.data
                        if(this.preDriveName == ''){
                            this.preDriverError = '无此司机信息'
                        }
                    }else{
                        this.preDriverError = res.data.msg
                    }
                })
                return true
            }else{
                return false
            }
        }
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
            } else if(Date.parse(this.driverForm.authStartTime) < timestamp){
                callback(new Error('不得小于当前时间'));
            } 
            else {
                callback();
            }
        }
        return {
            noise:noise,
            clock:clock ,
            firgent:firgent,
            close:close,
            currentTime: '',
            statusModal: false,
            authModal: false,
            contrlModal: false,
            showPosition: false,
            openFlag:{
                centerLock:false,
                allowed:false,
                aircondition:false,
                flashLight:false
            },
            searchParams: {},
            statusForm: {},
            exactPosition:[],
            fuelType:'',
            seletedCarVin:'',
            actionFlag:null,
            total: null,
            current: 1,
            pageSize: 10,
            isUpLoading: false,
            inputList: [
                 {
                    name: 'cascader-input',
                    inputWidth:'200',
                    key: 'operatorName',
                    bind_key: ['provinId', 'cityId' ,'agentUuid'],
                    cascaderList: [],
                    placeholder: '请选择运营商',
                    value: [],
                    title: '所属运营商：',
                    titleWidth: 80,
                    unicode: '1',
                    isHide: false
                },
                {
                    name: 'text-input',
                    bind_key: 'otherIndex',
                    placeholder: '请输入VIN码、车牌号',
                    value: '',
                    title: '其他：',
                    titleWidth: 80,
                    unicode: '1',
                    isHide: false
                },
            ],
            carColumn:[
                {
                    title:'序号',
                    key: 'xxxx',
                    width: 70,
                    fixed: 'left',
                    render: (h, params) =>{
                        return h('div', this.pageSize*(this.current-1) + params.index + 1)
                    }
                },
                {
                    title: '车牌号',
                    key: 'plateNumber',
                    tooltip: true,
                    minWidth: 100,
                    fixed: 'left'
                },
                {
                    title: '所属运营商',
                    tooltip: true,
                    key: 'operator',
                    minWidth: 150
                },
                {
                    title: '车辆业务类型',
                    key: 'businessType',
                    tooltip: true,
                    minWidth: 150,
                    render: (h,params) =>{
                        return h('div',[
                            h('span',{
                                style:{
                                    display: params.row.businessType === 1 ? 'inline-block': 'none' 
                                }
                            },'出租车'),   
                            h('span',{
                                style:{
                                    display: params.row.businessType === 2 ? 'inline-block': 'none' 
                                }
                            },'专车'), 
                            h('span',{
                                style:{
                                    display: params.row.businessType === 3 ? 'inline-block': 'none' 
                                }
                            },'跨城'),
                            h('span',{
                                style:{
                                    display: params.row.businessType === 4 ? 'inline-block': 'none' 
                                }
                            },'快车'),
                        ])
                    }
                },
                {
                    title: '车架号',
                    key: 'vin',
                    tooltip: true,
                    minWidth: 150
                },
                {
                    title: '颜色',
                    tooltip: true,
                    minWidth: 150,
                    key: 'colour'
                },
                {
                    title: '车辆状态',
                    key: 'status',
                    tooltip: true,
                    minWidth: 150,
                    render:(h,params) =>{
                        return h('span',{
                            style:{
                                color: '#1890FF',
                                cursor: 'pointer'
                            },
                            on:{
                                click: () =>{
                                    this.getCurrentTime(params.row)
                                }
                            }
                        },'查看')
                    }
                },
                {
                    title: '操作',
                    key: 'actions',
                    width: 300,
                    fixed: 'right',
                    render: (h,params) =>{
                        return h('div',[
                            h('Button',{
                                props: {
                                    type: "info",
                                    ghost: true,
                                    size: "small"
                                },
                                directives: [{
                                    name: 'hasAuth',
                                    value: 'vehicle-center-detail'
                                }],
                                style:{
                                    marginRight: '15px',
                                },                         
                                 on:{
                                    click:()=>{
                                        let id = params.row.vin
                                        this.$router.push({name: 'vehicle-detail', params: { id:id }})
                                    }
                                }
                            },'详情'),
                            /*h('Button',{
                                props: {
                                    type: "warning",
                                    ghost: true,
                                    size: "small"
                                },
                                style:{
                                    marginRight: '15px',
                                },
                                on:{
                                    click:()=>{
                                        let id = params.row.vin
                                        this.$router.push({name: 'add-vehicle', params: { id:id }})
                                    }
                                }
                            },'编辑 '),*/
                            h('Button',{
                                props: {
                                    type: "success",
                                    ghost: true,
                                    size: "small"
                                },
                                directives: [{
                                    name: 'hasAuth',
                                    value: 'vehicle-center-control'
                                }],
                                style:{
                                    marginRight: '15px',
                                },
                                on:{
                                    click:()=>{
                                        this.contrlModal = true
                                        this.seletedCarVin = params.row.vin
                                    }
                                }
                            },'远程控制'),
                            h('Button',{
                                props: {
                                    type: "primary",
                                    ghost: true,
                                    size: "small"
                                },
                                directives: [{
                                    name: 'hasAuth',
                                    value: 'vehicle-center-authorize'
                                }],
                                on:{
                                    click:()=>{
                                        this.authModal = true
                                        this.driverForm.identityCardNumber = ''
                                        this.driverForm.authStartTime = ''
                                        this.driverForm.authEndTime = ''                    
                                        this.driverForm.vin = params.row.vin
                                    }
                                }
                            },'司机授权'),
                        ])
                    }
                }
            ],
            carList:[],
            driverForm:{
                identityCardNumber: '',
                authStartTime: null,
                authEndTime: null,
                vin: null
            },
            preDriveName :'',
            preDriverError:'',
            ruleDriverForm:{
                identityCardNumber: [
                    { validator: validateIDCheck, trigger: 'change' }
                ],
                authStartTime:[
                    {required: true, message: '不能为空', trigger: 'change'}
                ],
                authEndTime:[
                    {required: true, validator: validateEnd, trigger: 'change'}
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
    mounted(){
        let getVin = this.$route.params.id || ''
        this.inputList[1].value = getVin
        this.inputList[0].cascaderList = JSON.parse(localStorage.getItem('pcOperatorList'))
        this.$store.commit('changeLoadingFlag', true)
        this.getList({ otherIndex: getVin })
    },
    methods:{
        //获取分页list
        getList (newdata){
            let data = {
                pageSize: Number(this.pageSize),
                currPage: Number(this.current),
                businessType: Number(this.bussinessType)
            }
            let params = JSON.parse(JSON.stringify(this.searchParams))
            data = Object.assign(data, params, newdata|| {})
            getVehicleList(data).then(res =>{
                this.carList = res.data.data.list
                this.total = res.data.data.totalCount
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        handelSearch(items){
            delete items.provinId
            delete items.cityId
            this.current = 1
            this.searchParams = items
            this.getList()
        },
        reset(){
            this.current = 1
            this.searchParams = {}
            this.getList()
        },
        getCurrentTime(val){
            let time = this.$moment().format('YYYY-MM-DD HH:mm:ss ');
            this.currentTime = time
            this.statusModal = true
            this.statusForm = {}
            this.fuelType = ''
            this.exactPosition = []
            let data ={otherIndex: val.vin}
            getRealTimeStatus(data).then(res =>{
               this.statusForm = res.data.data
               this.exactPosition.push(res.data.data.longitude)
               this.exactPosition.push(res.data.data.latitude)
            })
            this.fuelType = val.fuelType
        },
        changePageSize(val){
            this.pageSize = val;
            this.getList();
        },
        changePage(val){
            this.current = val;
            this.getList()
        },
        toAddPage(){
            this.$router.push('add')
        },
        downLoadTem(){
            let baseUrl = this._baseUrl 
            window.location.href = `${baseUrl}/download/carImportTemplate.zip`
        },
        beforeUpload(){
            this.isUpLoading = true
        },
        handleSuccess(res, file){
            if(res.success){
                this.$Message.success(`上传成功+${res.result}`)
            } else {
                this.$Message.error(res.errorMsg)
            }
            this.isUpLoading = false
        },
        exportList(){
            let data = {
                agentUuid: this.inputList[0].value,
                otherIndex: this.inputList[1].value,
                excelTitle: '车辆详情'
            }
            for (const key in data) {
                if(data[key]=='') delete data[key]
            }
            let selfurl = this._baseUrl;
            axios({
                method: 'post',
                url: selfurl + '/admin/carManager/exportCars',
                data: data,
                responseType: 'blob', // 如果项目中引入了mock模块，会更改blob数据，返回乱码
            }).then(function (res) {
                if (res.data) {
                    fileDownload(res.data, 'vehicleDetail.csv')
                } else {
                    let errormsg = res.data.errorMsg || '服务器错误!'
                    this.$Message.error(errormsg);
                }
            })
        },
        //司机授权
        submitDriver(name){
            this.$refs[name].validate((valid) => {
                if(valid){
                    let data = this.driverForm
                    handleDriverAuth(data).then(res=>{
                        if(res.data.success){
                            this.$Message.success('授权成功')
                        } else {
                            this.$Message.error(this.data.msg)
                        }
                    })
                    this.authModal = false
                }
            })
        },
        // 时间段选择
        timePicker(date){
            this.driverForm.authStartTime = date[0];
            this.driverForm.authEndTime= date[1]
        },
        //地图
        showMap(){
            if (!this.statusForm.latitude) {
                this.$Message.warning('暂无位置信息')
                return false
            }
            this.showPosition = true
        },
        handleDate(date){
            this.driverForm.authStartTime = date
        },
        handleDate2(date){
            this.driverForm.authEndTime = date
        },
        turnOn(val,id,handelKey,type){
            if (val == 1){
                this.$Modal.confirm({
                    title: '远程操作',
                    content: '<p>确定要执行' + handelKey + '操作吗?' +'</p>',
                    onOk: () => {
                        this.controlAction(this.seletedCarVin,type,1,id)
                    },
                    onCancel: () => {
                        this.$Message.info('已取消操作');
                    }
                }); 
            }
            else if (val ==0) {
                this.$Modal.confirm({
                    title: '远程操作',
                    content: '<p>确定要执行' + handelKey + '操作吗?' +'</p>',
                    onOk: () => {
                        this.controlAction(this.seletedCarVin,type,0,id)
                    },
                    onCancel: () => {
                        this.$Message.info('已取消操作');
                    }
                });
            }
        },
        controlAction(vin,type,value,id){
            let data = {vin: vin, controlType: type, controlValue: value}
            let that = this
            controlCar(data).then(res=>{
                if(res.data.success){
                    this.actionFlag = true
                    that.openFlag[id] = true
                    this.$Message.success('操作成功');
                } else {
                    this.actionFlag = false
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
.container_box{
    .download{
    color: rgb(0, 153, 204);
    cursor: pointer;
    text-decoration: underline;
    }
    .pd-lf-20{
        padding-left: 20px
    }
    
}
.someHeader{
    .someHeaderh{
    font-family: 'Microsoft Tai Le Bold', 'Microsoft Tai Le';
    font-weight: 700;
    font-size: 15px
    }
    .pd-lf-20{
        padding-left: 20px
    }
   
    }
    .mid-sty{
        text-align: center;
        font-size: 15px;
        .round-img{
            width: 60px;
            height: 60px;
            border-radius: 30px;
            overflow: hidden;
            margin: 0 auto;
            img{
                width: 100%
            }
        }
    }
</style>
