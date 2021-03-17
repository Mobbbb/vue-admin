<template>
	<div>
        <div style="margin-bottom: 15px;">{{parentParams.cityName}}</div>
		<VTable
            :height="540"
            :total="total"
            :current="current"
            :parColumns="columns"
            :parTableData="tableData"
            :isShowPage="false">  
        </VTable>
	</div>
</template>

<script>
import { dRevisionColumns, mRevisionColumns } from '../fields'
import { getRevisionList } from '@/api/driver'

export default {
	props: {
        parentParams: {
            type: Object
        }, 
        value: {
            type: Boolean
        }
    },
	data() {
	    return {
	    	total: 0,
            current: 1,
            columns: [],
            tableData: []
	    }
	},
	watch: {
		'value' () {
			if(this.value) {
            	if(this.parentParams.examineType === 'D'){
                    this.columns = dRevisionColumns(this)
                } else {
                    this.columns = mRevisionColumns(this)
                }
                this.getTableData()
			}
		}
	},
	methods: {
        getTableData () {
            let params = {
                pageSize: 10,
                currPage: this.current
            }
            params = Object.assign(params, this.parentParams)
            if (params.examineType === 'D') {
                delete params.month
                delete params.examineYear
            }
            getRevisionList(params).then(res => {
                let data = res.data.data && res.data.data.list || []
                this.tableData = data
                this.total = data.totalCount || 0
            })
        }
	}
}
</script>

<style scoped>

</style>