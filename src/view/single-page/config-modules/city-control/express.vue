<template>
    <div class="container_box">
        <searchList :inputList="inputList" @on-search='queryList' @on-reset="handelReset"></searchList>
        <Button  
            type="primary" 
            @click='showAddModel' 
            v-hasAuth="'city_control-add'">新增城市
        </Button>
        <VTable
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :parColumns="cityColumns"
            :parTableData="cityData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            style="margin-top: 20px;">
        </VTable>
        <div class="addModal">
            <Modal v-model="addModal" title="新增城市" :mask-closable="false">
                <Form :model="addCityForm" :label-width="80">
                    <FormItem label="当前业务:">
                        <span v-if="tabName==2">专车</span>
                        <span v-if="tabName==4">快车</span>
                        <span v-if="tabName==1">出租车</span>
                    </FormItem>
                    <FormItem label="选择城市:" >
                        <al-cascader
                            level="1"
                            ref="alCascader"
                            v-model="selectedCityL"
                            style="width:190px" />
                     </FormItem>
                 </Form>
                <div slot='footer'>
                    <Button type="primary" @click="handleSaveCity">确定</Button>
                </div>
            </Modal>
        </div> 
        <Modal v-model="showBsModal" @on-cancel="cancelModal" :mask-closable="false">
            <BsStrategy  v-if="showBsModal" :wholeData = 'papaData' :typeModule='tabName'> </BsStrategy>
            <div slot="footer">
                <!-- <Button type="primary" @click="showBsModal=false">确定</Button> -->
            </div>
        </Modal>
        <Modal v-model="showBdModal" @on-cancel="cancelbdModal" :mask-closable="false">
            <badDebt 
                v-if="showBdModal"
                :isShow = 'showBdModal' 
                :cityuuid = 'selectedCityUuid' 
                :cityName = 'selectedCity' 
                @modalClose = 'modalReci2'>  
            </badDebt>
            <div slot="footer"></div>
        </Modal>
        <Modal v-model="popDiscount" :width="700" title="折扣矩阵" :mask-closable="false" footer-hide>
            <Discount @on-confirm="confirm" :tabName="tabName" :popView="popDiscount" :cityId="discountCityId"></Discount>
        </Modal>
    </div>
</template>

<script>
import BsStrategy from './components/bsStrategy.vue'
import badDebt from './components/bad-debt.vue'
import Discount from './components/discount.vue'
import { cpTranslate } from '@/libs/tools'
import { getModelsLeveList, updateCarModel ,addCity, turnoffCity, turnOnCity } from '@/api/configData.js'
import { getProvinceCityList } from '@/api/common.js'

export default {
    name:'express',
    props:{
        tabName: String
    },
    components: {
        BsStrategy,
        badDebt,
        Discount
    },
    data () {
        return {
            discountCityId: '',
            inputList: [
                {
                    name: 'cascader-input', // 文本输入框名
                    bind_key: ['provinceID', 'cityID'], // 返回数据的key名
                    placeholder: '请选择省/市',
                    value: [], // 绑定返回数据
                    cascaderList: [], // 级联列表
                    title: '省 / 市：', // 展示的字段名
                    titleWidth: 60, // 展示的字段名的宽度
                    inputWidth: 200, // input框的宽度
                    key: '2', // 该文本框的唯一标识，用于匹配该文本框是否展示
                    isHide: false, // false: 不隐藏 / true: 隐藏
                    changeOnSelect: true
                }
            ],
            unScitylist: '',
            selectedCityL: [],
            popDiscount: false, // 弹出折扣矩阵
            addModal:false,
            addCityForm:{},
            showBsModal:false,
            showBdModal:false,
            papaData: {},
            chinalist:{},
            selectedCityUuid:'',
            selectedCity: '',
            cityColumns:[
                {
                    title:'城市名',
                    minWidth: 160,
                    key:'city'
                },
                {
                    title:'所属省份',
                    minWidth: 160,
                    key:'province'
                },
                {
                    title:'开通状态',
                    key:'status',
                    minWidth: 160,
                    render: (h,params) =>{
                        if(params.row.status == 0){
                            return h('div'),[
                                h('span',{
                                    
                                },'未开通')
                            ]
                        }
                        if(params.row.status ==1){
                            return h('div'),[
                                h('span',{

                                },'已开通')
                            ]
                        }
                    }
                },
                {
                    title:'更新时间',
                    key:'updateTime',
                    minWidth: 160,
                    render:(h,params) =>{
                        let x = params.row.updateTime
                        x = this.$moment(x).format('YYYY-MM-DD HH:mm:ss')
                        return h('div'),[
                            h('span',{

                            },x)
                        ]
                    }
                },
                {
                    title:'操作',
                    key:'action',
                    fixed: 'right',
                    width: 350,
                    render: (h, params) =>{
                            return h('div'),[
                                h('Button',{
                                    props: {
                                        type: 'error',
                                        ghost: true,
                                        size: 'small'
                                    },
                                    directives: [{
                                        name: 'hasAuth',
                                        value: 'city_control-update'
                                    }],
                                    style: {
                                        display: params.row.status === 1 ? 'inline-block' : 'none'
                                    },
                                     on:{
                                        click:() => {
                                            let info = params.row
                                            this.closeStra(info)
                                        }
                                    }
                                },'关闭'),
                                h('Button',{
                                    props: {
                                        type: 'success',
                                        ghost: true,
                                        size: 'small'
                                    },
                                    directives: [{
                                        name: 'hasAuth',
                                        value: 'city_control-update'
                                    }],
                                    style: {
                                        display: params.row.status === 0 ? 'inline-block' : 'none'
                                    },
                                    on:{
                                        click:() => {
                                            let info = params.row
                                            this.openStra(info)
                                        }
                                    }
                                },'开启'),
                               h('Button',{
                                    props: {
                                        type: 'success',
                                        ghost: true,
                                        size: 'small'
                                    },
                                    directives: [{
                                        name: 'hasAuth',
                                        value: 'city_control-priceStrategy'
                                    }],
                                    style: {
                                        marginLeft: '15px'
                                    },
                                    on: {
                                        click :() =>{
                                            this.showBsModel()
                                            this.papaData = params.row

                                        }
                                    },
                                },'定价策略'),
                                h('Button',{
                                    props: {
                                        type: 'warning',
                                        ghost: true,
                                        size: 'small'
                                    },
                                    directives: [{
                                        name: 'hasAuth',
                                        value: 'city_control-badStrategy'
                                    }],
                                    style: {
                                        marginLeft: '15px'
                                    },
                                    on: {click :() =>{
                                            this.showBdModel(params.row)
                                        }
                                    }
                                },'坏账策略'),
                                h('Button',{
                                    props: {
                                        type: 'primary',
                                        ghost: true,
                                        size: 'small'
                                    },
                                    directives: [{
                                        name: 'hasAuth',
                                        value: 'city_control-discount'
                                    }],
                                    style: {
                                        marginLeft: '15px'
                                    },
                                    on: {
                                        click :() =>{
                                            this.popDiscount = true
                                            this.discountCityId = params.row.cityId
                                        }
                                    }
                                },'折扣矩阵')
                            ]                     
                    }
                },
            ],
            cityData: [],
            totalCount: '',
            pageSize: 10,
            current: 1,
            total:null
        }
    },
    created (){
        this.getList()
        this.inputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
    },
    methods:{
        confirm: function(data){ // 保存折扣矩阵回调
            if(data) this.getList()
        },
        showAddModel (){
            this.selectedCityL = [] // 清空绑定的数据
            this.$refs.alCascader.select = [] // 清空页面上的展示数据
            this.addModal = true
        },
        //开通城市
        handleSaveCity () {
            if(!this.selectedCityL.length) {
                this.$Message.warning('请选择城市');
                return
            }
            let type = '';
            switch (this.tabName){
                case '2' :
                    type ='专车' ;
                    break;
                case '4' :
                    type ='快车' ;
                    break;
                case '1' :
                    type ='出租车' ;
                    break;
            }
            let data ={
                cityID: this.selectedCityL[1].code,
                typeModule: Number(this.tabName)
            }
            this.$Modal.confirm({
                title: '开通城市',
                content: '确认开通' + this.selectedCityL[1].name + '的' + type + '业务吗',
                onOk: () => {
                    addCity(data).then(res =>{
                        this.$Message.success('开通成功！');
                        this.getList()
                        this.getSavedCity()
                        this.addModal = false
                    })
                },
                onCancel: () => {
                    this.$Message.info('已取消');
                    /*this.selectedCityL = []
                    this.$refs.alCascader.select = [] // 清空页面上的展示数据*/
                }
            })
        },
        cancelModal(){
            this.showBsModal = false
        },
        cancelbdModal(){
            this.showBsModal = false
        },
        showBsModel() {
            this.showBsModal = true
        },
        showBdModel(val) {
            this.showBdModal =true
            this.selectedCityUuid = val.cityUuid
            this.selectedCity = val.city
        },
        modalReci(val) {
            this.showBsModal = val
        },
        modalReci2(val) {
            this.showBdModal = val
        },
        //重置
        handelReset(){
            this.current = 1
            this.getList()
        },
        //获取分页List
        getList() {
            let ty = Number(this.tabName)
            let data = {typeModule: ty, currPage: this.current, pageSize: this.pageSize}
            this.$store.commit('changeLoadingFlag', true)
            getModelsLeveList(data).then(res=> {
                this.cityData = res.data.data.list;
                this.total = res.data.data.totalCount;
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        getSavedCity(){
            let data = { typeModule: Number(this.tabName) }
            getProvinceCityList(data).then(res =>{
                let transformData = JSON.stringify(cpTranslate(res.data.data))
                localStorage.setItem('provinceCityList', transformData)
                this.inputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
            })
        },
        queryList(res){
            let data ={
                typeModule: Number(this.tabName),
                provinceID: res.provinceID,
                cityID: res.cityID,
                currPage: this.current, 
                pageSize: this.pageSize
            }
            getModelsLeveList(data).then(res=> {
                this.cityData = res.data.data.list; 
                this.total = res.data.data.totalCount;
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        changePageSize(val){
            this.pageSize = val;
            this.getList()
        },
        changePage(val){
            this.current = val
            this.getList()
        },
        closeStra(info){
            let data = {
                cityUuid: info.cityUuid,
                typeModule: Number(this.tabName)
            }
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确认关闭此城市的业务？</p>',
                onOk: () => {
                    turnoffCity(data).then( res=>{
                        if(res.data.success){
                            this.$Message.success('关闭成功');
                        }else{
                            this.$Message.error(res.data.data)
                        }
                        this.getList()
                    })
                },
                onCancel: () => {
                    this.$Message.info('已取消操作');
                }
            })
        },
        openStra(info){
            let data ={
                cityUuid: info.cityUuid,
                typeModule: Number(this.tabName)
            }
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确认开启此城市？</p>',
                onOk: () => {
                    turnOnCity(data).then( res=>{
                        if(res.data.success){
                            this.$Message.success('开启成功');
                        } else {
                            this.$Message.error(res.data.data)
                        }
                        this.getList()
                    })
                },
                onCancel: () => {
                    this.$Message.info('已取消操作');
                }
            })
        }
    }
}
</script>

<style lang="less">
.container_box{
    .mid{
        vertical-align: middle;
    }
    .fl-lt{
        float: left;
    }
    .fakeA{
        color:blueviolet
    }
}
</style>

