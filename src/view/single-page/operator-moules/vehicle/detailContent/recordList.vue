<!--违章记录-->
<template>
    <div>
        <VTable
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :parColumns="recordColumns"
            :parTableData="recordData"
            @changePage="changePage"
            @changePageSize="changePageSize">
        </VTable>
        <Modal v-model="detailModal" title="司机详情">
            <div style="height:200px">
                <div class="p1">司机姓名:  {{driverInfo.driverName}}</div>
                <div class="p1">联系电话: {{driverInfo.mobile}}</div>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getViolationRecord } from '@/api/vehicle.js'

export default {
    name:'record-list',
    created(){
        this.getList()
    },
    data(){
        return{
            recordData:[],
            recordColumns:[
                {
                    type:'index',
                    title:'序号',
                    minWidth: 100,
                    tooltip: true
                },
                {
                    key:'changeTime',
                    title:'违章时间',
                    minWidth: 100,
                    tooltip: true
                },
                {
                    key:'location',
                    title:'违章地点',
                    minWidth: 100,
                    tooltip: true
                },
                {
                    key:'driverName',
                    title:'违章司机',
                    minWidth: 100,
                    tooltip: true,
                    render:(h,params)=>{
                        return h('div',[
                            h('a',{
                                on:{
                                    click:()=>{
                                        this.handleOpen(params)
                                    }
                                },
                                domProps:{
                                    innerHTML: params.row.driverName
                                }
                            })
                        ])
                    }

                },
                {
                    key:'reason',
                    title:'违章行为',
                    minWidth: 100,
                    tooltip: true
                },
                {
                    key:'fines',
                    title:'罚款（元）',
                    minWidth: 100,
                    tooltip: true
                },
                {
                    key:'penaltyPoint',
                    title:'扣分',
                    minWidth: 100,
                    tooltip: true
                },
                {
                    key:'status',
                    title:'处理状态',
                    minWidth: 100,
                    tooltip: true,
                    render:(h, params) =>{
                        if(params.row.status== 0) {
                         return h ('div',[
                            h('span', {
                                style:{
                                      color: '#AD3A37',
                                }   
                            },'未处理 ❗'),
                        ])
                        }
                        if(params.row.status== 1) {
                         return h ('div',[
                            h('span', {
                                style:{
                                  color:'#009a61'
                                }   
                            },'已处理🙂'),
                        ])
                        }
                    }
                }
            ],
            total: null,
            current: 1,
            pageSize: 10,
            detailModal:false,
            driverInfo:{}
        }
    },
    methods:{
        getList(){
            let data= {
                currPage: this.current,
                pageSize: this.pageSize,
                vin: this.$route.params.id
            }
            this.$store.commit('changeLoadingFlag', true)
            getViolationRecord(data).then(res =>{
                this.$store.commit('changeLoadingFlag', false)
                this.recordData = res.data.data.list
                this.total = res.data.data.totalCount
            })
        },
        changePageSize(val){
            this.pageSize = val;
            this.getList()
        },
        changePage(val){
            this.current = val
            this.getList()
        },
        handleOpen(val){
            this.detailModal = true
            this.driverInfo.driverName = val.row.driverName
            this.driverInfo.mobile = val.row.mobile
        }
    }
}
</script>

<style scoped>
.p1{
    font-size: 16px;
    height: 22px;
    line-height: 22px;
    margin-top: 15px
}
</style>
