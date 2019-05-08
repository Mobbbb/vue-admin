<template>
    <div class="checkoncom">
        <div class="opttop">
            <div class="liststaus">状态筛选：
                <Select
                    style="width:200px"
                    placeholder="请选择状态筛选"
                    v-model="checkonlistSearch.isDel"
                    @on-change="selectStatusCheckon">
                    <Option v-for="item in statsulist" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
            <Button type="primary" @click="addnewcheckon">新建策略</Button>
        </div>
        <VTable
            :total="checkon.total"
            :current="checkon.current"
            :pageSize="checkon.pageSize"
            :isLoading="checkon.isLoading"
            :parColumns="checkon.tableColumns"
            :parTableData="checkon.tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            style="margin-top: 25px;"> 
        </VTable>
        <!-- 停用弹框 -->
        <modal v-model="deleteModel" title="停用策略" @on-ok="deleteOK">
            <div class="top15">确定停用该策略?</div>
        </modal>
        <!-- 停用弹框 -->
        <modal v-model="restartModel" title="启用策略" @on-ok="restartOK">
            <div class="top15">确定启用该策略?</div>
        </modal>
        <!-- 考勤策略 编辑和新建-->
        <modal v-model="checkonModal" :title="checkoneditornew" :width="455">
            <div style="padding: 0 20px;">
                <div>策略名称：&nbsp;&nbsp;&nbsp;&nbsp;
                    <Input v-model="checkonmadaldata.strategyName" placeholder style="width: 300px" :disabled="isdisabled"/>
                </div>
                <div class="top15">策略类型：&nbsp;&nbsp;&nbsp;&nbsp;
                    <Select v-model="checkonmadaldata.strategyType" style="width:300px" :disabled="isdisabled">
                        <Option
                            v-for="(item,index) in checkonStrategyType"
                            :value="item.value"
                            :key="index">{{ item.label }}
                        </Option>
                    </Select>
                </div>
                <div class="top15">日在线时长：
                    <InputNumber
                        :min="0"
                        :max="1440"
                        :disabled="isdisabled"
                        v-model="checkonmadaldata.dayOnline">
                     </InputNumber>
                    <span style="margin: 0 20px 0 5px">分钟</span>
                    <Checkbox v-model="checkonmadaldata.dayOnlineEnable" :disabled="isdisabled">{{tiomebetween}}</Checkbox>
                </div>
                <div class="top15">日完成订单：
                    <InputNumber
                        :min="0"
                        :max="1440"
                        :disabled="isdisabled"
                        v-model.trim="checkonmadaldata.dayOrders">  
                    </InputNumber>
                    <span style="margin: 0 32px 0 5px">单</span>
                    <Checkbox v-model="checkonmadaldata.dayOrdersEnable" :disabled="isdisabled">{{orderfinishfont}}</Checkbox>
                </div>
                <div class="top15">条件关系：&nbsp;&nbsp;&nbsp;&nbsp;
                    <Select v-model="checkonmadaldata.relation" style="width:300px" :disabled="isdisabled">
                        <Option
                            v-for="(item, index) in conditionreals"
                            :value="item.value"
                            :key="index"
                        >{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="top15">适用城市：&nbsp;&nbsp;&nbsp;&nbsp;
                    <Cascader 
                        style="width:300px;display: inline-block;"
                        :data="cityList" 
                        v-model="cityCodeArrayCheckon" 
                        :disabled="isdisabled" 
                        @on-change="getSelectCity"> 
                    </Cascader>
                </div>
            </div>
            <div slot="footer">
                <Button type="text" @click="checkonModal=false">取消</Button>
                <Button type="primary" @click="addtenanceOK">确定</Button>
            </div>
        </modal>
    </div>
</template>

<script>
import {
    attendanceStrategyDelete,
    attendanceStrategyPage,
    attendanceStrategySave,
    attendanceStrategyUpdate
} from "@/api/configData.js";
import { returnFields } from "./fields.js";

export default {
    props: {
        activeTab: String
    },
    data () {
        return {
            checkoneditornew: "新建",
            checkonModal: false,
            isdisabled: false,
            maxlengths: 4,
            restartModel: false,
            deleteModel: false,
            checkonStrategyType: [
                {
                    value: 1,
                    label: "有效在线"
                },
                {
                    value: 2,
                    label: "非有效在线"
                }
            ],
            checkon: {
                total: 0,
                current: 1,
                pageSize: 10,
                isLoading: true,
                tableColumns: [], // 表格头
                tableData: [], //表格数据
                rootTabelData: []// 表格元数据
            },
            checkonmadaldata: {
                strategyName: "", //策略名称
                strategyType: "", //策略类型
                dayOnline: 0, // 日在线时长
                dayOnlineEnable: false, // //1启用，2禁用
                dayOrders: 0, //日完成订单
                dayOrdersEnable: false, //1启用，2禁用
                relation: "", //条件关系
                city: '', // 适用城市
            },
            checkonlistSearch: {
                isDel: '',
            },
            statsulist: [
                {
                    value: 999,
                    label: '全部'
                },
                {
                    value: 0,
                    label: '使用中'
                },
                {
                    value: 1,
                    label: '已停用'
                }
            ],
            conditionreals: [
                {
                    value: 1,
                    label: "同时满足"
                },
                {
                    value: 2,
                    label: "非不同时满足"
                }
            ],
            cityCodeArrayCheckon: [],
            cityList: []
        }
    },
    computed: {
        tiomebetween() {
            return this.checkonmadaldata.dayOnlineEnable ? "启用" : "关闭";
        },
        orderfinishfont() {
            return this.checkonmadaldata.dayOrdersEnable ? "启用" : "关闭";
        },
    },
    created() {
        Object.entries(returnFields(this)).forEach(([key, value]) => {
            this.checkon.tableColumns.push(value);
        });
        this.spareCityList()
    },
    watch: {
        'activeTab': function(){
            if(this.activeTab === '7') {
                this.$store.commit('changeLoadingFlag', true)
                this.getattendanceStragyList()
            }
        }
    },
    mounted () {
        // this.getattendanceStragyList()
    },
    methods: {
        selectStatusCheckon(data) {
            this.checkon.pageSize = 10
            this.checkon.current = 1
            this.getattendanceStragyList(data)
        },
        addnewcheckon() {
            this.editStatus = false
            this.isdisabled = false
            this.checkonModal = true
            this.checkonmadaldata = {
                strategyName: "", //策略名称
                strategyType: "", //策略类型
                dayOnline: 0, // 日在线时长
                dayOnlineEnable: false, // //1启用，2禁用
                dayOrders: 0, //日完成订单
                dayOrdersEnable: false, //1启用，2禁用
                relation: "", //条件关系
                city: '', // 适用城市
            }
            this.checkoneditornew = "新建策略"
            this.cityCodeArrayCheckon = []
        },
        changePage: function(val) {
            this.checkon.current = val
            this.getattendanceStragyList()
        },
        changePageSize: function(val) {
            this.checkon.pageSize = val
            this.getattendanceStragyList()
        },
        addtenanceOK() {
            let that = this
            let data = JSON.parse(JSON.stringify(this.checkonmadaldata))
            if (this.isdisabled) { 
                this.checkonModal = false
                return false 
            }
            if (!data.strategyName) {
                this.$Message.warning('请填写策略名称')
                return false
            }
            if (!data.strategyType) {
                this.$Message.warning('请选择策略类型')
                return false
            }
            if (data.dayOnlineEnable) {
                if (!data.dayOnline) {
                    this.$Message.warning('请输入在线时长')
                    return false
                }
            }
            if (data.dayOrdersEnable) {
                if (!data.dayOrders) {
                    this.$Message.warning('请输入在线时长')
                    return false
                }
            }
            if (!data.relation) {
                this.$Message.warning('请选择条件关系')
                return false
            }
            if (!data.city) {
                this.$Message.warning('请选择适用城市')
                return false
            }
            data.dayOnlineEnable = !data.dayOnlineEnable ?  '2': '1'
            data.dayOrdersEnable = !data.dayOrdersEnable ?  '2': '1'
            (data.city !== 1) && (data.cityID = data.city, data.city = 2)
            if (this.editStatus) {
                let uuid = this.checkon.tableData[this.editIndex].uuid
                data.uuid = uuid
                attendanceStrategyUpdate(data).then(res => {
                    this.checkonModal = false
                    this.$Message.success(res.data.msg)
                    this.getattendanceStragyList()
                }).catch(err => {

                })
            } else {
                attendanceStrategySave(data).then(res => {
                    this.checkonModal = false
                    this.$Message.success(res.data.msg)
                    this.getattendanceStragyList()
                }).catch(err => {
                    
                })
            }
        },
        getattendanceStragyList (data) {
            let checkon = this.checkon
            let dataJson = {
                pageSize: checkon.pageSize,
                currPage: checkon.current,
                isDel: data
            }
            if (data == 999) {
                delete dataJson.isDel
            }
            attendanceStrategyPage(dataJson).then(res => {
                this.checkon.tableData = JSON.parse(JSON.stringify(res.data.data.list))
                this.checkon.rootTabelData = res.data.data.list
                this.checkon.total = res.data.data.totalCount
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        getSelectCity(data) {
            this.checkonmadaldata.city = data[1]
        },
        spareCityList () {
            this.cityList = JSON.parse(localStorage.getItem('provinceCityList'))
        },
        deleteOK() {
            let attendancedata = this.checkon.tableData
            let uuid = attendancedata[this.deleteIndex].uuid
            attendanceStrategyDelete(`?uuid=${uuid}&isDel=1`).then(res => {
            this.$Message.success(res.data.msg)
            this.getattendanceStragyList()
            }).catch(err => {})
        },
        restartOK () {
            let uuid = this.checkon.tableData[this.deleteIndex].uuid
            attendanceStrategyDelete(`?uuid=${uuid}&isDel=0`).then(res => {
                this.restartModel = false
                this.$Message.success(res.data.msg)
                this.getattendanceStragyList()
            }).catch(err => {
            })
        },
    }
}
</script>
<style lang="less">
.opttop{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
    .liststaus{
        margin-right: 100px;
    }
}
</style>
