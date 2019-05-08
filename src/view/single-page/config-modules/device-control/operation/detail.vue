<template>
    <div class="device-detail-wrap">
        <Split v-model="split">
            <div slot="left" class="left-split-pane">
                <Form class="display-div">
                    <FormItem label="车辆VIN码 :">
                        <p class="device-detail-left-text">{{detailInfo.carVin}}</p>
                    </FormItem>
                    <FormItem label="车牌号 :">
                        <p class="device-detail-left-text">{{detailInfo.plateNumber}}</p>
                    </FormItem>
                    <FormItem label="所属运营商 :">
                        <p class="device-detail-left-text">{{detailInfo.operatorName}}</p>
                    </FormItem>
                    <FormItem label="当前接单设备 :">
                        <p class="device-detail-left-text">{{receiveDeviceMap[detailInfo.receiveDevice]}}</p>
                    </FormItem>
                </Form>
            </div>
            <div slot="right">
                <VTable
                    :total="total"
                    :current="current"
                    :pageSize="pageSize"
                    :parColumns="columns"
                    :parTableData="tableData"
                    @changePage="changePage"
                    @changePageSize="changePageSize">
                </VTable>
            </div>
        </Split>
    </div>
</template>
<script>
import { detailColumns, receiveDeviceMap } from '../index.js'
import { getEquitConfigDetail, getOperationRecord } from '@/api/configData.js'
import '@/styles/cyk-style.css'
 
export default {
    data () {
        return {
            current: 1,
            pageSize: 10,
            total: 10,
            columns: [],
            tableData: [],
            detailInfo: [],
            receiveDeviceMap: {},
            split: 0.25
        }
    },
    mounted () {
        this.columns = detailColumns(this)
        this.receiveDeviceMap = receiveDeviceMap
        this.getDetail(this.$route.query.carVin)
        this.getTableList()
    },
    methods: {
        getDetail(id) { // 获取详情
            getEquitConfigDetail({ carVin: id }).then(res => {
                this.detailInfo = res.data.data
            })
        },
        getTableList() {
            getOperationRecord({ carVin: this.$route.query.carVin }).then(res => {
                this.tableData = res.data.data.list
                this.total = res.data.data.totalCount
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        changePage: function(val){
            this.current = val
            this.getTableList()
        },
        changePageSize: function(val){
            this.pageSize = val
            this.getTableList()
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .device-detail-wrap{
        height: 666px;
    }
    .left-split-pane{
        border: 1px solid #dcdee2;
        height: 625px;
        border-right: none;
        padding: 20px;
        box-sizing: content-box;
    }
    .device-detail-left-text{
        line-height: 20px;
    }
</style>
