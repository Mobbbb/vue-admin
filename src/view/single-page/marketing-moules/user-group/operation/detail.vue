<template>
    <div style="width: 600px;margin: 30px auto;">
        <Card>
            <Form :label-width="100">
                <FormItem label="用户群名称 :">
                    {{params.userGroupName}}
                </FormItem>
                <FormItem label="用户群类型 :">
                    {{conditionType[params.userGroupType]}}         
                </FormItem>
                <FormItem label="条件 :" v-if="params.userGroupType === 2">
                    <div v-if="condition.cityType !== null">
                        <span class="detail-title">城市 :</span>
                        <span>{{cityTypeMap[condition.cityType]}} </span>
                        <span>{{condition.cityName.join('、')}}</span>
                    </div>
                    <div v-if="condition.startAge !== null">
                        <span class="detail-title">年龄 :</span>
                        <span>{{condition.startAge}}至{{condition.endAge}}岁</span>
                    </div>
                    <div v-if="condition.orderRecentDay !== null || condition.orderStartDate !== null">
                        <span class="detail-title">下单时间 :</span>
                        <span v-if="condition.orderRecentDay !== null">最近{{condition.orderRecentDay}}天</span>
                        <span v-else>{{condition.orderStartDate}} ~ {{condition.orderEndDate}}</span>
                    </div>
                    <div v-if="condition.finishCount !== null">
                        <span class="detail-title">完单数量 :</span>
                        <span>{{condition.finishCountTag}}{{condition.finishCount}}单</span>
                    </div>
                    <div v-if="condition.orderStartTime !== null">
                        <span class="detail-title">下单时段 :</span>
                        <span>{{condition.orderStartTime}} ~ {{condition.orderEndTime}}</span>
                    </div>
                    <div v-if="condition.registRecentDay !== null || condition.registStartDate !== null">
                        <span class="detail-title">注册时间 :</span>
                        <span v-if="condition.registRecentDay !== null">
                            最近{{condition.registRecentDay}}天
                        </span>
                        <span v-else>{{condition.registStartDate}} ~ {{condition.registEndDate}}</span>
                    </div>
                    <div v-if="condition.lastLoginTimeDay !== null || condition.lastLoginTimeStartDate !== null">
                        <span class="detail-title">最近一次冒泡时间 :</span>
                        <span v-if="condition.lastLoginTimeDay !== null">
                            最近{{condition.lastLoginTimeDay}}天
                        </span>
                        <span v-else>
                            {{condition.lastLoginTimeStartDate}} ~ {{condition.lastLoginTimeEndDate}}
                        </span>
                    </div>
                </FormItem>
                <FormItem label="用户群人数 :">
                    <span style="font-weight: bold;" v-if="params.userGroupCount === null">计算中...</span>
                    <span style="font-weight: bold;" v-else>{{params.userGroupCount}}人</span>
                </FormItem>
                <FormItem v-if="params.userGroupType === 1">
                    <Button type="primary" @click="download">下载用户清单</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script>
import { conditionType, cityTypeMap } from '../index'
import { getUserGroupDetail } from '@/api/marketing'

export default {
    data() {
        return {
            cityTypeMap,
            conditionType,
            params: {},
            condition: {}
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.getDetail()
        next()
    },
    created() {
        this.getDetail()
    },
    methods: {
        getDetail () {
            let params = {
                uuid: this.$route.query.uuid,
                userGroupType: Number(this.$route.query.userGroupType),
            }
            getUserGroupDetail(params).then(res => {
                let data = res.data.data
                if (data.userGroupType === 1) { // 导入类
                    this.params = data
                }
                if (data.userGroupType === 2) { // 条件类
                    this.params = data
                    this.condition = data.userGroupFeatureCfg
                    for (let key in this.condition) {
                        this.condition[key] = this.condition[key] || null
                    }
                }
            })
        },
        download () {
            let url = this.params.ossUrl.split(',')
            url.forEach(item => {
                if (item !== '') window.location.href = item
                else this.$Message.warning('文件地址错误！')
            })
        }
    }
}
</script>

<style scoped>
    .detail-title{
        display: inline-block;
        width: 120px;
    }
</style>