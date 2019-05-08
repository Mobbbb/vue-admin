<template>
    <div class="menu-index">
        <Button type="primary" @click="addRootMenu">添加根菜单</Button>
        <!-- v-show="$utils.pkAccess('menu_control_add')" -->
        <table class="menu-table-header">
            <tr>
                <td>菜单名称</td>
                <td style="float: right;width: 159px;text-align: center;padding-right: 20px;">操作</td>
                <td style="float: right;width: 93px;">类型</td>
                <td style="float: right;width: 200px;">图标</td>
            </tr>
        </table>
        <Tree
            class="menu-tree"
            :data="treeData" 
            :render="renderContent" 
            empty-text="暂无菜单" 
            @on-toggle-expand="getExpandList">   
        </Tree>
        <Add 
            title="添加菜单"
            :popView="popViewAdd" 
            @on-confirm="addMenu"
            :params="addParams"
            :width="400">
        </Add>
        <Editor
            title="编辑菜单"
            :popView="popViewEditor" 
            @on-confirm="editMenu"
            :params="editParams"
            :width="400">
        </Editor>
    </div>
</template>

<script>
import { treeDataTranslate } from '@/libs/tools'
import { getMenuList } from '@/api/power-data'
import { renderContent } from './index'
import Add from './operation/add'
import Editor from './operation/editor'
import '@/styles/cyk-style.css'

export default {
    components: {
        Add,
        Editor
    },
    data () {
        return {
            tableWidth: 184,
            popViewAdd: false,
            popViewEditor: false,
            addParams: {},
            editParams: {},
            treeData: [],
            expandList: [] // 临时存储展开的list
        }
    },
    mounted(){
        this.getTableList()
    },
    methods: {
        addRootMenu: function(){
            this.popViewAdd = true
            this.addParams = {
                parentName: '根菜单',
                resourceParent: '',
                resourceType: 0,
                menuIcon: '',
                resourceUrl: '',
                resourceName: '',
                permissionsUrl: ''
            }
        },
        editMenu: function(data){
            if(data) this.getTableList()
            this.popViewEditor = false
        },
        addMenu: function(data){
            if(data) this.getTableList()
            this.popViewAdd = false
        },
        renderContent (h, { root, node, data }) {
            return renderContent(h, { root, node, data }, this)
        },
        getExpandList: function(list){ // 获取当前展开的项
            let temp = false
            if(list.expand){
                this.expandList.push(list)
            } else {
                for(let i = 0; i < this.expandList.length; i++){
                    if(this.expandList[i].uuid === list.uuid){
                        this.expandList.splice(i, 1)
                    }
                }
            }
        },
        getTableList: function(){ // 获取表格数据
            getMenuList().then(res => {
                let tempData = JSON.parse(JSON.stringify(res.data.data))
                this.treeData = JSON.parse(JSON.stringify(res.data.data))
                for(let i = 0; i < tempData.length; i++){
                    for(let j = 0; j < this.expandList.length; j++){
                        if(this.expandList[j].uuid === tempData[i].uuid){
                            tempData[i].expand = true // 将展开项保持展开
                        }
                    }
                    if(tempData[i].resourceType === 1){
                        tempData[i].typeName = '菜单'
                    } else {
                        tempData[i].typeName = '按钮'
                    }
                }
                this.treeData = treeDataTranslate(tempData, 'uuid', 'resourceParent')
            })
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .menu-root-btn{
        margin-bottom: 18px;
    }
    .menu-table-header{
        width: 100%;
        font-size: 14px;
        border: 1px solid #e9e9e9;
        background: #f8f8f9;
        padding: 8px 15px;
        margin-top: 25px;
    }
</style>
