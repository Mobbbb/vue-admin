<!--司机列表-->
<template>
    <div class="DM-detail">
        <div class="DM-detail-header">
            <div class="DM-detail-search-wrap">
                <Input 
                    v-model="realName"
                    style="margin-right: 20px;width: 200px;"
                    placeholder="请输入司机姓名或手机号或ID">
                </Input>
                <Button style="margin-right: 20px;" @click="reset">重置</Button>
                <Button type="primary" @click="search">搜索</Button>
            </div>
            <!--<Button type="primary" @click="popDisView">司机分配</Button>-->
        </div>
        <div class="DM-content">
            <Table :columns="totalFields" :data="tableData"></Table>
            <Page
                :total="total" 
                :current="current"
                show-elevator 
                @on-change="changePage" 
                style="display: flex; justify-content: flex-end; margin-top: 15px;" />
        </div>
        <Modal v-model="isPopDis" :width="1200" title="司机分配" :mask-closable="false" footer-hide>
            <Distribution @on-confirm="confirm" :popView="isPopDis" :driverMId="driverMId"></Distribution>
        </Modal>
    </div>
</template>

<script>
import { returnDetailFields } from '../driver-manage.js'
import { getDriverListByDriverM } from '@/api/operator-carrier.js'
import Distribution from './distribution'
 
export default {
    components: {
        Distribution
    },
    props: ['popView', 'driverMId'],
    data () {
        return {
            realName: '',
            totalFields: [],
            tableData:[],
            isUpdate: false, // 是否更新过
            isPopDis: false,
            current: 1,
            pageSize: 10,
            total: 0
        }
    },
    watch: {
        'popView': function() {
            if(this.popView) {
                this.isUpdate = false
                this.tableData = []
                this.getTableList()
            }
        }
    },
    mounted () {
        this.totalFields = returnDetailFields(this)
    },
    methods: {
        popDisView: function(){
            this.isPopDis = true
        },
        getTableList: function(params = {}){ // 获取表格数据
            params.pageSize = this.pageSize
            params.currPage = this.current
            params.orderColumn = 'created_on desc'
            params.driverManagerUuid = this.driverMId
            getDriverListByDriverM(params).then(res => {
                this.tableData = res.data.data.list
                this.total = res.data.data.totalCount
            })
        },
        confirm: function(data){
            if(data) {
                this.isUpdate = true
                this.getTableList()
            }
            this.isPopDis = false
        },
        search: function(){
            this.current = 1
            this.getTableList({
                name: this.realName
            })
        },
        reset: function(){
            this.realName = ''
            this.getTableList({
                name: ''
            })
        },
        changePage: function(val){
            this.current = val
            this.getTableList()
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .DM-detail{
        padding: 0 15px;
    }
    .DM-detail-header{
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    .DM-detail-search-wrap{
        display: flex;
    }
</style>


