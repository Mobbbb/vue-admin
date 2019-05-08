<template>
<div class="container1">
    <searchList :inputList="inputList" @on-search='handleSearch' @on-reset="reset"></searchList>
       <Row>
            <Col span="8">
                <Button type="primary" @click="goToAddPush" v-hasAuth="'push-center-add'">新增</Button>
            </Col>
        </Row>
    <Row :style="{marginTop:'20px'}">
        <VTable 
            :total="total" 
            :current="current" 
            :pageSize="pageSize" 
            :parColumns="pushColumn" 
            :parTableData="pushList" 
            @changePage="changePage" 
            @changePageSize="changePageSize">
        </VTable>
    </Row>
    <Modal v-model="detailModal" title="Push消息详情">
        <DetailTag :theInfo='detailInfo'></DetailTag>
    </Modal>
</div>
</template>

<script>
import {getPushlist,cancelPush ,remoteSearch,getPushDetail} from '@/api/announcement.js'
import { fields, page } from './fields.js'
import  DetailTag from './components/detail.vue'

export default {
    components: {
        DetailTag
    },
    data() {
        return {
            ...fields,
            queryForm: {},
            inputLoading: false,
            options1: [],
            detailModal:false,
            detailInfo:{},
            roleList: [{
                    value: '1',
                    label: '司机'
                },
                {
                    value: '2',
                    label: '乘客'
                }
            ],
            pushList: [],
            pushColumn: [{
                    key: 'title',
                    title: 'push标题',
                    minWidth: 160,
                    tooltip: true,
                    fixed: 'left'
                },
                {
                    key: 'subTitle',
                    title: 'push副标题',
                    minWidth: 160,
                    tooltip: true
                },
                {
                    key: 'pushRole',
                    title: 'push角色',
                    minWidth: 160,
                    tooltip: true,
                    render:(j,params)=>{
                        return j('div',[
                            j('span',{
                                style:{
                                    display: (params.row.pushRole == 1) ? 'inline-block' : 'none'
                                }
                            },'司机'),
                            j('span',{
                                style:{
                                    display: (params.row.pushRole == 2) ? 'inline-block' : 'none'
                                }
                            },'乘客'),
                        ])
                    }
                },
                {
                    key: 'target',
                    title: '发送范围',
                    minWidth: 160,
                    tooltip: true,
                    render:(j,params)=>{
                        return j('div',[
                            j('span',{
                                style:{
                                    display: (params.row.target == 1) ? 'inline-block' : 'none'
                                }
                            },'指定用户或者司机'),
                            j('span',{
                                style:{
                                    display: (params.row.target == 2) ? 'inline-block' : 'none'
                                }
                            },'指定条件 '),
                            j('span',{
                                style:{
                                    display: (params.row.target == 3) ? 'inline-block' : 'none'
                                }
                            },'批量'),
                        ])
                    }
                },
                {
                    key: 'sex',
                    title: '性别',
                    minWidth: 100,
                    tooltip: true,
                    render:(j,params)=>{
                        return j('div',[
                            j('span',{
                                style:{
                                    display: (params.row.sex == 1) ? 'inline-block' : 'none'
                                }
                            },'全部'),
                            j('span',{
                                style:{
                                    display: (params.row.sex == 2) ? 'inline-block' : 'none'
                                }
                            },'男'),
                            j('span',{
                                style:{
                                    display: (params.row.sex == 3) ? 'inline-block' : 'none'
                                }
                            },'女'),
                        ])
                    }
                },
                {
                    key: 'pushLink',
                    title: '跳转链接',
                    minWidth: 160,
                    tooltip: true
                },
                {
                    key: 'pushTime',
                    title: '推送时间',
                    minWidth: 160,
                    tooltip: true
                },
                {
                    key: 'createTime',
                    title: '添加时间',
                    minWidth: 160,
                    tooltip: true
                },
                {
                    key: 'pushStatus',
                    title: '状态',
                    tooltip: true,
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                style: {
                                    marginRight: '5px',
                                    display: (params.row.pushStatus == 1) ? 'inline-block' : 'none'
                                }
                            }, '已推送'),
                            h('span', {
                                style: {
                                    marginRight: '5px',
                                    display: (params.row.pushStatus == 2) ? 'inline-block' : 'none'
                                }
                            }, '待推送'),
                            h('span', {
                                style: {
                                    marginRight: '5px',
                                    display: (params.row.pushStatus == 3) ? 'inline-block' : 'none'
                                }
                            }, '放弃推送')
                        ])
                    }
                },
                {
                    key: 'actions',
                    title: '操作',
                    width: 160,
                    fixed: 'right',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'info',
                                    ghost: true,
                                    size:'small'
                                },
                                directives: [{
                                    name: 'hasAuth',
                                    value: 'push-center-detail'
                                }],
                                on: {
                                    click: () => {
                                        let id = params.row.uuid
                                        // this.goToDetail(id)
                                        this.getDetail(id)
                                        this.detailModal = true
                                    }
                                }
                            }, '详情'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    ghost: true,
                                    size:'small'
                                },
                                directives: [{
                                    name: 'hasAuth',
                                    value: 'push-center-giveUp'
                                }],
                                style: {
                                    marginLeft: '15px',
                                    display: params.row.pushStatus == 2 ? 'inline-block' : 'none',
                                },
                                on: {
                                    click: () => {
                                        this.handleAbord(params.row)
                                    }
                                }
                            }, '放弃推送'),
                        ])
                    }
                },
            ],
            total: null,
            current: 1,
            isLoading: false,
            pageSize: 10,
            queryParams:{}

        };
    },
    mounted() {
        this.getList()
    },
    methods: {
        //获取分页pushList
        getList() {
            this.isLoading = true
            let data = {pageSize: Number(this.pageSize),page: Number(this.current)}
            if(this.queryParams){
                data = Object.assign(this.queryParams,data)
            }
            getPushlist(data).then(res=>{
                if(res.data.success){
                    this.total = res.data.data.totalCount
                    this.pushList = res.data.data.list
                    this.$store.commit('changeLoadingFlag', false)
                }
            })
        },
        reset(){
            this.queryParams = {}
            this.getList()
        },
        // 搜索
        handleSearch(val) { 
            this.queryParams = val
            this.getList()
        },
        //远程模糊搜索
        /*remoteMethod(query) {
             remoteSearch({ title: query }).then(res => {
                this.inputList[0].remoteList = []
                for(let i = 0; i < res.data.data.length; i++){
                    this.inputList[0].remoteList.push({
                        label: res.data.data[i],
                        value: res.data.data[i]
                    })
                }
            })
        },*/
        changePageSize(val) {
            this.pageSize = val;
            this.getList()
        },
        changePage(val) {
            this.current = val
            this.getList()
        },
        handleSelectRole(item) {
            
        },
        //获取详情
        getDetail(id){
            let data = { uuid : id}
            getPushDetail(data).then(res =>{
                if(res.data.success){
                  this.detailInfo = res.data.data
                }
            })
        },
        //放弃推送
        handleAbord(item) {
            let data = {uuid : item.uuid}
            this.$Modal.confirm({
                title: '操作',
                content: '<p>确认要放弃此条推送？</p>',
                onOk: () => {
                    cancelPush(data).then(res=>{
                        this.$Message.success('操作成功！');
                        this.getList()
                    })
                },
                onCancel: () => {
                    this.$Message.info('已经取消');
                }
            });
        },
        goToAddPush(){
            this.$router.push({name: 'add-push'})
        },
        goToDetail(id){
            this.$router.push({name: 'push-detail',params:{id: id}})
        }
    }
}
</script>
