<!--
    *树形多选下拉选择框
-->
<template>
    <div class="multiple-tree-drop-select">
        <div class="dropShower display-mode" :style="{width: inputWidth, height: inputHeight}" v-if="displayMode">
            <ul>
                <li v-for="(item,index) in selectItems " :key="index">
                    <span>{{item.title}}</span>
                </li>
            </ul>
        </div>
        <Dropdown trigger="click" :placement="position" class="tree-drop" v-else>
            <div class="my-form-item-error">
                <div class="dropShower ivu-input" :style="{width: inputWidth, height: inputHeight}">
                    <ul>
                        <li v-for="(item,index) in selectItems " :key="index">
                            <span>{{item.title}}</span>
                            <!-- <i class="ivu-icon ivu-icon-ios-close" @click="changeTarget2(item,index)"></i> -->
                        </li>
                    </ul>
                </div>
            </div>
            <DropdownMenu slot="list" :style="{'minWidth': inputWidth}">
                <Tree :data="opGroup" show-checkbox @on-check-change='getNodes' ref='stree' :style="{'marginLeft': '10px'}"></Tree>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
import { treeDataTranslate, selectLabelByIds } from '@/libs/tools.js'
import '@/styles/cyk-style.css' 

export default {
    name:'tree-input',
    props: {
        isTreeData: {
            type: Boolean,
            default: false
        },
        displayMode: { // 是否开启展示模式
            type: Boolean,
            default: false
        },
        value: { // v-modal双向绑定
            type: Array,
            default: () => {
                return []
            }
        },
        allTitle: { // 全部选择框的文字内容
            type: String,
            default: '全部'
        },
        selectAll: { // 是否带有全部选择框
            type :Boolean,
            default: false
        },
        TreeData: { // 传入data
            type: Array,
            default: () => {
                return
            }
        },
        IndexId: { // 自身标识
            type: String,
            default: 'uuid'
        },
        title: { // 展示的字段名
            type: String,
            default: 'title'
        },
        position:{ // tree位置
            type:String,
            default: () => {
                return 'bottom-start'
            }
        },
        inputWidth:{ // 选择框宽度
            type: String,
            default: '280px'
        },
        inputHeight:{ // 选择框高度
            type: String,
            default: '67px'
        }
    },
    watch: {
        'TreeData': function(){
            this.buildTree()
            this.initSelectItems(this.selectUuid)
        },
        'value': function(){
            this.selectUuid = this.value
            this.buildTree()
            this.initSelectItems(this.selectUuid)
        }
    },
    data(){
        return{
            opGroup: [],
            selectItems: [],
            selectUuid: this.value
        }
    },
    mounted(){
        this.buildTree()
        this.initSelectItems(this.selectUuid)
    },
    methods:{
        initSelectItems(selectUuid) { // 初始化选中项
            let some = JSON.parse(JSON.stringify(this.hasAllCheck()))
            let labelList = []
            this.selectItems = []
            if(this.isTreeData){
                this.selectItems = selectLabelByIds(some, selectUuid)
            } else {
                for(let i = 0; i < some.length; i++){
                    for(let j = 0; j < selectUuid.length; j++){
                        if(some[i][this.IndexId] === selectUuid[j]){
                            some[i].checked = true
                            this.selectItems.push(some[i])
                            labelList.push(some[i].title)
                        }
                    }
                }
            }
            // this.opGroup = treeDataTranslate(some, this.IndexId, 'parentId')
            return labelList
        },
        getNodes(items) {
            let that = this
            this.selectUuid = []
            this.selectItems = JSON.parse(JSON.stringify(items))
            items.forEach(item => {
                that.selectUuid.push(item[that.IndexId])
            })
            this.$emit('update:parentData', this.selectUuid) // 传出data为parentData
            this.$emit('update:parentKeyData',this.transformLabel(this.selectItems)) //传出data的key， Array
            this.$emit('on-change', this.selectUuid) // 传出data为parentData
            this.$emit('input', this.selectUuid)
        },
        hasAllCheck() { // 是否加上全选框，加上的全选框id='_000'
            let some = JSON.parse(JSON.stringify(this.TreeData)) 
            if(this.selectAll){
                let parentObj = { 
                    title: this.allTitle,
                    parentId: '000_',
                    expand: true,
                }
                parentObj[this.IndexId] = '_000'
                some.unshift(parentObj)
            }
            some.forEach(element => {
                if( typeof(element.parentId) === 'undefined' || 
                    element.parentId === null || 
                    element.parentId === '') {
                    element.parentId = '_000' 
                }
                if(element[this.title]) element.title = element[this.title]
            })
            return some
        },
        // 转化label
        transformLabel(items){
            let arr = []
            items.forEach(element => {
                arr.push(element.title)
            });
            return arr
        },
        buildTree() {
            let some = JSON.parse(JSON.stringify(this.hasAllCheck()))
            this.opGroup = treeDataTranslate(some, this.IndexId, 'parentId')
        }
    }
}
</script>

<style lang="less" scoped>
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
    .dropShower::-webkit-scrollbar{
        display: none;
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
