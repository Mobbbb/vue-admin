<template>
    <Card>
        <p slot="title">新增公告</p>
        <Form :label-width="110">
            <FormItem label="公告状态：">
                <span>待发布</span>
            </FormItem>
            <FormItem label="公告位置：">
                <RadioGroup v-model="announceForm.localtion" @on-change="changeRadio">
                    <Radio :label="1" :value="1">首页轮播</Radio>
                    <Radio :label="2" :value="2">乘客公告</Radio>
                    <Radio :label="3" :value="3">司机公告</Radio>
                </RadioGroup>
            </FormItem>
        </Form>
        
        <Form ref="treeValidate" :model="announceForm" :label-width="110" :rules="treeRule">
            <FormItem label="发送范围：" class="special-form-line" prop="target">
                <TreeInputs
                    :data="opGroup"
                    v-model="announceForm.target"
                    v-show="announceForm.localtion === 3">
                </TreeInputs>
                <TreeInputs
                    :data="cityList"
                    v-model="announceForm.target"
                    v-show="announceForm.localtion === 2 || announceForm.localtion === 1">
                </TreeInputs>
            </FormItem>
        </Form>
        <Form ref="formValidate" :model="announceForm" :label-width="110" :rules="dataRule">
            <FormItem label="公告类型：" prop="noticeType" v-if="announceForm.localtion === 3">
                <Select v-model="announceForm.noticeType" style="width: 300px" placeholder="请选择公告类型">
                    <Option :value="1">政策通知</Option>
                    <Option :value="2">培训通知</Option>
                    <Option :value="3">其他通知</Option>
                </Select>
            </FormItem>
            <FormItem label="公告标题：" prop="noticeTitle">
                <Input v-model="announceForm.noticeTitle" placeholder="请填写公告标题" style="width: 300px" />
            </FormItem>
            <div v-if="announceForm.localtion !== 1">
                <FormItem label="公告副标题：">
                    <Input v-model="announceForm.noticeSubTitle" placeholder="请填写公告副标题" style="width: 300px" />
                </FormItem>
                <FormItem label="公告banner图：">
                    <UploadImg 
                        :action="_baseUrl + '/common/uploadPics'"
                        @on-uperror="onUperror"
                        @before-upload="beforeUpload"
                        @on-upsuccess="getPicUrl">  
                    </UploadImg>
                </FormItem>
            </div>
            <FormItem label="跳转链接：">
                <Input v-model="announceForm.noticeLink" placeholder="请填写跳转链接" style="width: 300px" />
            </FormItem>
            <FormItem label="时间段：" prop="time">
                <DatePicker
                    :clearable="false"
                    :options="dayOptions"
                    v-model="announceForm.time" 
                    type="datetimerange" 
                    placeholder="请选择上下线日期" 
                    style="width: 300px">  
                </DatePicker>
            </FormItem>
            <div style="margin-left: 110px;">
                <Button @click="back" style="margin-right: 10px;">返回</Button>
                <Button type="primary" @click="submit" :loading="loading">提交</Button>
            </div>         
        </Form>
    </Card>
</template>

<script>
import TreeInput from '_a/treeInput/treeInput.vue'
import UploadImg from '_a/v-upload/v-upload.vue'
import TreeInputs from '_a/tree-input/tree-input.vue'
import { addAnnounce } from '@/api/announcement.js'
import { getCitys } from '@/api/common.js'
import { changeKeyMethod, changeListKey } from '@/libs/tools.js'

export default {
    components: { 
        TreeInput,
        UploadImg,
        TreeInputs
    },
    data() {
        const targetPass = (rule, value, callback) => {
            if(value.length) callback()
            else callback(new Error('发送范围不得为空'))
        }
        const timePass = (rule, value, callback) => {
            if(value !== '') callback()
            else callback(new Error('时间段不得为空'))
        }
        const noticeType = (rule, value, callback) => {
            if(this.announceForm.localtion === 3) {
                if(value !== '' && typeof(value) !== 'undefined'){
                    callback()
                } else {
                    callback(new Error('公告类型不得为空'))
                }
            }
            else callback()
        }
        return {
            arr: [],
            treeRule: {
                target: [{
                    required: true, trigger: 'change', validator: targetPass
                }]
            },
            dataRule: {
                noticeTitle: [{
                    required: true, trigger: 'change', message: '公告标题不得为空'
                }],
                time: [{
                    required: true, validator: timePass, trigger: 'change'
                }],
                noticeType: [{
                    required: true, validator: noticeType, trigger: 'change'
                }]
            },
            initAnno: {
                localtion: 1,
                noticeBanner: '',
                upTime: '',
                downTime: '',
                time: '',
                target: []
            },
            dayOptions: {
                disabledDate(date) {
                    return date && date.valueOf() < Date.now() - 86400000
                }
            },
            loading: false,
            announceForm: {
                target: []
            },
            cityList: [],
            opGroup: [],
        }
    },
    mounted() {
        this.getCitys()
        this.opGroup = [{
            children: JSON.parse(localStorage.getItem('pcOperatorList')),
            title: '全部运营商',
            value: '000000',
            expand: true
        }]
        this.announceForm = JSON.parse(JSON.stringify(this.initAnno))
    },
    methods: {
        beforeUpload(file) {
            this.loading = true
        },
        onUperror() {
            this.loading = false
        },
        back() {
            this.$router.push({
                name: 'announcement-center'
            })
        },
        getCitys() {
            getCitys().then(res => {
                changeListKey(res.data.data, 'cityID', 'value')
                changeListKey(res.data.data, 'city', 'title')
                this.cityList = [{
                    children: res.data.data,
                    title: '全部已开通城市',
                    value: '000000',
                    expand: true
                }]
            })
        },
        selectTree() {
            this.$refs.treeValidate.validate()
        },
        changeRadio() { // 改变radio
            this.announceForm.target = []
        },
        getPicUrl(res) {
            this.loading = false
            this.announceForm.noticeBanner = res.data.picUrl
        },
        submit() {
            this.$refs.treeValidate.validate().then(res1 => {
                this.$refs.formValidate.validate().then(res2 => {
                    if(res1 && res2){
                        this.announceForm.status = 1
                        this.announceForm.upTime = Date.parse(this.announceForm.time[0])
                        this.announceForm.downTime = Date.parse(this.announceForm.time[1])
                        addAnnounce(this.announceForm).then(res => {
                            if(res.data.success){
                                this.$Message.success('添加成功')
                                this.back()
                            } else {
                                this.$Message.error('添加失败')
                            }
                        })
                    }
                })
            }) 
        }
    }
}
</script>
