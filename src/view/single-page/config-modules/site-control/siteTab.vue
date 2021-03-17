<template>
    <div class="container_box">
        <searchList :inputList="inputList" @on-search='handleQuery' @on-reset="handleReset"></searchList>
        <div style="display: flex;justify-content: space-between;margin-bottom: 20px;">
            <Button type="primary" v-hasAuth="'site_control-add'" @click='addSite'>新建</Button>
            <ImportFile 
                btnText="导入" 
                on-success='uploadSuc' 
                v-hasAuth="'site_control-import'"
                :importFileUrl="importUrl" 
                :toDownTemplateUrl="downLoadUrl"
                @on-success="uploadSuccess">  
            </ImportFile>
        </div>
        <VTable
            :total="total" 
            :current="current" 
            :pageSize="pageSize" 
            :parColumns="siteColumns" 
            :parTableData="siteTableData" 
            @changePage="changePage" 
            @changePageSize="changePageSize">
        </VTable>
        <Modal v-model="addModal" title="新建场地" @on-ok="handleAdd('siteForm')" @on-cancel="cancel" :mask-closable= false>
            <Form :model="siteForm" :label-width="100" :rules="ruleValidate" ref="siteForm">
                <FormItem label="场地类型：" prop="type">
                    <!-- <Select v-model="siteForm.type" style="width: 200px"  >
                        <Option value="0">加油站</Option>
                        <Option value="1">充电站</Option>
                        <Option value="2">加气站</Option>
                        <Option value="3">维修站</Option>
                        <Option value="4">司机之家</Option>
                    </Select> -->
                    <span v-if="tabName =='0'">加油站</span>
                    <span v-if="tabName =='1'">充电站</span>
                    <span v-if="tabName =='2'">加气站</span>
                    <span v-if="tabName =='3'">维修站</span>
                    <span v-if="tabName =='4'">司机之家</span>
                </FormItem>
                <FormItem label="名称：" prop="name">
                    <Input v-model="siteForm.name" placeholder="请输入名称"  style="width: 200px"></Input>
                </FormItem>
                <FormItem label="地址：" prop="address">
                    <span @click="popMap" style="color:#1890FF;cursor:pointer;margin-right:20px"  > 地图选址</span>
                    <span>{{siteForm.address}}</span>
                    <!-- <Input v-model="siteForm.address" placeholder="请输入名称" :type="hidden" style="width: 200px"></Input> -->
                </FormItem>
            </Form>
            <div slot="footer">
                <Button size="large" type="text" @click="cancel" style="margin-right: 8px;">取消</Button>
                <Button size="large" type="primary" @click="handleAdd('siteForm')">确定</Button>
            </div>
        </Modal>

        <Modal v-model="editModal" title="编辑场地" :mask-closable= false>
            <Form :model="siteEditForm" :label-width="100" :rules="ruleValidate2" ref="siteEditForm">
                <FormItem label="场地类型：" prop="type">
                    <!-- <Select v-model="siteEditForm.type" style="width: 200px" disabled >
                        <Option value= 0>加油站</Option>
                        <Option value= 1>充电站</Option>
                        <Option value= 2>加气站</Option>
                        <Option value= 3>维修站</Option>
                        <Option value= 4>司机之家</Option>
                    </Select> -->
                    <span v-if="siteEditForm.type =='0'">加油站</span>
                    <span v-if="siteEditForm.type =='1'">充电站</span>
                    <span v-if="siteEditForm.type =='2'">加气站</span>
                    <span v-if="siteEditForm.type =='3'">维修站</span>
                    <span v-if="siteEditForm.type =='4'">司机之家</span>
                </FormItem>
                <FormItem label="名称：" prop="name">
                    <Input v-model="siteEditForm.name" placeholder="请输入名称"  style="width: 200px"></Input>
                </FormItem>
                <FormItem label="地址：" prop="address">
                    <span @click="popMap2" style="color:#1890FF;cursor:pointer;margin-right:20px"  > 地图选址</span>
                    <span>{{siteEditForm.address}}</span>
                    <!-- <Input v-model="siteForm.address" placeholder="请输入名称" :type="hidden" style="width: 200px"></Input> -->
                </FormItem>
            </Form>
            <div slot="footer">
                <Button size="large" type="text" @click="cancel" style="margin-right: 8px;">取消</Button>
                <Button size="large" type="primary" @click="editOk('siteEditForm')">确定</Button>
            </div>
        </Modal>
        <Modal v-model="mapModal" @on-ok="closeView" @on-cancel="closeView"  width="830" :mask-closable= false>
            <div>地图 </div>
            <div class="" v-if="mapModal">
                <MapPicker v-on:isShow='receV' v-on:listenMap='receV2' ></MapPicker>
            </div>
        </Modal>
        <Modal v-model="editMapModal" @on-ok="closeView" @on-cancel="closeView"  width="830" :mask-closable= false>
              <div>地图</div>
              <div class="" >
                <MapPicker v-on:isShow='receV' v-on:listenMap='receV2' :originLocation = 'orginPosition'></MapPicker>
            </div>
        </Modal>
    </div>
</template>

<script>
import ImportFile from '_a/import-file/index.vue'
import MapPicker from '_a/VmapPicker/v-mapPicker.vue'
import { serviceSitePageList, saveServiceSite, deleteServiceSite } from '@/api/configData.js'
import { getWholeRegion } from '@/api/common.js'

export default {
    name: "site-tab",
    components: {
        MapPicker,
        ImportFile
    },
    props: {
        tabName: {
            type: String,
            default: '0'
        },
        lData: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            searchParams: {},
            inputList: [
                {
                    name: 'cascader-input', // 文本输入框名
                    bind_key: ['province', 'city'], // 返回数据的key名
                    placeholder: '请选择省/市',
                    value: [], // 绑定返回数据
                    cascaderList: [], // 级联列表
                    title: '省 / 市：', // 展示的字段名
                    titleWidth: 60, // 展示的字段名的宽度
                    inputWidth: 200, // input框的宽度
                    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
                    isHide: false, // false: 不隐藏 / true: 隐藏
                    changeOnSelect: true
                },
                {
                    name: 'text-input', // 文本输入框名
                    bind_key: 'name', // 返回数据的key名
                    placeholder: '请输入名称',
                    value: '', // 绑定返回数据
                    title: '名称：', // 展示的字段名
                    titleWidth: 60, // 展示的字段名的宽度
                    inputWidth: 200, // input框的宽度
                    key: '2', // 该文本框的唯一标识，用于匹配该文本框是否展示
                    isHide: false, // false: 不隐藏 / true: 隐藏
                    changeOnSelect: true 
                }
            ],
            five: "5px",
            addModal: false,
            editModal: false,
            editflag: false,
            showMap: false,
            mapModal: false,
            editMapModal:false,
            siteForm: {
                name: '',
                address: ''
            },
            orginPosition:[],
            importUrl: '/system/importServiceSite',
            downLoadUrl: '/download/siteImportTemplate.xlsx',
            siteEditForm: {},
            ruleValidate: {
                // type: [{
                //     required: true,
                //     message: '请选择类型',
                //     trigger: 'blur'
                // }],
                name: [{
                    required: true,
                    message: '请填写名称',
                    trigger: 'blur'
                }],
                address: [{
                    required: true,
                    message: '请选择地址',
                    trigger: 'blur'
                }],
            },
            ruleValidate2: {
                name: [{
                    required: true,
                    message: '请填写名称',
                    trigger: 'blur'
                }],
                address: [{
                    required: true,
                    message: '请选择地址',
                    trigger: 'blur'
                }],
            },
            siteColumns: [
                {
                    title: '序号',
                    type: 'index',
                    width:'80',
                    ellipsis:true
                },
                {
                    title: '省',
                    key: 'province',
                    minWidth: 100
                },
                {
                    title: '市',
                    key: 'city',
                    minWidth: 100
                },
                {
                    title: '名称',
                    key: 'name',
                    tooltip:true,
                    minWidth: 100
                },
                {
                    title: '地址',
                    key: 'address',
                    tooltip:true,
                    minWidth: 100
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 140,
                    render: (h, params) => {
                        return h('div'), [
                            h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small',
                                    ghost: true
                                },
                                directives: [{
                                    name: 'hasAuth',
                                    value: 'site_control-edit'
                                }],
                                on: {
                                    click: () => {
                                        this.Edit(params.row)
                                    }
                                }

                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    ghost: true
                                },
                                directives: [{
                                    name: 'hasAuth',
                                    value: 'site_control-delete'
                                }],
                                style: {
                                    marginLeft: '15px',
                                },
                                on: {
                                    click: () => {
                                        this.Del(params.row.uuid)
                                    }
                                }
                            }, '删除'),
                        ]
                    }
                }
            ],
            siteTableData: [],
            pageSize: 10,
            current: 1,
            total: 0
        };
    },
    created() {
        this.inputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
        this.getList()
    },
    methods: {
        getList() { // 获取分页List
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.pageSize = this.pageSize
            params.currPage = this.current
            params.type = this.tabName
            this.$store.commit('changeLoadingFlag', true)
            serviceSitePageList(params).then(res => {
                this.siteTableData = res.data.data.list
                this.total = res.data.data.totalCount
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        changePageSize(val) {
            this.pageSize = val
            this.getList()
        },
        changePage(val) {
            this.current = val
            this.getList()
        },
        addSite() {
            this.$refs.siteForm.resetFields()
            this.addModal = true;
            this.siteForm = {
                name: '',
                address: ''
            }
        },
        handleQuery(val) {
            this.current = 1
            this.searchParams = val
            this.getList()
        },
        //上传成功文件回调
        uploadSuc(){
            this.getList()
        },
        //重置
        handleReset(val){
            this.searchParams = val
            this.getList()
        },
        //添加
        handleAdd(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.siteForm.type = this.tabName
                    let data = this.siteForm
                    saveServiceSite(data).then(res => {
                        this.addModal = false
                        this.$Message.success('添加成功!');
                        this.getList()
                    })
                } else {
                    this.$Message.error('请填写所有所需数据!');
                }
            })
        },
        //编辑
        editOk(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let data = this.siteEditForm
                    saveServiceSite(data).then(res => {
                        this.editModal = false
                        this.$Message.success('修改成功!');
                        this.getList()
                    })
                } else {
                    this.$Message.error('请填写所有所需数据!');
                }
            })
        },
        uploadSuccess() {
            this.getList()
        },
        cancel() {
            this.addModal = false
            this.editModal = false
        },
        popMap() {
            this.mapModal = true
            this.orginPosition = []
        },
        popMap2(){
            this.editMapModal = true
        },
        receV: function (val) {
            this.showMap = val
        },
        //地图赋值
        receV2: function (val) {
            if (this.editModal) {
                this.siteEditForm = Object.assign(this.siteEditForm, val)
                this.editMapModal = false
            } else {
                this.siteForm = Object.assign(this.siteForm, val)
                this.mapModal = false
            }
        },
        closeView: function(){
            this.editMapModal = false
            this.mapModal = false
        },
        //删除场地
        Del(val) {
            let uuid = val
            this.$Modal.confirm({
                title: '删除场地',
                content: '<p>确认删除该场地？</p>',
                onOk: () => {
                    let data = {
                        uuid: uuid
                    }
                    deleteServiceSite(data).then(res => {
                        this.$Message.success('删除成功')
                        this.getList()
                    })
                },
                onCancel: () => {
                    this.$Message.info('已取消');
                }
            })
        },
        Edit(data) {
            this.$refs.siteEditForm.resetFields()
            this.editModal = true
            this.siteEditForm = JSON.parse(JSON.stringify(data))
            /*this.siteEditForm.type = olderObj.type
            this.siteEditForm.uuid = olderObj.uuid
            this.siteEditForm.name = olderObj.name
            this.siteEditForm.province = olderObj.province
            this.siteEditForm.country = olderObj.country
            this.siteEditForm.address = olderObj.address
            this.siteEditForm.areaCode = olderObj.areaCode
            this.siteEditForm.longitude = olderObj.longitude
            this.siteEditForm.latitude = olderObj.latitude*/
            this.orginPosition = [this.siteEditForm.longitude ,this.siteEditForm.latitude]
            this.editflag = true
        }
    }
}
</script>

<style lang="less" scoped>
.container_box {
    .mid {
        vertical-align: middle;
    }
    .fl-lt {
        float: left;
    }
}
.fakePointer {
    color: '#1890FF';
    margin-left: '10px'
}
.mapbox {
    width: 820px;
    height: 430px;
}
</style>
