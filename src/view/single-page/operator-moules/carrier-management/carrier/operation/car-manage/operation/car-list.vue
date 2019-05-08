<!--车辆列表-->
<template>
    <div class="CM-detail">
        <div class="CM-detail-header">
            <div class="CM-detail-search-wrap">
                <Button type="primary" :disabled="!multipleTemp" @click="transfer">批量转移</Button>
            </div>
        </div>
        <div class="CM-content">
            <Table 
                :columns="parColumns" 
                :data="tableData" 
                @on-selection-change="selectColums" 
                ref="selection"></Table>
            <Page
                show-total
                :total="total" 
                :current="current"
                show-elevator 
                @on-change="changePage" 
                style="display: flex; justify-content: flex-end; margin-top: 15px;" />
        </div>
        <Modal v-model="popTransfer" :width="950" title="车辆转移" :mask-closable="false" footer-hide>
            <Transfer 
                @on-confirm="confirm" 
                :popView="popTransfer" 
                :selectionLists="selectionLists">  
            </Transfer>
        </Modal>
    </div>
</template>

<script>
import { returnDetailFields } from '../car-manage.js'
import Transfer from './transfer.vue'
 
export default {
    components: {
        Transfer
    },
    props: ['popView'],
    data () {
        return {
            parColumns: [],
            tableData:[],
            selectionLists: [],
            checkedList: [],
            isUpdate: false,
            multipleTemp: false,
            popTransfer: false,
            current: 1,
            total: 0
        }
    },
    watch: {
        'popView': function() {
            if(this.popView) {
                this.isUpdate = false
                this.$refs.selection.selectAll(false)
            }
        }
    },
    mounted () {
        this.parColumns = returnDetailFields(this)
        this.getTableList()
    },
    methods: {
        confirm: function(data){
            if(data) this.isUpdate = true
            this.popTransfer = false
        },
        transfer: function(){
            this.popTransfer = true
            this.selectionLists = JSON.parse(JSON.stringify(this.checkedList))
        },
        selectColums: function(selection){
            if(selection.length > 0){
                this.multipleTemp = true
                this.selectionLists = JSON.parse(JSON.stringify(selection))
                this.checkedList = JSON.parse(JSON.stringify(selection))
            } else {
                this.multipleTemp = false
            }
        },
        getTableList: function(params={}){ // 获取表格数据
            this.tableData = [
                { userName: '苏A89499' },
                { a: 'LF2A9899898' },
                { userName: 'ccc' },
                { userName: 'ddd' }
            ]
        },
        search: function(data){
            this.getTableList(data)
        },
        changePage: function(val){
            this.current = val
            this.getTableList()
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .CM-detail{
        padding: 0 15px;
    }
    .CM-detail-header{
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    .CM-detail-search-wrap{
        display: flex;
    }
</style>


