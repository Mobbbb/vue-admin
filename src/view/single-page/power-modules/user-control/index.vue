<template>
    <div class="index">
        <div class="index_header">
            <SearchList 
                :inputList="inputList" 
                @on-drop-tree="dropTree"
                @on-search-tree="searchTree"
                @on-search="search" 
                @on-reset="reset"> 
            </SearchList>
            <ul class="index_header_line">
                <Button type="primary" @click="popAdd" v-show="$utils.pkAccess('user_control_add')">新增用户</Button>
            </ul>
        </div>
        <div class="index_content">
            <VTable 
                :total="total"
                :current="current"
                :pageSize="pageSize"
                :isLoading="isLoading"
                :parColumns="parColumns"
                :parTableData="tableData"
                @sort="sort"
                @selectObj="selectObj"
                @changePage="changePage"
                @changePageSize="changePageSize"
                style="margin-top: 25px;">
            </VTable>
            <Add 
                :title="title"
                :popView="popView" 
                :params="params"
                :roleList="roleList"
                @on-confirm="confirm"
                rowNum="half-row"
                :width="500">
            </Add>
        </div> 
    </div>
</template>

<script>
import { treeDataTranslate } from '@/libs/tools'
import { returnFields, inputList } from './index'
import { getUserList, getRoleList, userRemoteByName, allGroupList } from '@/api/power-data'
import Add from './operation/add'
import VTable from '_a/v-table/v-table'
import SearchList from '_a/search-list/search-list'
import './index.css'
 
export default {
    components: {
        Add,
        VTable,
        SearchList
    },
    data () {
        return {
            group: '',
            title: '新增用户',
            params: {},
            searchParams: {},
            roleList: [],
            parColumns: [],
            tableData:[],
            inputList: [],
            popView: false,
            popViewEditor: false,
            popViewDetail: false,
            current: 1,
            pageSize: 10,
            isLoading: true,
            total: 20
        }
    },
    mounted () {
        Object.entries(returnFields(this)).forEach(([key,value])=> {this.parColumns.push(value)})
        this.getTableList()
        this.getRoleList()
        this.inputList = JSON.parse(JSON.stringify(inputList))
        this.inputList[1].remoteMethod = this.remoteMethod
    },
    methods: {
        remoteMethod: function(query){ // 姓名输入框模糊搜索
            userRemoteByName({ userName: query }).then(res => {
                this.inputList[1].remoteList = []
                for(let i = 0; i < res.data.data.length; i++){
                    this.inputList[1].remoteList.push({
                        label: res.data.data[i],
                        value: res.data.data[i]
                    })
                }
            })
        },
        searchTree: function(data){ // 分组列表搜索
            this.getGroupList({
                groupName: data
            })
        },
        dropTree: function(){ // 下拉分组列表
            this.getGroupList({})
        },
        getGroupList: function(data){ // 获取分组列表
            this.inputList[5].loading = true
            allGroupList(data).then(res => {
                this.inputList[5].loading = false
                if(res.data.success){
                    let treeData = res.data.data
                    treeData.forEach(function(item, index){
                        treeData[index].title = item.groupName
                        treeData[index].label = item.groupName
                        treeData[index].value = item.uuid
                    })
                    this.inputList[5].treeData = treeDataTranslate(res.data.data, 'uuid', 'parentUuid')
                }
            })
        },
        getRoleList: function(){
            getRoleList({}).then(res => {
                this.roleList = res.data.data
                for(let i = 0; i < this.roleList.length; i++){
                    this.roleList[i].label = this.roleList[i].name
                    this.roleList[i].value = this.roleList[i].uuid
                }
                this.inputList[3].dropList = this.roleList
            })
        },
        getTableList: function(){ // 获取表格数据
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.pageSize = this.pageSize
            params.currPage = this.current
            getUserList(params).then(res => {
                this.tableData = res.data.data.list
                this.total = res.data.data.totalCount
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        popAdd: function(){
            this.popView = true
            this.title = '新增用户'
            this.params = {
                userAccount: null,
                userName: null,
                userMobile: null,
                userRole: '',
                groupName: '',
                userGroupId: '',
                type: 'add'
            }
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
        sort: function(){

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
    .index_header_line{
        display: flex;
        margin-bottom: 15px;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .searchInput{
        width: 140px;
        height: 32px;
        background: #FBFBFB;
    }
    .index_pageBar{
        margin-top: 15px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
</style>
