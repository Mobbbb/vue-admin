<!--操作页面主体-->
<template>
    <div>
        <Tabs v-model="tabType" type="line" @on-click="changeTab">
            <TabPane label="定价策略" name='1'></TabPane>
            <TabPane label="坏账策略" name='2'></TabPane>
            <TabPane label="折扣矩阵" name='3'></TabPane>
        </Tabs>
        <SearchList :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
        <Button type="primary" @click="popView('add', {})">{{addBtnText}}</Button>
        <div style="display: flex;margin-top: 16px;">
            <Card class="operation-left">
                <p class="city-name">{{params.cityName}}</p>
                <p class="province-name">{{params.provinceName}}</p>
                <p class="city-name" style="margin-top: 50px;">{{typeModuleMap[params.businessType]}}</p>
                <p class="province-name">{{openStatusMap[params.openStatus]}}</p>
            </Card>
            <VTable
                :total="total"
                :current="current"
                :pageSize="pageSize"
                :parColumns="columns"
                :parTableData="tableData"
                @changePage="changePage"
                @changePageSize="changePageSize"
                style="flex: 0.75;">
                <template slot-scope="params" slot="index">
                    <span>{{(current - 1)*pageSize + params.data.index + 1}}</span>
                </template>
                <template slot-scope="params" slot="action">
                    <Button
                        ghost
                        type="warning"
                        size="small"
                        @click="popView('detail', params)"
                        style="margin-right: 15px;">详情
                    </Button>
                    <Button ghost type="error" size="small" @click="remove(params)">删除</Button>
                </template>
            </VTable>
            <Modal
                :width="500"
                :mask-closable="false"
                :title="popPriceViewTitle"
                v-model="popPriceViewStatus"
                footer-hide>
                <UpdatePrice
                    :parentParams="params"
                    v-model="popPriceViewStatus"
                    @on-confirm="confirm">
                </UpdatePrice>
            </Modal>
            <Modal
                :width="500"
                :mask-closable="false"
                :title="popBadViewTitle"
                v-model="popBadViewStatus"
                footer-hide>
                <UpdateBad
                    :parentParams="params"
                    v-model="popBadViewStatus"
                    @on-confirm="confirm">
                </UpdateBad>
            </Modal>
            <Modal 
                :width="750"
                :mask-closable="false"
                :title="popAccountViewTitle"
                v-model="popAccountViewStatus"
                footer-hide>
                <UpdateAccount
                    :parentParams="params"
                    v-model="popAccountViewStatus"
                    @on-confirm="confirm">
                </UpdateAccount>
            </Modal>
        </div>
    </div>
</template>

<script>
import { openStatusMap, operationColumns, inputList, badInputList } from './index'
import { typeModuleMap } from '@/libs/status-map'
import { 
    getPriceStrategyList, 
    deletePriceStrategy, 
    getBadDebtList, 
    deleteBadDebt,
    getDiscountList,
    deleteDiscount
} from '@/api/openCity'
import UpdatePrice from './components/update-price.vue'
import UpdateBad from './components/update-bad.vue'
import UpdateAccount from './components/update-account.vue'

export default {
    components: {
        UpdatePrice,    // 新建定价策略/详情弹窗
        UpdateBad,      // 新建坏账策略/详情弹窗
        UpdateAccount   // 新建折扣矩阵/详情弹窗
    },
    data() {
        return {
            inputList: [],
            total: 0,
            current: 1,
            pageSize: 10,
            searchParams: {},
            columns: [],
            tableData: [],
            tabType: '1',       // 1: 定价策略  2: 坏账策略  3: 折扣矩阵
            

            /* 
             * 新增/详情所要的参数
             */
            params: {
                uuid: null,                 // 一条开通城市记录的uuid
                cityId: '',
                cityUuid: '',
                businessType: '',
                cityName: '',
                provinceName: '',
                openStatus: '',
                detailUuid: '',             // 查看详情/删除用uuid
            },
            
            addBtnText: '',                 // 新增按钮的文字
            popPriceViewStatus: false,      // 弹出定价策略新建/详情弹窗
            popBadViewStatus: false,        // 弹出坏账策略新建/详情弹窗
            popAccountViewStatus: false,    // 弹出折扣矩阵新建/详情弹窗
            popPriceViewTitle: '',          // 定价策略弹窗标题
            popBadViewTitle: '',            // 坏账策略弹窗标题
            popAccountViewTitle: '',        // 折扣矩阵弹窗标题
            typeModuleMap,
            openStatusMap,
            operationColumns
        }
    },
    watch: {
        '$route.query.uuid' () {
            this.tabType = this.$route.query.tabType
            this.init()
        }
    },
    mounted () {
        this.tabType = this.$route.query.tabType
        this.init()
    },
    methods: {
        init () {
            this.current = 1
            this.pageSize = 10
            this.searchParams = {}
            this.params.uuid = this.$route.query.uuid
            this.params.cityId = this.$route.query.cityId
            this.params.cityUuid = this.$route.query.cityUuid
            this.params.cityName = this.$route.query.city
            this.params.provinceName = this.$route.query.province
            this.params.openStatus = this.$route.query.status
            this.params.businessType = this.$route.query.businessType
            this.columns = [...this.operationColumns]
            this.inputList = JSON.parse(JSON.stringify(inputList))
            if (this.tabType === '1') {
                this.addBtnText = '新增定价策略'
                this.columns[1].key = 'fareTypeNote'
            } else if (this.tabType === '2') {
                this.addBtnText = '新增坏账策略'
                this.inputList = JSON.parse(JSON.stringify(badInputList))
                this.columns[1].key = 'name'
            } else {
                this.addBtnText = '新增折扣矩阵'
                this.columns[1].key = 'ruleName'
            }
            if (this.tabType === '2') this.columns.splice(3, 1)
            this.getTableList()
        },
        changeTab (name) {
            this.init()
        },
        popView (type, params) {
            this.params.detailUuid = params.data && params.data.row && params.data.row.uuid || null
            if (this.tabType === '1') {
                this.popPriceViewStatus = true      // 弹出定价策略
                if (type === 'add') this.popPriceViewTitle = '新建定价策略'
                else this.popPriceViewTitle = '定价策略详情'
            } else if (this.tabType === '2') {
                this.popBadViewStatus = true        // 弹出坏账策略
                if (type === 'add') this.popBadViewTitle = '新建坏账策略'
                else this.popBadViewTitle = '坏账策略详情'
            } else {
                this.popAccountViewStatus = true    // 弹出折扣矩阵
                if (type === 'add') this.popAccountViewTitle = '新建折扣矩阵'
                else this.popAccountViewTitle = '折扣矩阵详情'
            }
        },
        remove (params) {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确定要删除该策略吗？</p>',
                onOk: () => {
                    if (params.data.row.status === 1) { // 生效中
                        this.$Message.warning('策略正在生效中，不可删除')
                    } else {
                        if (this.tabType === '1') {
                            deletePriceStrategy({ uuid: params.data.row.uuid }).then(res => {
                                this.$Message.success('删除成功')
                                this.getTableList()
                            })
                        } else if (this.tabType === '2') {
                            deleteBadDebt({ uuid: params.data.row.uuid }).then(res => {
                                this.$Message.success('删除成功')
                                this.getTableList()
                            })
                        } else {
                            deleteDiscount({ uuid: params.data.row.uuid }).then(res => {
                                this.$Message.success('删除成功')
                                this.getTableList()
                            })
                        }
                    } 
                }
            })
        },
        getTableList () {
            let params = {...this.searchParams}
            params = Object.assign(params, this.params)
            params.pageSize = this.pageSize
            params.currPage = this.current
            this.$store.commit('changeLoadingFlag', true)
            if (this.tabType === '1') {
                getPriceStrategyList(params).then(res => {
                    let data = res.data.data
                    this.$store.commit('changeLoadingFlag', false)
                    this.tableData = data.pageResult && data.pageResult.list || []
                    this.total = data.pageResult && data.pageResult.totalCount || 0
                })
            } else if (this.tabType === '2') {
                getBadDebtList(params).then(res => {
                    let data = res.data.data
                    this.$store.commit('changeLoadingFlag', false)
                    this.tableData = data.pageResult && data.pageResult.list || []
                    this.total = data.pageResult && data.pageResult.totalCount || 0
                })
            } else {
                getDiscountList(params).then(res => {
                    let data = res.data.data
                    this.$store.commit('changeLoadingFlag', false)
                    this.tableData = data.pageResult && data.pageResult.list || []
                    this.total = data.pageResult && data.pageResult.totalCount || 0
                })
            } 
        },
        search (data) {
            this.current = 1
            this.searchParams = data
            this.getTableList()
        },
        reset (data) {
            this.current = 1
            this.searchParams = data
            this.getTableList()
        },
        changePageSize (val) {
            this.pageSize = val
            this.getTableList()
        },
        changePage (val) {
            this.current = val
            this.getTableList()
        },
        confirm () {
            this.getTableList()
        }
    }
}
</script>

<style scoped>
    .city-name{
        font-size: 22px;
        font-weight: bold;
    }
    .province-name{
        font-size: 16px;
    }
    .operation-left{
        flex: 0.25;
        height: 666px;
    }
</style>
