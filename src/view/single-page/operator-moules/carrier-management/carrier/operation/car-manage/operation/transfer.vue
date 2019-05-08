<template>
    <div class="DM-edit">
        <div class="my-modal-wrap">
            <div class="transfer-table-wrap">
                <div class="my-table-wrap">
                    <div class="my-table-header">待转移车辆</div>
                    <div class="white-block"></div>
                    <Table :columns="carColumns" :data="selectionLists" width="400" height="400"></Table>
                    <div class="my-table-footer"></div>
                </div>
                <div class="my-table-wrap">
                    <div class="my-table-header">选择绑定的车管</div>
                    <div class="white-block"></div>
                    <Table :columns="personColumns" :data="personData" width="400" height="400" ref="selection"></Table>
                    <div class="my-table-footer"></div>
                </div>
            </div>
            <div class="popView-footer-wrap">
                <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
                <Button size="large" type="primary" @click="commit(1)">确定</Button>
            </div>
        </div>
    </div>
</template>

<script>
import SearchList from '_a/search-list/search-list'
import { waitForTransferCarColumns, carManagerColumns } from '../car-manage.js'

export default {
    components: {
        SearchList
    },
    props: {
        popView: Boolean,
        selectionLists: {
            default: [],
            type: Array
        }
    },
    data () {
        return {
            personData: [
                {userName: '1'},{userName: '1'},{userName: '1'},
                {userName: '1'},{userName: '1'},{userName: '1'},
                {userName: '1'},{userName: '1'},{userName: '1'},
                {userName: '1'},{userName: '1'},{userName: '1'}
            ], // 车管数据
            carColumns: [],
            personColumns: []
        }
    },
    watch: {
        'popView': function(){
            if(this.popView){
                this.$refs.selection.selectAll(false)
            }
        }
    },
    mounted () {
        this.carColumns = waitForTransferCarColumns(this)
        this.personColumns = carManagerColumns(this)
    },
    methods: {
        commit: function(temp){
            if(temp){
                this.$emit('on-confirm', 1)                 
            } else {
                this.$emit('on-confirm')
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .transfer-table-wrap{
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-around;
        margin-bottom: 10px;
    }
    .my-table-wrap{
        width: 400px;
        position: relative;
    }
    .my-table-header{
        padding: 10px 16px 2px 16px;
        background: #f9fafc;
        color: #515a6e;
        border: 1px solid #dcdee2;
        border-bottom: none;
        border-radius: 6px 6px 0 0;
        box-sizing: border-box;
        position: absolute;
        z-index: 1000;
        width: 100%;
        font-weight: bold;
    }
    .white-block{
        height: 30px;
    }
</style>
