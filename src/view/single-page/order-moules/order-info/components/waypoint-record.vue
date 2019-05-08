<template>
    <div>
        <VTable
            :isShowPage="false"
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :parColumns="wayRecords"
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize">
        </VTable>
    </div>
</template>

<script>
import { wayRecords } from "../fields"
import { getRoutePointRecord } from '@/api/order'

export default {
    props: ['activeIndex'],
    data() {
        return {
            total: 0,
            current: 1,
            pageSize: 10,
            tableData: [],
            wayRecords
        }
    },
    watch: {
        'activeIndex': function(){
            if(this.activeIndex === '2') {
                this.getTableList()
            }
        }
    },
    methods: {
    	getTableList: function(){ // 获取表格数据
            getRoutePointRecord({ routeUuid: this.$route.params.id }).then(res => {
                this.$store.commit('changeLoadingFlag', false)
                let data = res.data.data || []
                data.forEach(item => {
                    item.passingPoint.forEach((cell, index) => {
                        item['passing' + index] = cell
                    })
                })
                this.tableData = data
            })
        },
        changePage (val) {
        	this.current = val
            this.getTableList()
        },
		changePageSize () {
        	this.pageSize = val
            this.getTableList()
        }
    }
}
</script>

<style scoped>
    
</style>
