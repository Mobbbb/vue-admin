<template>
    <div class="menu-index">
        <Button type="primary" @click="addGroup">新建集团</Button>
        <table class="menu-table-header">
            <tr>
                <td class="menu-table-header-first">权限组</td>
                <td class="menu-table-header-th" style="width: 120px;min-width: 120px;">机构类型</td>
                <td class="menu-table-header-th" style="width: 120px;min-width: 120px;">公司性质</td>
                <td class="menu-table-header-th" style="width: 300px;min-width: 300px;">备注</td>
                <td class="menu-table-header-action">操作</td>
            </tr>
        </table>
        <Tree
            class="menu-tree"
            :data="treeData" 
            :render="renderContent" 
            empty-text="暂无菜单"
            @on-toggle-expand="getExpandList">   
        </Tree>
        <Modal
            :width="380"
            :mask-closable="false"
            v-model="popViewAdd"
            :title="addParams.addType === 'group' ? '新建集团' : '新建子机构'" 
            footer-hide>
            <AddGroup :popView="popViewAdd" :params="addParams" @on-confirm="confirm"></AddGroup>
        </Modal>
        <Modal
            :width="420"
            :mask-closable="false"
            v-model="popViewEdit"
            title="编辑权限组" 
            footer-hide>
            <EditOrg :popView="popViewEdit" :params="params" @on-confirm="confirm"></EditOrg>
        </Modal>
        <Modal
            :width="420"
            :mask-closable="false"
            v-model="popViewDetail"
            title="机构详情" 
            footer-hide>
            <Detail :popView="popViewDetail" :uuid="uuid" @on-confirm="confirm"></Detail>
        </Modal>
    </div>
</template>

<script>
import { treeDataTranslate, popParentNode } from '@/libs/tools'
import { getOrgList } from '@/api/organization'
import { renderContent } from './index'
import AddGroup from './operation/add-org'
import EditOrg from './operation/edit-org'
import Detail from './operation/detail'

export default {
    components: {
        AddGroup,
        EditOrg,
        Detail
    },
    data () {
        return {
            uuid: '',
            addParams: {},
            popViewDetail: false,
            popViewAdd: false,
            popViewEdit: false, // 是否弹出编辑窗口
            params: {},         // 编辑窗口用的参数
            treeData: [],       // table数据
            levelList: [],
            expandList: []      // 临时存储展开的list
        }
    },
    mounted(){
        this.getOrgTree()
    },
    methods: {
        getOrgTree: function(){
            getOrgList().then(res => {
                let tempData = JSON.parse(JSON.stringify(res.data.data))
                this.levelList = JSON.parse(JSON.stringify(res.data.data))
                for(let i = 0; i < tempData.length; i++){
                    for(let j = 0; j < this.expandList.length; j++){
                        if(this.expandList[j].id === tempData[i].id){
                            tempData[i].expand = true // 将展开项保持展开
                        }
                    }
                }
                treeDataTranslate(this.levelList)
                this.treeData = treeDataTranslate(tempData)
            })
        },
        getLevel: function(id){ // 根据权限组id查询该组是第几级分组
            let level = 1
            for(let i = 0; i < this.levelList.length; i++){
                if(this.levelList[i].id === id){
                    level = this.levelList[i]._level
                    break
                }
            }
            return level
        },
        getExpandList: function(list){ // 获取当前展开的项
            let temp = false
            if(list.expand){
                this.expandList.push(list)
            } else {
                for(let i = 0; i < this.expandList.length; i++){
                    if(this.expandList[i].id === list.id){
                        this.expandList.splice(i, 1)
                    }
                }
            }
        },
        addGroup: function(){ // 弹出新建权限组
            this.popViewAdd = true
            this.addParams = {
                addType: 'group',
                type: 0
            }
        },
        renderContent (h, { root, node, data }) {
            return renderContent(h, { root, node, data }, this)
        },
        confirm: function(data){
            if(data) this.getOrgTree()
            this.popViewAdd = false
            this.popViewEdit = false
            this.popViewDetail = false
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
    .ivu-tree-empty{
        border: 1px solid #e8eaec;
        padding: 20px;
        text-align: center;
    }
    .menu-root-btn{
        margin-bottom: 18px;
    }
    .menu-table-header{
        width: 100%;
        font-size: 14px;
        border: 1px solid #e8eaec;
        background: #f8f8f9;
        margin-top: 20px;
        border-collapse: collapse;
    }
    .menu-table-header-first{
        min-width: 360px;
        padding: 9px 18px;
    }
    .menu-table-header-action{
        min-width: 250px;
        width: 250px;
        height: 40px;
        padding: 0 18px;
        box-sizing: border-box;
        border-left: 1px solid #e8eaec;
    }
    .tree-line-underline{
        width: 1000%;
        height: 1px;
        background-color: #e8eaec;
        position: absolute;
        bottom: 0;
        left: -1400px;
    }
    .menu-table-header-th{
        padding: 9px 18px;
        border-left: 1px solid #e8eaec;
    }
    .menu-table-header-td{ // table行右侧
        display: inline-block;
        border-left: 1px solid #e9e9e9;
        box-sizing: border-box;
        padding: 9px 18px;
        font-size: 12px;
        text-overflow: ellipsis;
    }
    .menu-tree{
        overflow: hidden;
        border-right: 1px solid #e8eaec;
        border-left: 1px solid #e8eaec;
    }
    .tree-line{
        width: 100%;
        height: 48px;
        line-height: 30px;
        display: flex;
        position: relative;
        transition: background-color 0.2s ease-in-out;
    }
    .tree-line:hover{
        background: #ebf7ff;
    }
    .menu-tree .ivu-tree-children > li{ // table行
        margin: 0;
        padding: 0;
        font-size: 14px;
        position: relative;
    }
    .menu-tree .ivu-tree-children > li > .ivu-tree-arrow{ // 下拉的图标
        line-height: 48px;
        margin-left: 18px;
        position: absolute;
        z-index: 10000;
    }
    .menu-tree .ivu-tree-children > li > .tree-line > span:nth-of-type(2){ // table第一列
        width: 100%;
        min-width: 360px;
        padding: 9px 18px 9px 36px;
    }
    .menu-tree .ivu-tree-children > li > .tree-line > span:nth-of-type(2) > i{ // 机构列的icon
        margin-right: 5px;
    }
</style>
