<template>
    <div class="announcement-detail">
        <Form :label-width="120">
            <FormItem label="公告状态：">
                <span>{{announceStatusMap[detailInfo.status]}}</span>
            </FormItem>
            <FormItem label="公告位置：">
                <span>{{announcePositionMap[detailInfo.localtion]}}</span>
            </FormItem>
            <FormItem label="发送范围：" v-if="detailInfo.localtion === 3">
                <TreeInput
                    inputHeight="auto"
                    :displayMode="true"
                    :isTreeData="true"
                    :TreeData="opGroup"
                    v-model="detailInfo.target"
                    IndexId='uuid'
                    title="title">
                </TreeInput>
            </FormItem>
            <FormItem label="发送范围：" v-else>
                <Spin v-if="loading" style="margin-top: 6px;"></Spin>
                <TreeInput
                    v-else
                    inputHeight="auto"
                    :displayMode="true"
                    :TreeData="cityList"
                    v-model="detailInfo.target"
                    IndexId='cityID'
                    title="city">
                </TreeInput>
            </FormItem>
            <FormItem label="公告类型：" v-if="detailInfo.localtion === 3">
                <span>{{announceTypeMap[detailInfo.noticeType]}}</span>
            </FormItem>
            <FormItem label="公告标题：">
                <span>{{detailInfo.noticeTitle}}</span>
            </FormItem>
            <FormItem label="公告副标题：" v-if="detailInfo.noticeSubTitle !== '' && detailInfo.noticeSubTitle !== null">
                <span>{{detailInfo.noticeSubTitle}}</span>
            </FormItem>
            <FormItem label="跳转链接：" v-if="detailInfo.noticeLink !== '' && detailInfo.noticeLink !== null">
                <span>{{detailInfo.noticeLink}}</span>
            </FormItem>
            <FormItem label="时间段：">
                <span>{{detailInfo.upTime}} - {{detailInfo.downTime}}</span>
            </FormItem>
            <FormItem label="创建人：">
                <span>{{detailInfo.creator}}</span>
            </FormItem>
            <FormItem label="创建时间：">
                <span>{{detailInfo.createdTime}}</span>
            </FormItem>
            <FormItem label="撤销人：" v-if="detailInfo.updater !== '' && detailInfo.updater !== null">
                <span>{{detailInfo.updater}}</span>
            </FormItem>
            <FormItem label="撤销时间：" v-if="detailInfo.updater !== '' && detailInfo.updater !== null">
                <span>{{detailInfo.updateTime}}</span>
            </FormItem>
            <FormItem label="公告banner图：" v-if="detailInfo.noticeBanner !== ''">
                <Button shape="circle" icon="ios-search" @click="checkImg">查看图片</Button>
                <Modal title="View Image" v-model="showImg" width="700">
                    <img :src="detailInfo.noticeBanner" style="width: 100%">
                </Modal>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { announceStatusMap, announcePositionMap, announceTypeMap } from './fields.js'
import { getCitys } from '@/api/common.js'
import TreeInput from '_a/treeInput/treeInput.vue'

export default {
    components: {
        TreeInput
    },
    props: ['detailInfo', 'popView'],
    data(){
        return{
            loading: true,
            opGroup: [],
            cityList: [],
            showImg: false,
            announceStatusMap: {},
            announcePositionMap: {},
            announceTypeMap: {}
        }
    },
    watch: {
        'popView': function(){
            if(this.popView){
                this.getCitys()
                this.opGroup = JSON.parse(localStorage.getItem('pcOperatorList'))
                this.announceStatusMap = announceStatusMap
                this.announcePositionMap = announcePositionMap
                this.announceTypeMap = announceTypeMap
            }
        }
    },
    methods:{
        checkImg() {
            this.showImg = true
        },
        backOneStep() {
            this.$router.push({
                name: 'announcement-center'
            })
        },
        getCitys() {
            getCitys().then(res => {
                this.cityList = res.data.data
                this.loading = false
            })
        }
    }
}
</script>
