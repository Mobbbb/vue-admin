<template>
    <div class="popView" v-show="popView">
        <div class="ivu-modal-mask"></div>
        <div class="popView-wrap" :style="{'top': top + 'px'}">
            <div class="popView-content" :style="{'width': width + 'px'}">
                <div class="popView-title-wrap" :style="{'width': width + 'px','top': top + 'px'}">
                    <span class="popView-title">{{title}}</span>
                    <div class="popView-icon">
                        <Icon class="close-icon" type="md-close" @click="commit(0)"/>
                    </div>
                </div>
                <div class="popView-body-wrap">
                    <ul class="popView-body" :class="rowNum">
                        <li class="popView-body-row">
                            <div class="popView-input">
                                <Select
                                    placeholder="请输入分组名搜索"
                                    class="user-remodel-input"
                                    filterable
                                    remote
                                    ref="remodelInput"
                                    @on-query-change="search"
                                    :remote-method="remoteMethod">
                                </Select>
                            </div>
                        </li>
                        <li class="popView-body-row">
                            <span class="popView-name">选择上级分组:</span>
                        </li>
                        <li class="popView-body-row" style="position: relative;">
                            <Spin :style="{margin: '10px 0'}" v-if="Loading" fix size="large"></Spin>
                            <Tree
                                v-else
                                ref="tree"
                                :data="treeData" 
                                class="user-tree"
                                style="margin: -15px 0 0 0px;"
                                empty-text="暂无数据">
                            </Tree>
                        </li>
                    </ul>
                    <div class="popView-footer-wrap">
                        <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
                        <Button size="large" type="primary" @click="commit(1)">确定</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { treeDataTranslate, getCheckedNode } from '@/libs/tools'
import { allGroupList } from '@/api/power-data'

export default {
    props: {
        popView: Boolean,
        width: Number,
        top: {
            default: 150,
            type: Number
        },
        title: {
            default: '选择分组',
            type: String
        },
        rowNum: {
            default: '',
            type: String
        }
    },
    data () {
        return {
            Loading: true,
            treeData: [],
        }
    },
    watch: {
        'popView': function(){
            this.$refs.remodelInput.$children[0].query = ''
            this.getAllList({})
        }
    },
    methods: {
        remoteMethod: function(data){},
        search: function(data){
            this.getAllList({
                groupName: data
            })
        },
        getAllList: function(data){ // 获取所有分组
            allGroupList(data).then(res => {
                this.Loading = false
                if(res.data.success){
                    let that = this
                    this.treeData = res.data.data
                    this.treeData.forEach(function(item, index){
                        that.treeData[index].title = item.groupName
                    })
                    this.treeData = treeDataTranslate(res.data.data, 'uuid', 'parentUuid')
                }
            })
        },
        commit: function(temp){
            if(temp){
                if(this.$refs.tree.getSelectedNodes().length){
                    let data = {
                        groupName: this.$refs.tree.getSelectedNodes()[0].groupName,
                        uuid: this.$refs.tree.getSelectedNodes()[0].uuid,
                    }
                    this.$emit('on-confirm', data)
                } else {
                    this.$Message.warning('请选择分组')
                }
            } else {
                this.$emit('on-confirm', 0)
            }
            
        }
    }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .clickInput{
        display: inline-block;
        width: 100%;
        height: 32px;
        line-height: 1.5;
        padding: 4px 7px;
        font-size: 12px;
        border: 1px solid #dcdee2;
        border-radius: 4px;
        color: #515a6e;
        background-color: #fff;
        cursor: pointer;
        transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
        -webkit-transition: border 0.2s ease-in-out, background 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
    }
    .clickInput:hover{
        border-color: #57a3f3;
    }
    .close-icon{
        font-size: 18px;
    }
    @keyframes showPopView{
        from {opacity: 0;}
        to {opacity: 1;}
    }
    .popView{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        outline: 0;
        z-index: 1000;
        animation: showPopView 0.5s;
    }
    .popView-wrap{
        position: relative;
        top: 100px;
        height: 100%;
        z-index: 1000;
    }
    .popView-content{
        width: 400px;
        margin: 0 auto;
        background-color: white;
        overflow-y: auto;
        max-height: 70%;
        border-radius: 6px;
    }
    .popView-title-wrap{
        border-radius: 6px 6px 0 0;
        position: fixed;
        z-index: 10;
        top: 100px;
        width: 400px;
        padding: 14px 16px;
        margin: 0 auto;
        font-weight: bold;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        box-sizing: border-box;
        background: white;
        border-bottom: 1px solid #e8eaec 
    }
    .popView-title{
        line-height: 20px;
        font-size: 14px;
        color: #17233d;
        font-weight: 700;
    }
    .popView-body-wrap{
        margin-top: 46px;
        box-sizing: border-box;
        padding: 25px 20px;
        font-size: 13px;
    }
    .popView-body{
        display: flex;
        flex-wrap: wrap;
    }
    .popView-body .popView-body-row{
        width: 100%;
        list-style: none;
        margin-bottom: 10px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: nowrap;
    }
    .half-row .popView-body-row{
        width: 50%;
    }
    .popView-body .popView-body-row .popView-name{
        width: 100px;
        display: inline-block;
        font-weight: 800;
        color: #676a6c;
        text-align: right;
        padding-right: 15px;
        line-height: 29px;
    }
    .popView-body .popView-body-row .popView-input{
        flex: 1;
    }
    .tipsMsgInput{
        width: 550px;
        font-size: 12px;
        position: absolute;
        bottom: -23px;
        left: 0;
    }
    .popView-footer-wrap{
        display: flex;
        justify-content: flex-end;
        padding-top: 10px;
    }
    .editorBtn:first-child{
        margin-right: 60px;
    }
    .editorBtn{
        width: 80px;
    }
    .popView-icon{
        display: flex;
        align-items: center;
    }
    .popView-icon *{
        cursor: pointer; 
    }
</style>
