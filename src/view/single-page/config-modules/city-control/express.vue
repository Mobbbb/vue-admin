<!--开通城市内容页面-->
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
                    <FormItem label="选择城市:">
                        <al-cascader
                            level="1"
                            ref="alCascader"
                            v-model="selectedCityL"
                            style="width:190px"/>
                     </FormItem>
                 </Form>
                <div slot='footer'>
                    <Button type="primary" @click="handleSaveCity">确定</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
import { cpTranslate } from '@/libs/tools'
import { getModelsLeveList, addCity, turnoffCity, turnOnCity, checkedCityStatus } from '@/api/configData.js'
import { getProvinceCityList } from '@/api/common.js'
import { typeModuleMap } from '@/libs/status-map'

export default {
    name:'express',
    props:{
        tabName: String
    },
    data () {
        return {
            typeModuleMap,
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
            selectedCityL: [],
            addModal: false,    // 弹出开通城市弹窗
            addCityForm: {},
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
                        if(params.row.status == 0) return h('span', '未开通')
                        if(params.row.status == 1) return h('span', '已开通')
                    }
                },
                {
                    title:'更新时间',
                    key:'updateTime',
                    minWidth: 160,
                    render:(h,params) =>{
                        let x = params.row.updateTime
                        x = this.$moment(x).format('YYYY-MM-DD HH:mm:ss')
                        return h('span', x)
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
                                on: {
                                    click: () => {
                                        let info = params.row
                                        let data = {
                                            cityUuid: params.row.cityUuid,
                                            typeModule: Number(this.tabName)
                                        }
                                        checkedCityStatus(data).then(res => {
                                            this.openStra(info)
                                        })
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
                                    click: () => {
                                        this.$router.push({
                                            name: 'city_control_operation',
                                            query: {
                                                tabType: '1',
                                                city: params.row.city,
                                                province: params.row.province,
                                                status: params.row.status,
                                                businessType: params.row.businessType,
                                                uuid:  params.row.uuid,
                                                cityId: params.row.cityId,
                                                cityUuid: params.row.cityUuid
                                            }
                                        })
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
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: 'city_control_operation',
                                            query: {
                                                tabType: '2',
                                                city: params.row.city,
                                                province: params.row.province,
                                                status: params.row.status,
                                                businessType: params.row.businessType,
                                                uuid:  params.row.uuid,
                                                cityId: params.row.cityId,
                                                cityUuid: params.row.cityUuid
                                            }
                                        })
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
                                    click: () => {
                                        this.$router.push({
                                            name: 'city_control_operation',
                                            query: {
                                                tabType: '3',
                                                city: params.row.city,
                                                province: params.row.province,
                                                status: params.row.status,
                                                businessType: params.row.businessType,
                                                uuid:  params.row.uuid,
                                                cityId: params.row.cityId,
                                                cityUuid: params.row.cityUuid
                                            }
                                        })
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
            total: null
        }
    },
    created (){
        this.getList()
        this.inputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
    },
    methods:{
        showAddModel (){
            this.selectedCityL = [] // 清空绑定的数据
            this.$refs.alCascader.select = [] // 清空页面上的展示数据
            this.addModal = true
        },
        handleSaveCity () { // 开通城市
            if(this.selectedCityL.length === 0) {
                this.$Message.warning('请选择城市')
            } else if (this.selectedCityL.length === 1) {
                this.$Message.warning('暂时无法开通台湾省')
            } else {
                let data ={
                    cityID: this.selectedCityL[1].code,
                    typeModule: Number(this.tabName)
                }
                this.$Modal.confirm({
                    title: '开通城市',
                    content: '确认开通' + this.selectedCityL[1].name + '的' + this.typeModuleMap[this.tabName] + '业务吗',
                    onOk: () => {
                        addCity(data).then(res =>{
                            this.$Message.success('开通成功！')
                            this.getList()
                            this.getSavedCity()
                            this.addModal = false
                        })
                    }
                })
            }
        },
        handelReset () { // 重置
            this.current = 1
            this.getList()
        },
        getList () { // 获取分页List
            let ty = Number(this.tabName)
            let data = {typeModule: ty, currPage: this.current, pageSize: this.pageSize}
            this.$store.commit('changeLoadingFlag', true)
            getModelsLeveList(data).then(res=> {
                this.cityData = res.data.data.list;
                this.total = res.data.data.totalCount;
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        getSavedCity () {
            let data = { typeModule: Number(this.tabName) }
            getProvinceCityList(data).then(res =>{
                let transformData = JSON.stringify(cpTranslate(res.data.data))
                localStorage.setItem('provinceCityList', transformData)
                this.inputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
            })
        },
        queryList (res) {
            let data ={
                typeModule: Number(this.tabName),
                provinceID: res.provinceID,
                cityID: res.cityID,
                currPage: this.current, 
                pageSize: this.pageSize
            }
            this.$store.commit('changeLoadingFlag', true)
            getModelsLeveList(data).then(res=> {
                this.cityData = res.data.data.list; 
                this.total = res.data.data.totalCount;
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        changePageSize(val){
            this.pageSize = val
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
                        this.$Message.success('关闭成功')
                        this.getList()
                        this.getSavedCity()
                    })
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
                        this.$Message.success('开启成功')
                        this.getList()
                        this.getSavedCity()
                    })
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

