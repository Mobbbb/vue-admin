<template>
    <div class="DM-edit">
        <div class="my-modal-wrap">
            <SearchList 
                :inputList="disInputList" 
                @on-search="search" 
                style="padding: 0 0 10px 40px;">
            </SearchList>
            <Transfer
                class="my-transfer"
                :operations="['移除','选中']"
                :titles="['全部车辆', '已选择的车辆']"
                :list-style="{ width: '500px',height: '400px', paddingBottom: '43px'}"
                :data="transferData"
                :target-keys="targetKeys"
                :render-format="render"
                @on-change="handleChange">
                <div class="my-transfer-wrap">
                    <div class="my-transfer-title-wrap">
                        <div style="width: 50px;">选择</div>
                        <div style="width: 135px;">车牌号</div>
                        <div style="width: 140px;">车辆VIN码</div>
                        <div style="width: 140px;">所属司管</div>
                    </div>
                    <div class="my-transfer-body-wrap">
                        <div class="my-transfer-line-wrap" v-for="(item, index) in targeList" :key="index">
                            <div style="width: 135px;">{{item.label}}</div>
                            <div style="width: 140px;">{{item.mobile}}</div>
                            <div style="width: 140px;">{{item.master}}</div>
                            <div style="width: 50px;" class="transfer-delete" @click="deleteTarget(item.key, index)">删除</div>
                        </div>
                    </div>
                </div>
                <div class="my-transfer-footer">
                    <Page :current="1" :total="100" @on-change="changePage"/>
                </div>
            </Transfer>
            <div class="popView-footer-wrap">
                <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
                <Button size="large" type="primary" @click="commit(1)">确定</Button>
            </div>
        </div>
    </div>
</template>

<script>
import SearchList from '_a/search-list/search-list'
import { disInputList } from '../car-manage.js'

export default {
    components: {
        SearchList
    },
    props: {
        popView: Boolean
    },
    data () {
        return {
            disInputList: [],
            transferData: [],
            targetKeys: [],
            targeList: []
        }
    },
    watch: {
        'popView': function(){
            this.disInputList = disInputList
        }
    },
    mounted(){
        this.getTableList()
    },
    methods: {
        render: function(item){
            return  '<div style="flex:1;">' + item.label + "</div>"+
                    '<div style="flex:1;">' + item.mobile + "</div>"+
                    '<div style="flex:1;">' + item.master + "</div>"
        },
        getTableList: function(params={}){ // 获取表格数据
            this.transferData =  [
                { key: 1, label: "Content 1", mobile: 110, master: '张三丰'},
                { key: 2, label: "Content 2", mobile: 110, master: '李莫愁'},
                { key: 3, label: "Content 3", mobile: 17826833467, master: '任我行'},
                { key: 4, label: "Content 4", mobile: 110, master: 'aaa'},
                { key: 5, label: "Content 5", mobile: 110, master: 'aaa'},
                { key: 6, label: "Content 6", mobile: 110, master: 'aaa'}
            ]
            this.targetKeys = [1,2,3]
            this.targeList = [
                { key: 1, label: "Content 1", mobile: 110, master: '张三丰'},
                { key: 2, label: "Content 2", mobile: 110, master: '李莫愁'},
                { key: 3, label: "Content 3", mobile: 17826833467, master: '任我行'}
            ]
        },
        handleChange: function(newTargetKeys, direction, moveKeys){
            this.targetKeys = [...this.targetKeys, ...moveKeys]
            for(let i = 0; i < this.transferData.length; i++){
                for(let j = 0; j < moveKeys.length; j++){
                    if(this.transferData[i].key === moveKeys[j]){
                        this.targeList.push(this.transferData[i])
                    }
                }
            }
        },
        deleteTarget: function(deleteKey, index){
            this.targeList.splice(index, 1)
            for(let i = 0; i < this.targetKeys.length; i++){
                if(this.targetKeys[i] === deleteKey){
                    this.targetKeys.splice(i, 1)
                }
            }
        },
        commit: function(temp){
            if(temp){
                this.$emit('on-confirm', 1)                 
            } else {
                this.$emit('on-confirm')
            }
        },
        search: function(data){
            this.current = 1
            this.getTableList(data)
        },
        changePage: function(page){
            if(page === 2){
                this.transferData =  [
                    { key: 11, label: "11", mobile: 110, master: '张三丰'},
                    { key: 22, label: "12", mobile: 110, master: '李莫愁'},
                    { key: 33, label: "13", mobile: 17826833467, master: '任我行'},
                    { key: 44, label: "14", mobile: 110, master: 'aaa'},
                    { key: 55, label: "15", mobile: 110, master: 'aaa'},
                    { key: 66, label: "16", mobile: 110, master: 'aaa'}
                ]
            } else {
                this.transferData =  [
                    { key: 1, label: "Content 1", mobile: 110, master: '张三丰'},
                    { key: 2, label: "Content 2", mobile: 110, master: '李莫愁'},
                    { key: 3, label: "Content 3", mobile: 17826833467, master: '任我行'},
                    { key: 4, label: "Content 4", mobile: 110, master: 'aaa'},
                    { key: 5, label: "Content 5", mobile: 110, master: 'aaa'},
                    { key: 6, label: "Content 6", mobile: 110, master: 'aaa'}
                ]
            }
        }
    }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .my-transfer{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .my-transfer-footer{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .my-transfer .ivu-transfer-list:last-child .my-transfer-footer{
        display: none;
    }
    .my-transfer .ivu-transfer-list:last-child .my-transfer-wrap{
        top: -372px;
        height: 300px;
    }
    .my-transfer .ivu-transfer-list:last-child .my-transfer-wrap .my-transfer-title-wrap{
        margin-bottom: 10px;
    }
    .my-transfer .ivu-transfer-list:last-child .my-transfer-wrap .my-transfer-title-wrap > div:first-child{
        display: none;
    }
    .my-transfer .ivu-transfer-list:first-child .my-transfer-wrap .my-transfer-line-wrap{
        display: none;
    }
    .my-transfer .ivu-transfer-list:last-child .my-transfer-wrap .my-transfer-body-wrap{
        height: 265px;
        overflow: scroll;
    }
    .my-transfer .ivu-transfer-list:last-child .my-transfer-wrap .my-transfer-body-wrap::-webkit-scrollbar{
        display: none;
    }
    .my-transfer-wrap{
        position: absolute;
        top: -340px;
        width: 100%;
    }
    .my-transfer-title-wrap, .my-transfer-line-wrap{
        display: flex;
        width: 100%;
        padding: 0 11px;
        border: 1px solid #dcdee2;
        box-sizing: border-box;
        height: 46px;
        line-height: 50px;
        font-size: 14px;
        border-top: none;
        font-weight: bold;
        background-color: #fafafa;
    }
    .my-transfer-line-wrap{
        font-weight: normal;
        border-bottom: none;
        background-color: white;
        font-size: 12px;
        height: auto;
    }
    .my-transfer-line-wrap > div{
        padding: 7px 0;
        height: 31.27px;
        line-height: normal;
    }
    .my-transfer-line-wrap:hover{
        background-color: #f3f3f3;
    }
    .transfer-delete{
        color: #EF5B5E;
    }
    .transfer-delete:hover{
        cursor: pointer;
    }
</style>
