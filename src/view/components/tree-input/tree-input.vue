<!--
    * 树形多选下拉选择框
    * 展示叶子节点
    * 返回叶子节点
-->
<template>
    <div class="multiple-tree-drop-select" :style="{width: inputWidth, height: inputHeight}">
        <Dropdown trigger="custom" :visible="visible" :placement="position" class="tree-drop">
            <div class="my-form-item-error">
                <div class="dropShower ivu-input" :style="{width: inputWidth, height: inputHeight}" @click.stop="clickInput">
                    <ul>
                        <li v-for="(item, index) in selectLists" :key="index">
                            <span>{{item.title}}</span>
                            <i class="ivu-icon ivu-icon-ios-close" @click.stop="closeItem(item, index)"></i>
                        </li>
                        <div class="multiple-tree-select-placeholder" v-if="showPlaceholder">{{placeholder}}</div>
                    </ul>
                </div>
            </div>

            <DropdownMenu slot="list" :style="{'minWidth': inputWidth}" @click.native.stop>
                <Tree
                    :data="treeData"
                    show-checkbox
                    @on-check-change='getNodes'
                    style="margin-left: 15px;">
                </Tree>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
import { selectItemByIds, getIntersection } from '@/libs/tools.js'
import '@/styles/cyk-style.css' 

export default {
    name:'tree-input',
    props: {
        // v-modal双向绑定选项value
        value: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 树形数据(不允许二次赋值)
        data: {
            type: Array,
            default: () => {
                return []
            }
        },
        // tree位置
        position: { 
            type:String,
            default: () => {
                return 'bottom-start'
            }
        },
        // 选择框宽度
        inputWidth: {
            type: String,
            default: '300px'
        },
        // 选择框高度
        inputHeight: {
            type: String,
            default: '67px'
        },
        placeholder: {
            type: String,
            default: '请选择'
        }
    },
    watch: {
        'value': function(){
            this.selectLists = selectItemByIds(this.data, this.value)
            this.cancelChecked('') // 初始化勾选项
        },
        'data': function(){
            this.init()
        }
    },
    data() {
        return {
            showPlaceholder: true,
            visible: false,
            selectLists: [], // 选中list
            treeData: [],
            originalData: [],
            leavesNode: []
        }
    },
    mounted () {
        this.init()
        document.addEventListener('click', () => {
            this.visible = false
        })
    },
    methods: {
        init: function(){
            this.originalData = JSON.parse(JSON.stringify(this.data))
            this.treeData = JSON.parse(JSON.stringify(this.data))
            this.leavesNode = this.getAllLeaves()
        },
        clickInput: function(){ // 点击输入框
            this.visible = !this.visible
        },
        closeItem: function(item, index){ // 点击输入框中删除
            this.selectLists.splice(index, 1)
            this.getNodes(this.selectLists) // 触发value更新
            
            this.cancelChecked(item.value) // 取消tree中的选择
        },
        getNodes: function(item){ // 获取tree选中节点，并触发value更新
            let ids = []
            item.forEach(_item => {
                ids.push(_item.value)
            })
            if(ids.length) this.showPlaceholder = false
            else this.showPlaceholder = true
            this.$emit('input', getIntersection(this.leavesNode, ids))
            this.$emit('on-change', getIntersection(this.leavesNode, ids), item)
        },
        cancelChecked: function(id){
            let arr = JSON.parse(JSON.stringify(this.originalData))
            let ids = []
            let expandIds = this.getExpands()
            this.value.forEach(item => {
                if(item !== id) ids.push(item)
            })
            recursion(arr, ids)
            function recursion(arr, ids){
                for(let i = 0; i < arr.length; i++){
                    for(let j = 0; j < ids.length; j++){
                        if(arr[i].value === ids[j]){
                            arr[i].checked = true
                        }
                    }
                    for(let k = 0; k < expandIds.length; k++){
                        if(arr[i].value === expandIds[k]){
                            arr[i].expand = true
                        }
                    }
                    if(typeof(arr[i].children) !== 'undefined'){
                        recursion(arr[i].children, ids)
                    }
                }
            }

            this.treeData = JSON.parse(JSON.stringify(arr))
        },
        getExpands: function(){
            let arr = JSON.parse(JSON.stringify(this.treeData))
            let ids = []
            recursion(arr)
            function recursion(arr){
                for(let i = 0; i < arr.length; i++){
                    if(arr[i].expand) ids.push(arr[i].value)
                    if(typeof(arr[i].children) !== 'undefined'){
                        recursion(arr[i].children)
                    }
                }
            }

            return ids
        },
        getAllLeaves: function(){ // 获取所有叶子节点的id集合
            let leaves = []
            let arr = JSON.parse(JSON.stringify(this.treeData))
            recursion(arr)
            function recursion(arr){
                for(let i = 0; i < arr.length; i++){
                    if(typeof(arr[i].children) !== 'undefined'){
                        recursion(arr[i].children)
                    } else {
                        leaves.push(arr[i].value)
                    }
                }
            }

            return leaves
        }
    }
}
</script>

<style lang="less" scoped>
    .multiple-tree-drop-select{
        
    }
    .multiple-tree-select-placeholder{
        line-height: 24px;
        color: #c5c8ce;
    }
    .tree-drop{
        line-height: normal;
    }
    .dropShower {
        cursor: pointer;
        min-height: 32px;
        max-height: 67px;
        display: inline-block;
        overflow: scroll;
        line-height: 1.5;
        padding: 3px 4px;
        font-size: 12px;
        border: 1px solid #dcdee2;
        border-radius: 4px;
        color: #515a6e;
        background-color: #fff;
        background-image: none;
        position: relative;
        transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
        ul li {
            height: 24px;
            line-height: 22px;
            margin: 3px 4px 3px 0;
            display: inline-block;
            padding: 0 8px;
            border: 1px solid #e8eaec;
            border-radius: 3px;
            background: #f7f7f7;
            font-size: 12px;
            vertical-align: middle;
            opacity: 1;
            cursor: pointer;
            span {
                color: #515a6e;
            }
            i {
                font-size: 16px;
            }
        }
    }
    .dropShower{
        overflow: auto;
    }
    .ivu-form-item-error .ivu-input {
        border: 1px solid #ed4014;
    }
    .display-mode{
        border: none;
        overflow: unset;
        cursor: text;
        padding: 0;
    }
    .display-mode ul li{
        cursor: text;
    }
</style>
