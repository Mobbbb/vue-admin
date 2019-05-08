<!--车型管理-->
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
            <Button type="primary" size='large' @click="handleAdd" v-show="$utils.pkAccess('model-control-add')">新建</Button>
        </Row>
        <Row :style="{marginTop:'20px'}">
            <VTable 
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :isLoading="isLoading"
            :parColumns="modelColumn"
            :parTableData="modelList"
            ></VTable>
        </Row>
        <Modal
            v-model="addModal"
            title="新建车型"
            :mask-closable= false
        >
         <Form :model= 'addForm' :rules="ruleValidate1" ref="addForm" >
              <FormItem label="品牌" prop='brandId' :label-width="100"  >
                  <!-- <input type="hidden" v-model="addForm.brandId"> -->
                  <Select v-model="addForm.brandId">
                      <Option v-for="item in ProvinceList" :key="item.index" :value="item.uuid" @click.native="handleBrand(item)">{{item.brandName}} </Option>
                  </Select>
              </FormItem>
               <FormItem label="车型" prop='modelName' :label-width="100" >
                   <Input v-model="addForm.modelName"  @change.native="uptoCase"></Input>
               </FormItem>
                <FormItem label="车型图片"  :label-width="100" prop='modelImg'  >
                    <Upload 
                    :action="upBaseUrl"
                    :format="['jpg','jpeg','png']"
                    :headers='headerSet'
                    :on-success="handleSuccess"
                    :default-file-list=[]
                    >
                        <Button icon="ios-cloud-upload-outline" >上传图片</Button>
                        
                        <!-- <span>已上传</span> -->
                    </Upload>
                     <a  v-if="addForm.modelImg" @click="viewImg(addForm.modelImg)">预览</a>
                    <input type="hidden" v-model="addForm.modelImg">
                </FormItem>
                <FormItem label="车辆动力类型"  :label-width="100" prop='fuelType' >
                   <Select style="width:200px" v-model="addForm.fuelType" >
                        <Option v-for="item in fuelType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
               </FormItem>
               <FormItem label="油箱容量"  :label-width="100"  v-if="addForm.fuelType ==0 ||addForm.fuelType ==2" prop='tankCapacity'> 
                   <Input  v-model="addForm.tankCapacity">  <span slot="append"> L </span></Input>
               </FormItem>
               <FormItem label="电池容量"  :label-width="100" v-if="addForm.fuelType ==1 ||addForm.fuelType ==2 ||addForm.fuelType ==3" prop='batteryCapacity' >
                   <Input  v-model="addForm.batteryCapacity">  <span slot="append">  KW.H </span></Input>
               </FormItem>
               <FormItem label="核定载客数"  :label-width="100" prop="seats">
                   <Input  v-model="addForm.seats"  number>  <span slot="append">  人 </span></Input>
               </FormItem>
               <FormItem label="车辆类型"  :label-width="100" prop="vehicleType">
                   <Input  v-model="addForm.vehicleType">  </Input>
               </FormItem>
               <FormItem label="发动机排量"  :label-width="100"  prop="engineDisplace" v-if="addForm.fuelType ==0 ||addForm.fuelType ==2">
                   <Input  v-model="addForm.engineDisplace">  <span slot="append">  ML </span></Input>
               </FormItem>
               <FormItem label="发动机功率"  :label-width="100"  v-if="addForm.fuelType ==0 ||addForm.fuelType ==2">
                   <Input  v-model="addForm.enginePower" > </Input>
               </FormItem>
               <FormItem label="轴距"  :label-width="100"  >
                   <Input  v-model="addForm.wheelbase"  number> </Input>
               </FormItem>
               <FormItem label="状态"  :label-width="100" prop='status'>
                   <Select v-model="addForm.status" style="width:200px">
                        <Option :value= 0 >无效</Option>
                        <Option :value= 1 >有效</Option>
                    </Select>
               </FormItem>
         </Form>
         <div slot="footer">
             <Button type="primary" @click="handleSave('addForm')">保存</Button>
         </div>
        </Modal>
        <Modal
            v-model="editModal"
            title="编辑车型"
             :mask-closable= false
        >
         <Form :model= 'editForm'  ref="editForm"  :rules="ruleValidate1" >
              <FormItem label="品牌" prop='brandId' :label-width="100"  >
                  <input type="hidden" v-model="editForm.brandId">
                  <Select v-model="editForm.brandName">
                      <Option v-for="item in ProvinceList" :key="item.index" :value="item.brandName" @click.native="handleEditBrand(item)">{{item.brandName}} </Option>
                  </Select>
              </FormItem>
               <FormItem label="车型" prop='modelName' :label-width="100" >
                   <Input v-model="editForm.modelName" ></Input>
               </FormItem>
                 <FormItem label="车型图片"  :label-width="100" prop='modelImg' >
                 <Upload 
                    :action="upBaseUrl"
                    :format="['jpg','jpeg','png']"
                    :on-success="handleSuccess2"
                    :headers='headerSet'
                    >
                        <Button icon="ios-cloud-upload-outline" >上传图片</Button>
                    </Upload>
                    <a @click="viewImg(editForm.modelImg)">预览</a>
                    <input type="hidden" v-model="editForm.modelImg">
                    </FormItem>
                <FormItem label="车辆动力类型"  :label-width="100" prop='fuelType' >
                   <Select style="width:200px" v-model="editForm.fuelType" >
                        <Option v-for="item in fuelType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
               </FormItem>
               <FormItem label="油箱容量"  :label-width="100"  v-if="editForm.fuelType ==0 ||editForm.fuelType ==2" prop='tankCapacity'> 
                   <Input  v-model="editForm.tankCapacity">  <span slot="append"> L </span></Input>
               </FormItem>
               <FormItem label="电池容量"  :label-width="100" v-if="editForm.fuelType ==1 ||editForm.fuelType === 2 ||editForm.fuelType ===3 " prop='batteryCapacity' >
                   <Input  v-model="editForm.batteryCapacity">  <span slot="append">  KW.H </span></Input>
               </FormItem>
               <FormItem label="核定载客数"  :label-width="100" prop="seats">
                   <Input  v-model="editForm.seats">  <span slot="append">  人 </span></Input>
               </FormItem>
               <FormItem label="车辆类型"  :label-width="100" prop="vehicleType" >
                   <Input  v-model="editForm.vehicleType">  </Input>
               </FormItem>
               <FormItem label="发动机排量"  :label-width="100"  prop="engineDisplace" v-if="detailForm.fuelType ==0 ||detailForm.fuelType ==2">
                   <Input  v-model="editForm.engineDisplace">  <span slot="append">  ML </span></Input>
               </FormItem>
               <FormItem label="发动机功率"  :label-width="100" >
                   <Input  v-model="editForm.enginePower" > </Input>
               </FormItem>
               <FormItem label="轴距"  :label-width="100" >
                   <Input  v-model="editForm.wheelbase" > </Input>
               </FormItem>
               <FormItem label="状态"  :label-width="100" prop='status'>
                   <Select v-model="editForm.status" style="width:200px">
                        <Option :value="0" >无效</Option>
                        <Option :value="1" >有效</Option>
                    </Select>
               </FormItem>
         </Form>
         <div slot="footer">
             <Button type="primary" @click="handleEditSave('editForm')">保存</Button>
         </div>
        </Modal>
        <Modal title="查看图片" v-model="imgVisible "  :mask-closable= false>
            <img :src="imgUrl" v-if="imgVisible" style="width: 100%">
         </Modal>
         <Modal title="详情" v-model="detailVisible"  :mask-closable= false>
             <Form :model= 'detailForm'  ref="detailForm" >
                <FormItem label="品牌" prop='brandId' :label-width="100"  >
                    <span>{{detailForm.brandName}}</span>
                </FormItem>
                <FormItem label="车型名称" prop='modelName' :label-width="100" >
                    <span>{{detailForm.modelName}}</span>
                </FormItem>
                <FormItem label="车型图片"  :label-width="100" prop='modelImg' >
                    <a @click="viewImg(detailForm.modelImg)">预览</a>
                </FormItem>
                <FormItem label="车辆动力类型"  :label-width="100" >
                    <span v-if="detailForm.fuelType=='0'">汽油车</span>
                    <span v-if="detailForm.fuelType=='1'">纯电动汽车</span>
                    <span v-if="detailForm.fuelType=='2'">插电式混合动力汽车</span>
                    <span v-if="detailForm.fuelType=='3'">燃料电池汽车</span>
                </FormItem>
                <FormItem label="油箱容量"  :label-width="100"  v-if="detailForm.fuelType ==0 ||detailForm.fuelType ==2" prop='tankCapacity'> 
                   <span>{{detailForm.tankCapacity}}</span>
                </FormItem>
                <FormItem label="电池容量"  :label-width="100" v-if="detailForm.fuelType ==1 ||detailForm.fuelType === 2 ||detailForm.fuelType ===3 "   >
                   <span>{{detailForm.batteryCapacity}}</span>
                </FormItem>
                <FormItem label="核定载客数"  :label-width="100"  >
                     <span>{{detailForm.seats}}</span>
                </FormItem>
                <FormItem label="车辆类型"  :label-width="100" >
                    <span>{{detailForm.vehicleType}}</span>
                </FormItem>
                <FormItem label="发动机排量"  :label-width="100" v-if="detailForm.fuelType ==0 ||detailForm.fuelType ==2">
                     <span>{{detailForm.engineDisplace}}</span>             
                </FormItem>
                <FormItem label="发动机功率"  :label-width="100" >
                    <span>{{detailForm.enginePower}}</span>
                </FormItem>
                <FormItem label="轴距"  :label-width="100" >
                     <span>{{detailForm.wheelbase}}</span>
                </FormItem>
                <FormItem label="状态"  :label-width="100" prop='status'>
                    <span v-if="detailForm.status == 0">无效</span>
                     <span v-if="detailForm.status == 1">有效</span>
        
                </FormItem>
            </Form>
         </Modal>
    </div>
</template>
<script>
import searchList from '_a/search-list/search-list.vue'
import VTable from '_a/v-table/v-table.vue'
import {getModelList, getOwnedBrand,saveCarModel,deleteCarModel} from '@/api/configData.js'
import {getToken } from '@/libs/util'
import moment from 'moment'
const validateNumCheck = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'));
    } 
    else if (value == undefined) {
        callback(new Error('请填写正确的值'));
    }
    else if ( !/^[0-9]+$/.test(value)) {
        callback(new Error('请填写正确的值1'));
    }  
    else {
        callback();
    }
};
const validateExsit = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'));
    } 
    
    else {
        callback();
    }
};
export default {
    components: {searchList, VTable},
    data (){
        return {
             headerSet:{
                 Authorization: getToken()
             },
             isLoading: false,
             addModal: false,
             editModal:false,
             imgVisible: false,
             detailVisible: false,
             imgUrl:'',
             addForm:{
                 modelImg: ''
             },
             upBaseUrl:this._baseUrl + '/common/uploadPics',
             detailForm: {},
             editForm:{
                 fuelType: null
             },
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
                {
                    name: 'text-input',
                    bind_key: 'modelName',
                    placeholder: '请输入车型',
                    value: '',
                    title: '车型：',
                    titleWidth: 50,
                    unicode: '1',
                    isHide: false
                },
            ],
            fuelType:[
                {label:'汽油车' ,value: 0},
                {label:'纯电动汽车' ,value: 1},
                {label:'插电式混合动力汽车' ,value: 2},
                {label:'燃料电池汽车' ,value: 3},
                ],
            modelColumn:[
                {
                    type:'index',
                    title:'序号',
                    width:'80'
                },
                {
                    key:'brandName',
                    title:'品牌',
                    minWidth: 150
                },
                {
                    key:'modelName',
                    title:'车型名称',
                    minWidth: 150
                },
                {
                    key:'modelPic',
                    title:'车型图片',
                    minWidth: 150,
                    render: (h,params) => {
                        return h('span',{
                            style:{
                                color: '#1890FF',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            },
                            on:{
                                click:()=>{
                                    this.viewImg(params.row.modelImg)
                                }
                            }
                        },'查看图片')
                    }
                },
                {
                    key:'updateTime',
                    title:'更新时间',
                    minWidth: 160,
                    render:(h,params) =>{
                        let x = params.row.updateTime
                        x = moment(x).format('YYYY-MM-DD HH:mm:ss')
                        return h('div'),[
                            h('span',{

                            },x)
                        ]
                    }
                },
                {
                    key:'action',
                    title:'操作',
                    fixed: 'right',
                    width: 200,
                    render:(h,params) => {
                        return h('div',[
                            h('Button',{
                                props:{
                                    type: 'warning',
                                    size: 'small',
                                    ghost: true
                                },
                                style:{
                                    display: this.$utils.pkAccess('model-control-edit')? 'inline-block': 'none'
                                },
                                on:{
                                    click :() =>{
                                        this.editForm.brandName = params.row.brandName
                                        this.editForm.brandId = params.row.brandId
                                        this.editForm.modelName =  params.row.modelName
                                        this.editForm.modelImg = params.row.modelImg
                                        this.editForm.fuelType = params.row.fuelType
                                        this.editForm.vehicleType = params.row.vehicleType
                                        this.editForm.tankCapacity =  params.row.tankCapacity
                                        this.editForm.batteryCapacity = params.row.batteryCapacity
                                        this.editForm.seats = params.row.seats
                                        this.editForm.engineDisplace =  params.row.engineDisplace
                                        this.editForm.enginePower = params.row.enginePower
                                        this.editForm.status = params.row.status 
                                        this.editForm.uuid = params.row.uuid
                                        this.editForm.wheelbase = params.row.wheelbase                     
                                        this.editModal = true
                                        // console.log(params)
                                        let data = {}
                                        getOwnedBrand(data).then(res =>{
                                            if (res.data.success) {
                                                this.ProvinceList = res.data.data
                                            }
                                            else{
                                                this.$Message.error(res.data.errorMsg)
                                            }
                                        })
                                    }
                                }
                            },'编辑'),
                            h('Button',{
                                props:{
                                    type: 'info',
                                    size: 'small',
                                    ghost: true
                                },
                                style:{
                                    display: this.$utils.pkAccess('model-control-search')? 'inline-block': 'none',
                                    marginLeft:'15px'
                                },
                                on: {
                                    click :() =>{
                                        this.detailForm = params.row
                                        this.detailVisible = true
                                    }
                                }
                            },'查看'),

                            h('Button',{
                                props:{
                                    type: 'error',
                                    size: 'small',
                                    ghost: true
                                },
                                style:{
                                    display: this.$utils.pkAccess('model-control-delete')? 'inline-block': 'none',
                                    marginLeft:'15px'
                                },
                                on: {
                                    click :() =>{
                                        this.handelDelete(params.row.uuid)
                                    }
                                }
                            },'删除')
                        ])
                    }
                },
            ],
            modelList: [
        
            ],
            ProvinceList:'',
            totalCount: '',
            pageSize: 10,
            current: 1,
            isLoading: false,
            total:null,
            ruleValidate1:{
                modelName: [
                        {required: true, message: '请填写内容', trigger: 'blur' },
                        {  validator:validateExsit, trigger: 'change' }
                    ],
                brandId: [
                    {required: true, message: '请填写内容', trigger: 'blur' },
                        { validator:validateExsit, trigger: 'change'  }
                    ],
                modelImg: [
                        {required: true, validator:validateExsit, trigger: 'change' }
                    ],
                fuelType: [
                        {validator: validateNumCheck, trigger: 'change'}
                    ],
                tankCapacity:[
                     {validator: validateNumCheck, trigger: 'change'}
                ],
                batteryCapacity:[
                     {validator: validateNumCheck, trigger: 'change'}
                ],
                seats: [
                        {validator: validateNumCheck, trigger: 'change'}
                ],
                status: [
                       {validator: validateNumCheck, trigger: 'change'}
                ],    
                vehicleType: [
                       {required: true, message: '请填写内容', trigger: 'blur' }
                    ],
                engineDisplace: [
                       {validator: validateNumCheck, trigger: 'change'}
                ],   
            }
        }
    },
    created(){
        this.getList()
    },
    methods:{
        // 获取车型list
        getList (query){
            let data = {currPage:this.current, pageSize:this.pageSize}
            data = Object.assign(data,query)
            getModelList(data).then(res => {
                if(res.data.success){
                    this.modelList = res.data.data.list
                    this.total = res.data.data.totalCount;
                    this.$store.commit('changeLoadingFlag', false)
                }
            })
        },
        handleSearch(val){
            let qu = val;
            this.getList(qu)
        },
        //转成大写
        uptoCase(){
            // console.log(this.addForm.modelName)
            this.addForm.modelName = this.addForm.modelName.toUpperCase()
        },
        addBrand(){
            this.addModal = true
        },
        handleBrand(obj){
            if(obj){
                this.addForm.brandId = obj.uuid
            }
        },
        handleEditBrand(obj){
            if(obj){
                this.editForm.brandId = obj.uuid
                this.editForm.brandName = obj.brandName

            }
        },
        handleAdd(){
            this.addForm = {}
            this.$refs['addForm'].resetFields();
            this.addModal = true
            let data = {}
            getOwnedBrand(data).then(res =>{
                if (res.data.success) {
                    this.ProvinceList = res.data.data
                }
                else{
                    this.$Message.error(res.data.errorMsg)
                }
            })
        },
        handleSuccess(res, file){
            if(res.success){
                this.$Message.success('上传成功！')
                this.addForm.modelImg = res.data.picUrl
            }else{
                this.$Message.error(res.msg)
            }
        },
        handleSuccess2(res, file){
            if(res.success){
                this.$Message.success('上传成功！')
                this.editForm.modelImg = res.data.picUrl
            }else{
                this.$Message.error(res.msg)
            }
        },
        viewImg(url){
            this.imgUrl = url
            this.imgVisible = true
        },
// 保存新增车型
        handleSave(name){
            this.$refs[name].validate((valid) => {
                if(valid){
                    let data = this.addForm
                    saveCarModel (data).then(res =>{
                        if(res.data.success){
                            this.$Message.success('添加成功')
                            this.addForm ={}
                            this.getList()
                        }else{
                             this.$Message.error(res.data.errorMsg)
                        }
                        this.addModal = false
                    })
                }else{
                     this.$Message.error("请完成表单后添加")
                }
            })
            
        },
// 编辑车型
        handleEditSave(name){
            this.$refs[name].validate((valid) => {
                if(valid){
                    let data = {
                    modelName: this.editForm.modelName ,
                    brandId: this.editForm.brandId,
                     modelImg: this.editForm.modelImg,
                     uuid: this.editForm.uuid,
                     fuelType: Number(this.editForm.fuelType),
                     vehicleType: this.editForm.vehicleType,
                     tankCapacity: Number(this.editForm.tankCapacity),
                     batteryCapacity: this.editForm.batteryCapacity,
                     seats: Number(this.editForm.seats),
                    engineDisplace: this.editForm.engineDisplace,
                    enginePower: this.editForm.enginePower,
                    status:this.editForm.status,
                    wheelbase: this.editForm.wheelbase
                    }
                    saveCarModel (data).then(res =>{
                        if(res.data.success){
                            this.$Message.success('修改成功')
                            this.getList()
                        }else{
                             this.$Message.error(res.data.errorMsg)
                        }
                        this.editModal = false
                    })
                }else{
                     this.$Message.error("请完成表单后添加")
                }
            })
            this.getList()
        },
 //删除车型
         handelDelete(id){
             let data= {uuid: id}
             this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除该车型</p>',
                    onOk: () => {
                       deleteCarModel(data).then(res =>{
                            if(res.data.success){
                                this.$Message.success('删除成功')
                            }else{
                                this.$Message.error(res.data.errorMsg)
                            }
                            this.getList()
                        })
                    },
                    onCancel: () => {
                        this.$Message.info('已取消');
                    }
                });
             
         } ,
         handleReset(){
            this.getList()
        },
    }
}
</script>
