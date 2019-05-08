<template>
    <div class="DM-edit">
        <div class="my-modal-wrap">
            <SearchList
                ref="searchList"
                :inputList="disInputList" 
                @on-reset="reset" 
                @on-search="search" 
                style="padding: 0 0 10px 40px;">
            </SearchList>
            <Transfer
                class="my-transfer"
                :operations="['移除','选中']"
                :titles="['全部司机', '已选择的司机']"
                :list-style="{ width: '500px',height: '400px', paddingBottom: '43px'}"
                :data="transferData"
                :target-keys="targetKeys"
                :render-format="render"
                @on-change="handleChange">
                <div class="my-transfer-wrap">
                    <div class="my-transfer-title-wrap">
                        <div style="width: 50px;">选择</div>
                        <div style="width: 135px;">司机名</div>
                        <div style="width: 140px;">手机号</div>
                        <div style="width: 140px;">所属司管</div>
                    </div>
                    <div class="my-transfer-body-wrap">
                        <div class="my-transfer-line-wrap" v-for="(item, index) in targeList" :key="index">
                            <div style="width: 135px;">{{item.name}}</div>
                            <div style="width: 140px;">{{item.mobile}}</div>
                            <div style="width: 140px;">{{item.managerDriver}}</div>
                            <div style="width: 50px;" class="transfer-delete" @click="deleteTarget(item.key, index)">删除</div>
                        </div>
                    </div>
                </div>
                <div class="my-transfer-footer">
                    <Page :current="current" :total="total" @on-change="changePage"/>
                </div>
            </Transfer>
            <div class="popView-footer-wrap">
                <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
                <Button size="large" type="primary" @click="commit(1)">确定</Button>
            </div>
        </div>
    </div>
</template>

<script>
import SearchList from '_a/search-list/search-list'
import { disInputList } from '../driver-manage.js'
import { driverMList, getDriverListByDriverM, tranferDriver } from '@/api/operator-carrier.js'

export default {
    components: {
        SearchList
    },
    props: {
        rowNum: {
            default: '',
            type: String
        },
        popView: Boolean,
        driverMId: String
    },
    data () {
        return {
            searchParams: {
                orderColumn: 'driver_manager_uuid', // 查询全部司机，并根据司管有无排序
            },
            disInputList: [],
            transferData: [],
            targetKeys: [],
            targeList: [],
            current: 1,
            total: 0
        }
    },
    watch: {
        'popView': function(){
            if(this.popView){
                this.$refs.searchList.resetData() // 清空搜索项
                this.searchParams = {
                    orderColumn: 'driver_manager_uuid', // 查询全部司机，并根据司管有无排序
                }
                this.targetKeys = []
                this.targeList = []
                this.disInputList = disInputList
                this.getTableData()
                this.getRightList()
                this.getDriverManagerList() // 获取搜索下拉列表
            }
        }
    },
    methods: {
        getDriverManagerList: function(){
            let params = {
                pageSize: '-1',
                currPage: 0,
                orderColumn: 'real_name'
            }
            driverMList(params).then(res => {
                let that = this
                let data = res.data.data.list
                this.disInputList[2].dropList = [
                    { label: '全部', value: 0 },
                    { label: '无', value: 1 }
                ]
                data.forEach(function(item, index){
                    that.disInputList[2].dropList.push({
                        label: item.realName,
                        value: item.uuid
                    })
                }) 
            })
        },
        render: function(item){
            if(item.managerDriver === '' || typeof(item.managerDriver) === 'undefined'){
                item.managerDriver = '无'
            }
            return  '<div style="flex:1;">' + item.name + "</div>"+
                    '<div style="flex:1;">' + item.mobile + "</div>"+
                    '<div style="flex:1;">' + item.managerDriver + "</div>"
        },
        getTableData: function(){
            let params = this.searchParams
            params.agentUuid = this.$route.query.uuid
            params.pageSize = 8
            params.currPage = this.current
            getDriverListByDriverM(params).then(res => {
                let data = res.data.data.list
                for(let i = 0; i < data.length; i++){
                    data[i].key = data[i].uuid
                }
                this.transferData = res.data.data.list
                this.total = res.data.data.totalCount
            })
        },
        getRightList: function(){ // 获取右侧表格数据
            getDriverListByDriverM({
                pageSize: '-1', // 不分页
                currPage: 0,
                orderColumn: 'name',
                driverManagerUuid: this.driverMId,
                agentUuid: this.$route.query.uuid
            }).then(res => {
                let data = res.data.data.list
                this.targetKeys = []
                for(let i = 0; i < data.length; i++){
                    data[i].key = data[i].uuid
                    this.targetKeys.push(data[i].uuid)
                    this.targeList.push(data[i])
                }
            })
        },
        handleChange: function(newTargetKeys, direction, moveKeys){ // 往右侧转移时调用
            this.targetKeys = [...this.targetKeys, ...moveKeys]
            for(let i = 0; i < this.transferData.length; i++){
                for(let j = 0; j < moveKeys.length; j++){
                    if(this.transferData[i].key === moveKeys[j]){
                        this.targeList.push(this.transferData[i])
                    }
                }
            }
        },
        deleteTarget: function(deleteKey, index){
            this.targeList.splice(index, 1)
            for(let i = 0; i < this.targetKeys.length; i++){
                if(this.targetKeys[i] === deleteKey){
                    this.targetKeys.splice(i, 1)
                }
            }
        },
        commit: function(temp){
            if(temp){
                let params = {
                    driverManagerUuid: this.driverMId,
                    list: []
                }
                for(let i = 0; i < this.targeList.length; i++){
                    params.list.push({
                        driverManagerUuid: this.driverMId,
                        driverUuid: this.targeList[i].uuid
                    })
                }
                tranferDriver(params).then(res => {
                    this.$Message.success('分配成功！')
                    this.$emit('on-confirm', 1)  
                })             
            } else {
                this.$emit('on-confirm')
            }
        },
        search: function(data){
            this.current = 1
            this.searchParams = data
            if(data.driverManagerUuid === 0 || typeof(data.driverManagerUuid) === 'undefined'){
                this.searchParams.orderColumn = 'driver_manager_uuid' // 查询全部司机，并根据司管有无排序
                delete this.searchParams.driverManagerUuid
                this.getTableData()
            } else if(data.driverManagerUuid === 1){
                this.searchParams.orderColumn = 'name'
                delete this.searchParams.driverManagerUuid // 查询无司管的司机
                this.getTableData()
            } else { // 查询指定司管
                this.searchParams = data
                this.searchParams.orderColumn = 'name'
                this.getTableData()
            }
        },
        reset: function(data){
            this.searchParams = data
            this.searchParams.orderColumn = 'driver_manager_uuid' // 查询全部司机，并根据司管有无排序
            this.getTableData()
        },
        changePage: function(page){
            this.current = page
            this.getTableData()
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .my-transfer{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .my-transfer-footer{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .my-transfer .ivu-transfer-list:last-child .my-transfer-footer{
        display: none;
    }
    .my-transfer .ivu-transfer-list:last-child .my-transfer-wrap{
        top: -372px;
        height: 300px;
    }
    .my-transfer .ivu-transfer-list:last-child .my-transfer-wrap .my-transfer-title-wrap{
        margin-bottom: 10px;
    }
    .my-transfer .ivu-transfer-list:last-child .my-transfer-wrap .my-transfer-title-wrap > div:first-child{
        display: none;
    }
    .my-transfer .ivu-transfer-list:first-child .my-transfer-wrap .my-transfer-line-wrap{
        display: none;
    }
    .my-transfer .ivu-transfer-list:last-child .my-transfer-wrap .my-transfer-body-wrap{
        height: 265px;
        overflow: scroll;
    }
    .my-transfer .ivu-transfer-list:last-child .my-transfer-wrap .my-transfer-body-wrap::-webkit-scrollbar{
        display: none;
    }
    .my-transfer-wrap{
        position: absolute;
        top: -340px;
        width: 100%;
    }
    .my-transfer-title-wrap, .my-transfer-line-wrap{
        display: flex;
        width: 100%;
        padding: 0 11px;
        border: 1px solid #dcdee2;
        box-sizing: border-box;
        height: 46px;
        line-height: 50px;
        font-size: 14px;
        border-top: none;
        font-weight: bold;
        background-color: #fafafa;
    }
    .my-transfer-line-wrap{
        font-weight: normal;
        border-bottom: none;
        background-color: white;
        font-size: 12px;
        height: auto;
    }
    .my-transfer-line-wrap > div{
        padding: 7px 0;
        height: 31.27px;
        line-height: normal;
    }
    .my-transfer-line-wrap:hover{
        background-color: #f3f3f3;
    }
    .transfer-delete{
        color: #EF5B5E;
    }
    .transfer-delete:hover{
        cursor: pointer;
    }
</style>
