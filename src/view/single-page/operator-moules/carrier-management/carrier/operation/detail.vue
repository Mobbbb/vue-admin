<template>
    <div class="carrier-detail">
        <Tabs v-model="activeTab" @on-click="changeTab">
            <TabPane name="1" label="基本信息" style="padding: 0 10px;">
                <BasicInfo :carrierInfo="carrierInfo" :activeTab="activeTab" v-show="activeTab === '1'"></BasicInfo>
            </TabPane>
            <TabPane name="2" label="抽成管理" style="padding: 0 10px;">
                <DAPM :carrierInfo="carrierInfo" :activeTab="activeTab" v-show="activeTab === '2'"></DAPM>
            </TabPane>
            <TabPane name="3" label="补贴管理" style="padding: 0 10px;">
                <SubsidyManage :carrierInfo="carrierInfo" :activeTab="activeTab" v-show="activeTab === '3'"></SubsidyManage>
            </TabPane>
            <!-- <TabPane name="4" label="营运数据" style="padding: 0 10px;">
                <OperatorData :carrierInfo="carrierInfo" :activeTab="activeTab" v-show="activeTab === '4'"></OperatorData>
            </TabPane> -->
            <TabPane name="5" label="司管管理" style="padding: 0 10px;">
                <DMM :carrierInfo="carrierInfo" :activeTab="activeTab" v-show="activeTab === '5'"></DMM>
            </TabPane>
            <TabPane name="6" label="车管管理" style="padding: 0 10px;">
                <CMM :carrierInfo="carrierInfo" :activeTab="activeTab" v-show="activeTab === '6'"></CMM>
            </TabPane>
            <!--<TabPane name="7" label="司机考勤规则" style="padding: 0 10px;">
                <CheckOn :activeTab="activeTab" v-show="activeTab === '7'"></CheckOn>
            </TabPane>-->
        </Tabs>
    </div>
</template>

<script>
import { getCarrierInfo } from '@/api/operator-carrier'
import BasicInfo from './basic/basic-info.vue'
import DAPM from './drp-manage/drp-manage.vue'
import OperatorData from './operator-data/operator-data.vue'
import SubsidyManage from './subsidy/subsidy-managmt.vue'
import CMM from './car-manage/car-manage.vue'
import DMM from './driver-manage/driver-manage.vue'
import CheckOn from './checkon-manage/index.vue'

export default {
    components: {
        BasicInfo,      // 基础信息
        CMM,            // 车管管理
        DAPM,           // 抽成管理
        DMM,            // 司管管理
        OperatorData,   // 运营数据
        SubsidyManage,  // 补贴管理
        CheckOn         // 考勤管理
    },
    data () {
        return {
            activeTab: '1', // 当前激活tab
            carrierInfo: {}  // 运营商信息
        }
    },
    watch: {
        '$route.query.uuid': function(){
            this.getCarrierInfo() 
        }
    },
    mounted () {
        this.getCarrierInfo()
        if(sessionStorage.getItem('activeTab') !== null){ // 记录上次tab位置
            this.activeTab = sessionStorage.getItem('activeTab')
        }
    },
    methods: {
        getCarrierInfo: function(){ // 获取运营商信息
            getCarrierInfo({uuid: this.$route.query.uuid}).then(res => {
                this.carrierInfo = res.data.data
                for(let i = 0; i < this.carrierInfo.mobileList.length; i++){
                    if(this.carrierInfo.mobileList[i].number === ''){
                        this.carrierInfo.mobileList.splice(i, 1)
                        i --
                    }
                }
            })
        },
        changeTab: function(name){
            sessionStorage.setItem('activeTab', this.activeTab)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
