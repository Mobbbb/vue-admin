 <!-- backEnd: 车厘子-赵根飞 -->
<template>
  <div>
    <Tabs v-model="activeTab">
        <TabPane name="1" label="日考勤管理" style="padding-top: 10px;">
            <DayAttendance v-show="activeTab === '1'"></DayAttendance>
        </TabPane>
        <TabPane name="2" label="月考勤管理" style="padding-top: 10px;">
            <MonthAttendance v-show="activeTab === '2'"></MonthAttendance>
        </TabPane>
        <!--<TabPane name="3" label="考勤规则" style="padding-top: 10px;">
            <RuleAttendance v-show="activeTab === '3'"></RuleAttendance>
        </TabPane>-->
        <TabPane name="4" label="请假审批" style="padding-top: 10px;">
            <ApprovalManagement v-show="activeTab === '4'"></ApprovalManagement>
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import MonthAttendance from './month-attendance/index';
import DayAttendance from './day-attendance/index';
import RuleAttendance from './rule-attendance/index';
import ApprovalManagement from './approval-management/index';

export default {
    components: {
        MonthAttendance,
        DayAttendance,
        RuleAttendance,
        ApprovalManagement
    },
    data(){
        return {
            activeTab: '1'
        }
    }
}
</script>

<style lang="less">
.content-container {
    margin: 10px 0 0 0;
    .operate-wrap {
        margin: 0 0 10px 0;
        text-align: right;
    }
}
</style>
