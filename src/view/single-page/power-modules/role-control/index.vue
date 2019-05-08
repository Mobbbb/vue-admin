<template>
    <div class="index">
        <SearchList :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
        <div class="index_header">
            <Button type="primary" @click="popAdd" v-show="$utils.pkAccess('role_control_add')">新增角色</Button>
        </div>
        <div class="index_content">
            <VTable 
                :total="total"
                :current="current"
                :pageSize="pageSize"
                :isLoading="isLoading"
                :parColumns="columns"
                :parTableData="tabledata"
                @selectObj="selectObj"
                @changePage="changePage"
                @changePageSize="changePageSize"
                style="margin-top: 25px;">
            </VTable>
            <Add 
                :title="title"
                :popView="popView" 
                @on-confirm="confirm"
                :params="params"
                :width="400">
            </Add>
        </div> 
    </div>
</template>

<script>
import { getRoleList, getMenuList } from '@/api/power-data'
import { roleTableColumns, inputList } from './index'
import { treeDataTranslate } from '@/libs/tools'
import VTable from '_a/v-table/v-table'
import Add from './operation/add'
import SearchList from '_a/search-list/search-list'

export default {
    components: {
        Add,
        VTable,
        SearchList
    },
    data () {
        return {
            searchParams: {},
            params: {},
            title: '',
            columns: roleTableColumns(this),
            inputList: [],
            tabledata:[],
            popView: false,
            popViewEditor: false,
            popViewDetail: false,
            current: 1,
            pageSize: 10,
            isLoading: true,
            total: 20
        }
    },
    mounted(){
        this.inputList = JSON.parse(JSON.stringify(inputList))
        this.getTableList()
    },
    methods: {
        getTableList: function(){ // 获取表格数据
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.pageSize = this.pageSize
            params.currPage = this.current
            getRoleList(params).then(res => {
                this.tabledata = res.data.data.list
                this.total = res.data.data.totalCount
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        popAdd: function(){
            this.popView = true
            this.title = '新增角色'
            getMenuList().then(res => {
                let treeData = JSON.parse(JSON.stringify(res.data.data))
                let listData = JSON.parse(JSON.stringify(res.data.data))
                for(let i = 0; i < treeData.length; i++){
                    treeData[i].title = treeData[i].resourceName
                }
                treeData = treeDataTranslate(treeData, 'uuid', 'resourceParent')
                this.params = {
                    roleName: '',
                    type: 'add',
                    treeData: treeData,
                    listData: listData
                }
            })
        },
        search: function(data){
            this.current = 1
            this.searchParams = data
            this.getTableList()
        },
        reset: function(data){
            this.searchParams = data
            this.getTableList()
        },
        confirm: function(data){
            if(data) this.getTableList()
            this.popView = false
        },
        selectObj: function(val){
            this.current = val
            this.getTableList()
        },
        changePage: function(val){
            this.current = val
            this.getTableList()
        },
        changePageSize: function(val){
            this.pageSize = val
            this.getTableList()
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .index_header_row{
        display: flex;
        margin-bottom: 15px;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .index_header_row li{
        list-style: none;
        color: #4A4A4A;
        font-size: 14px;
        display: flex;
        align-items: center;
    }
    .searchInput{
        width: 140px;
        height: 32px;
        background: #FBFBFB;
    }
    .index_header_row li span{
        display: inline-block;
        width: 100px;
    }
    .index_pageBar{
        margin-top: 15px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
</style>
