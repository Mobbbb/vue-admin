<template>
<div class="cardbox " id='basic_info'>
    <Card style="width:100%">
        <p slot="title">基础信息</p>
        <div slot="extra"> 
            <span class="likeA"  v-if="!editable" @click="editAction">编辑</span>
            <span class="likeA" v-if="!closed" style="margin-left:10px" @click="closeAction(true)">收起 </span>
            <span class="likeA" v-if="closed" style="margin-left:10px" @click="closeAction(false)">展开 </span>
        </div>
        <div v-if="!closed">
            <Form :label-width="100" :model="basicForm" :rules="ruleValidate" ref="basicForm">
                <FormItem label='车架号:' prop="vin">
                    <Row>
                         <Col span="5">
                            <!-- <Input  v-bind:disabled='!editable' v-model="basicForm.vin" ></Input> -->
                            <span>{{basicForm.vin}}</span>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='发动机号:'>
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable' v-model="basicForm.engineId" ></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='品牌:'>
                    <Row>
                        <Col span="5">
                            <Input  v-model="basicForm.brandName" disabled></Input>
                        </Col>
                    </Row>

                    <Row>
                         <Col span="5">
                      
                            <Select v-model="basicForm.brandUuid" placeholder="点击修改品牌" v-bind:disabled='!editable'  >
                                <Option v-for="item in brandList" :key="item.index" :value="item.uuid" @click.native="handleBrand(item)">{{item.brandName}} </Option>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='车型:'>
                     <Row>
                        <Col span="5">
                            <Input  v-model="basicForm.modelName" disabled></Input>
                        </Col>
                    </Row>
                    <Row>
                         <Col span="5">
                            <Select 
                            v-model="basicForm.carModelUuid"
                             placeholder="请选择车型"
                           
                             >
                             <Option v-for="(item,index) in carTypeList" :key="index" :value="item.uuid" @click.native="handleModel(item)" >{{item.modelName}}</Option>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='车辆动力类型:'>
                    <Row>
                         <Col span="5">
                                <span v-if="basicForm.fuelType=='0'"> 汽油车</span>
                                <span v-if="basicForm.fuelType=='1'"> 纯电动汽车</span>
                                <span v-if="basicForm.fuelType=='2'"> 插电式混合动力汽车</span>
                                <span v-if="basicForm.fuelType=='3'"> 燃料电池汽车</span>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='油箱容量:' v-if="basicForm.fuelType=='0' || basicForm.fuelType=='2' " >
                    <Row>
                         <Col span="5">
                                <span   >{{basicForm.fuelCapacity}}</span>
                             <!-- <Input disabled v-model="basicForm.fuelCapacity"></Input> -->
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='电池容量:' v-if="basicForm.fuelType=='1' || basicForm.fuelType=='2' || basicForm.fuelType=='3' " >
                    <Row>
                         <Col span="5">
                                <span   >{{basicForm.batteryCapacity}}</span>
                             <!-- <Input disabled v-model="basicForm.fuelCapacity"></Input> -->
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='发动机排量:'  v-if="basicForm.fuelType=='0' || basicForm.fuelType=='2' ">
                    <Row>
                         <Col span="5">
                                <span   >{{basicForm.engineDisplace}}</span>
                             <!-- <Input disabled v-model="basicForm.fuelCapacity"></Input> -->
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='颜色:' >
                    <Row>
                         <Col span="5">
                             <Input v-bind:disabled='!editable' v-model="basicForm.colour"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='状态:'>
                    <Row>
                         <Col span="5">
                            <Select v-model="basicForm.status" placeholder="请选择品牌" v-bind:disabled='!editable'>
                                <Option :value= 1>正常</Option>
                                <Option :value= 0>报废</Option>
                                <Option :value= 1>库存</Option>
                                <Option :value= 2>冻结</Option>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='车辆照片'>
                    <Row>
                         <Col span="7">
                            <input v-model="basicForm.photo"  type="hidden">
                            <!-- <Upload
                                v-bind:disabled='!editable'
                                multiple
                                type="drag"
                                action="//jsonplaceholder.typicode.com/posts/">
                                <div style="padding: 20px 0">
                                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                    <p>点击或拖拽图片文件到这里</p>
                                </div>
                            </Upload> -->
                            <!-- <img :src="basicForm.photo[0].url" alt=""> -->
                            <Vupload :action="uploadUrl" :defaultList="imgList" @on-upsuccess="theImgCallback"> </Vupload>
                            <span>请上传jpg或png，176*220，小于200k的图</span>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='备注（选填）:' >
                    <Row>
                         <Col span="5">
                             <Input v-bind:disabled='!editable' v-model="basicForm.comment"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <Button type="primary" v-show="editable" @click="SaveAction('basicForm')">保存</Button>
            </Form>
        </div>
        <div v-if="closed">...</div>
    </Card>
</div>
</template>
<script>
import { getOwnedBrand } from '@/api/configData.js'
import {getBrandList,saveBaceInfo} from '@/api/vehicle.js'
import  Vupload from '_a/v-upload/v-upload.vue'
export default {
    name:'basic-info',
    components: {Vupload},
    props:{
        infoData:{
            type: Object,
            default: ()=>{
                return {}
            }
        }
    },
    watch:{
        'infoData': function(){
             this.basicForm = JSON.parse(JSON.stringify(this.infoData))
             this.imgList = this.basicForm.photo? [{url:this.basicForm.photo}] : []
        }
    },
    mounted (){
        // this.cloneData()
        let data ={}
        getOwnedBrand(data).then(res =>{
                if (res.data.success) {
                    this.brandList = res.data.data
                }
                else{
                    this.$Message.error(res.data.errorMsg)
                }
            })
    },
    data () {
        return {
            closed: false,
            editable: true,
            uploadUrl: `${this._baseUrl}/common/uploadPics`,
            basicForm: {
                // brandUuid:'6bd514d1de9548ddb90d776b67868976'
            },
            brandList: [],
            imgList: [],
            carTypeList: [
            ],
            ruleValidate:{
                vin: [
                        { required: true, message: '请填写',  trigger: 'blur' }
                    ],
            }
        }
    },
    methods:{
        cloneData(){
            this.basicForm = JSON.parse(JSON.stringify(this.infoData))
        },
        closeAction(val) {
        this.closed = val
        },
        SaveAction(name){
            this.$refs[name].validate((valid) => {
                    let data = {
                        uuid : this.basicForm.uuid,
                        userUuid:this.$store.state.user.userId,
                        vin : this.basicForm.vin,
                        engineId:this.basicForm.engineId,
                        brandUuid:this.basicForm.brandUuid,
                        carModelUuid: this.basicForm.modelUuid,
                        vehicleType: this.basicForm.vehicleType,
                        colour: this.basicForm.colour,
                        status:Number(this.basicForm.status),
                        photo: this.basicForm.photo,
                        comment:this.basicForm.comment
                    }
                    data.carModelUuid = this.basicForm.carModelUuid ? this.basicForm.carModelUuid: this.basicForm.modelUuid
                    if (valid) {
                        saveBaceInfo(data).then(res =>{
                            if(res.data.success){
                                this.$Message.success('保存成功!')
                                this.$emit('getInfo')
                                this.editable = false
                            }
                        })
                        
                    } else {
                        this.$Message.error('表单验证有误!');
                    }
                })
        },
        theImgCallback(res){
            this.imgList = [{url: res.data.picUrl}]
            this.basicForm.photo = res.data.picUrl
        },
        editAction(){
            this.editable = true
        },
        handleBrand(obj){
            let params = {brandUuid :obj.uuid}
            getBrandList(params).then(res =>{
                this.carTypeList = res.data.data
            })
        },
        handleModel(item){
            this.basicForm.fuelType = item.fuelType
            this.basicForm.tankCapacity = item.tankCapacity
            this.basicForm.batteryCapacity = item.batteryCapacity
            this.basicForm.engineDisplace = item.engineDisplace
            this.basicForm.vehicleType = item.vehicleType
        },
        getVehicleModelList(){

        }
    }
}
</script>
<style lang="less">
.cardbox{
.likeA{
        color: #1890FF;
        cursor: pointer;
}
}

</style>

