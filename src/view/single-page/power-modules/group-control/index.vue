<template>
    <div class="index">
        <SearchList :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
        <div class="index_header"> 
            <Button type="primary" @click="addRootDept" v-show="$utils.pkAccess('group_control_add')">添加根分组</Button>
        </div>
        <div class="index_content">

            <!--<Page :total="totaNum" :current="currPage" show-elevator />-->
            <Add 
                :title="title"
                :popView="popView" 
                @on-confirm="confirmOpera"
                :params="params"
                :width="400">
            </Add>
        </div>
    </div>
</template>

<script>
import { getGroupList, deleteGroup, allGroupList } from '@/api/power-data'
import { inputList } from './index'
import Add from './operation/add'
import SearchList from '_a/search-list/search-list'
import './index.css'

export default {
    components: {
        Add,
        SearchList
    },
    data () {
        return {
            columns:[
                {
                    title:"分组名称",
                    field:'groupName',
                    width: '400px'
                },
                {
                    title:"备注",
                    field:'remark'
                },
                {
                    title:"更新时间",
                    field:'updateTime'
                },
                {
                    title:"操作",
                    field:'album',
                    width: '150px'
                },
            ],
            inputList: [],
            popView: false,
            params: {},
            tableData: [],
            title: '',
            groupName: '',
            totaNum: 0,
            pageSize: 10,
            currPage: 1
        }
    },
    mounted(){
        this.inputList = JSON.parse(JSON.stringify(inputList))
    },
    methods: {
        getTableList: function(){ // 获取表格数据
            let data = {
                groupName: this.groupName
            }
            return allGroupList(data).then(res => {
                let data = res.data.data
                data.forEach(function(item, index){
                    if(item.parentUuid === null || item.parentUuid === '') item.pid = 0
                    item.id = index + 1
                })
                data.forEach(function(item, index){
                    data.forEach(function(_item, _index){
                        if(item.parentUuid === _item.uuid) item.pid = _item.id
                    })
                })
                data.forEach(function(item, index){
                    if(typeof(item.pid) === 'undefined') item.pid = 0
                })
                this.tableData = JSON.parse(JSON.stringify(data))
                return {
                    result: data
                }
            })
        },
        confirmOpera: function(data){ // 回调
            if(data) this.$refs.dataTable.refresh()
            this.popView = false
        },
        addRootDept: function(){
            this.popView = true
            this.title = '新建根分组'
            this.params = {
                parentName: '根分组',
                parentUuid: '',
                groupName: '',
                remark: '',
                type: 'add'
            }
        },
        popAddGroup: function(item){
            this.popView = true
            this.title = '添加分组'
            this.params = {
                parentUuid: item.uuid,
                parentName: item.groupName,
                groupName: '',
                remark: '',
                type: 'add'
            }
        },
        popEditGroup: function(item){
            let parentName = ''
            let parentUuid = ''
            this.popView = true
            this.title = '编辑分组'
            this.tableData.forEach(function(i, index){
                if(item.parentUuid === i.uuid) {
                    parentName = i.groupName
                    parentUuid = i.uuid
                }
            })
            if(parentName === '') {
                parentName = '根分组',
                parentUuid = ''
            }
            this.params = {
                parentUuid: parentUuid,
                parentName: parentName,
                groupName: item.groupName,
                uuid: item.uuid,
                remark: item.remark,
                type: 'edit'
            }
        },
        deleteGroup: function(item){
            this.$Modal.confirm({
                title: '提示',
                content: '<p>将会删除该分组下的所有用户，请确认操作！</p>',
                cancelText: '取消',
                onOk: () => {
                    deleteGroup({ uuid: item.uuid }).then(res => {
                        if(res.data.success){
                            this.$Message.success('删除成功!')
                            this.$refs.dataTable.refresh()
                        }
                    })
                }
            })           
        },
        search: function(data){
            if(typeof(data.groupName) === 'undefined'){
                this.groupName = ''
            } else {
                this.groupName = data.groupName
            }
            this.$refs.dataTable.refresh()
        },
        reset: function(data){
            this.groupName = ''
            this.$refs.dataTable.refresh()
        }
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
