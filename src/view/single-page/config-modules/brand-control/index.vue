<!--品牌管理-->
<template>
    <div>
        <Row>   
           <searchList 
           :inputList="inputList"
           @on-search='handleSearch'
           @on-reset='handleReset'
           ></searchList>
        </Row>
        <Row>
            <Button type="primary" size='large' @click="addBrand" v-show="$utils.pkAccess('brand-control-add')">新建</Button>
        </Row>
        <Row :style="{marginTop:'20px'}">
            <VTable 
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :isLoading="isLoading"
            :parColumns="brandColumn"
            :parTableData="brandList"
            @changePage="changePage"
            @changePageSize="changePageSize"
            ></VTable>
        </Row>
        <Modal
            v-model="addModal"
            title="新建品牌"
        >
            <Form :model= 'addForm' :rules="ruleValidate1" ref="addForm">
                <FormItem label="品牌" prop='brandName' :label-width="120">
                    <Row>
                        <Col span="18">
                        <Input v-model="addForm.brandName" width="180" :maxlength= 20> </Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="品牌代码" prop='brandCode' :label-width="120">
                    <Row>
                        <Col span="18">
                        <Input width="180" v-model="addForm.brandCode" :maxlength= 20> </Input>
                        
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type='primary' @click="saveBrand('addForm')">保存</Button>
            </div>
        </Modal>
        <Modal
            v-model="editModal"
            title="编辑品牌"
        >
            <Form :model= 'editForm' :rules="ruleValidate2" ref="editForm"  >
                <FormItem label="品牌" prop='brandName' :label-width="120">
                    <Row>
                        <Col span="18">
                        <Input v-model="editForm.brandName" width="180" :maxlength= 20> </Input>
                        <input type="hidden" v-model="editForm.uuid" >
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="品牌代码" prop='brandCode' :label-width="120" >
                    <Row>
                        <Col span="18">
                        <Input width="180" v-model="editForm.brandCode" :maxlength= 20> </Input>
                        
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type='primary' @click="updateBrand('editForm')">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import searchList from '_a/search-list/search-list.vue'
import VTable from '_a/v-table/v-table.vue'
import {getBrandList, saveBrand,deleteBrand,ableControlBrand} from '@/api/configData.js'
export default {
    components:{searchList,VTable},
    data(){
        return {
            isLoading: '',
            addModal:false,
            editModal:false,
            addForm: {},
            editForm: {},
            inputList: [
                {
                    name: 'text-input',
                    bind_key: 'brandName',
                    placeholder: '请输入品牌',
                    value: '',
                    title: '品牌：',
                    titleWidth: 50,
                    unicode: '1',
                    isHide: false
                },
            ],
            brandColumn:[
                {
                    type:'index',
                    title:'序号'
                },
                {
                    key:'brandName',
                    title:'品牌'
                },
                {
                    key:'updateTime',
                    title:'更新时间',
                    render:(h,params) =>{
                        let x = params.row.updateTime
                        x = this.$moment(x).format('YYYY-MM-DD HH:mm:ss')
                        return h('div'),[
                            h('span',{

                            },x)
                        ]
                    }
                },
                {
                    key:'action',
                    title:'操作',
                    render:(h,params) => {
                        return h('div',[
                            h('Button',{
                                props: {
                                    type: 'warning',
                                    size: 'small',
                                    ghost: true
                                },
                                style: {
                                   display: this.$utils.pkAccess('brand-control-edit')? 'inline-block' : 'none'
                                },
                                on:{
                                    click :() =>{
                                        this.editForm.brandName = params.row.brandName
                                        this.editForm.brandCode = params.row.brandCode
                                        this.editForm.uuid = params.row.uuid
                                        this.editModal = true
                                    }
                                }
                            },'编辑'),
                            h('Button',{
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    ghost: true
                                },
                                style: {
                                     marginLeft : "15px",
                                     display: this.$utils.pkAccess('brand_handleAct')  && params.row.status == 1? 'inline-block' : 'none'
                                },
                                on:{
                                    click: ()=>{
                                        this.handleDisable(params.row.uuid)
                                    }
                                }
                            },'停用'),
                            h('Button',{
                                props: {
                                    type: 'success',
                                    size: 'small',
                                    ghost: true
                                },
                                style: {
                                     marginLeft : "15px",
                                     display: this.$utils.pkAccess('brand_handleAct') && params.row.status == -1? 'inline-block' : 'none'
                                },
                                on:{
                                    click: ()=>{
                                        this.handleAble(params.row.uuid)
                                    }
                                }
                            },'启用'),
                        ])
                    }
                },
            ],
            brandList: [
            ],
            ruleValidate1: {
                brandName: [
                        { required: true, message: '品牌名不可为空', trigger: 'blur' }
                ],
                brandCode:[
                        { required: true, message: '品牌代码不可为空', trigger: 'blur' }
                ],
            },
             ruleValidate2: {
                brandName: [
                        { required: true, message: '品牌名不可为空', trigger: 'blur' }
                ],
                brandCode:[
                        { required: true, message: '品牌代码不可为空', trigger: 'blur' }
                ],
            },
            totalCount: '',
            pageSize: 10,
            current: 1,
            isLoading: false,
            total:null
            
        }
        
    },
     created (){
        this.getList()
    },
    methods: {
        //获取分页List
        getList (query){
            let data = {currPage:this.current, pageSize:this.pageSize}
            data = Object.assign(data,query)
            getBrandList(data).then(res =>{
                this.brandList = res.data.data.list
                this.total = res.data.data.totalCount;
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        addBrand(){
            this.addModal = true
            this.addForm = {}
        },
        //保存品牌
        saveBrand(name){
            this.$refs[name].validate((valid) =>{
                if(valid) {
                    let data = this.addForm 
                    saveBrand(data).then(res =>{
                        if(res.data.success){
                             this.$Message.success('保存成功');
                             this.getList()
                        }else{
                             this.$Message.error(res.data.errorMsg);
                        }
                        this.addModal = false
                    })
                }
                else{
                    this.$Message.error('表单不合法');
                }
            })
        },
        //编辑品牌
        updateBrand(name){
            this.$refs[name].validate((valid) =>{
                if(valid) {
                    let data = this.editForm 
                    saveBrand(data).then(res =>{
                        if(res.data.success){
                             this.$Message.success('保存成功');
                             this.getList()
                        }else{
                             this.$Message.error(res.data.errorMsg);
                        }
                        this.editModal = false
                    })
                }
                else{
                    this.$Message.error('表单不合法');
                }
            })
        },
        //删除品牌
        handleDisable(id){
            let data ={uuid: id,status:-1}
            this.$Modal.confirm({
                title: '提示',
                content: '<p>请确认是否停用该品牌</p>',
                onOk: () => {
                        ableControlBrand(data).then(res =>{
                            if(res.data.success){
                                 this.$Message.success('停用成功');
                                 this.getList()
                            }else{
                                 this.$Message.error(res.data.errorMsg);
                            }
                        })
                       this.getList()
                },
                onCancel: () => {
                        this.$Message.error('已取消');
                }
            })
        },
        handleAble(id){
            let data ={uuid: id,status:1}
            this.$Modal.confirm({
                title: '提示',
                content: '<p>请确认是否启用该品牌</p>',
                onOk: () => {
                        ableControlBrand(data).then(res =>{
                            if(res.data.success){
                                 this.$Message.success('启用成功');
                                 this.getList()
                            }else{
                                 this.$Message.error(res.data.msg);
                            }
                        })
                       this.getList()
                },
                onCancel: () => {
                        this.$Message.error('已取消');
                }
            })
        },
        //搜索
        handleSearch(val){
            let qu = val;
            this.getList(qu)
        },
        handleReset(){
            this.getList()
        },
        changePageSize(val){
            this.pageSize = val;
            this.getList()
        },
        changePage(val){
            this.current = val
            this.getList()
        },
        
        
    }
    
}
</script>
