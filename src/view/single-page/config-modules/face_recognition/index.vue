<!--人脸识别管理-->
<template>
    <div style="padding-top: 10px;">
        <SearchList :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
        <VTable
            isLoading
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :parColumns="columns"
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            style="margin-top: 25px;">
        </VTable>
    </div>
</template>

<script>
import { returnColumns, inputList } from './index.js'
import { getFaceList } from '@/api/configData'

export default {
    data () {
        return {
            searchParams: {},   // 搜索参数
            inputList: [],
            tableData: [],
            columns: [],
            current: 1,
            pageSize: 10,
            total: 0
        }
    },
    mounted() {
        this.inputList = JSON.parse(JSON.stringify(inputList))
        this.inputList[4].cascaderList = JSON.parse(localStorage.getItem('pcOperatorList'))
        this.columns = returnColumns(this)
        this.getTableList()
    },
    methods: {
        getTableList: function(){ // 获取表格数据
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.currPage = this.current
            params.pageSize = this.pageSize
            getFaceList(params).then(res => {
                this.tableData = res.data.data.list
                this.total = res.data.data.totalCount
                this.$store.commit('changeLoadingFlag', false)
            }) 
        },
        changePage: function(val){
            this.current = val
            this.getTableList()
        },
        changePageSize: function(val){
            this.pageSize = val
            this.getTableList()
        },
        search: function(data){
            delete data.provinceId
            delete data.cityId
            this.current = 1
            this.searchParams = data
            this.getTableList()
        },
        reset: function(data){
            this.current = 1
            this.searchParams = data
            this.getTableList()
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    
</style>
