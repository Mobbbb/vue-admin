<!--发票管理-->
<template>
  <div>
    <searchList :inputList="inputList" @on-search='handleSearch' @on-reset="reset"></searchList>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="parColumns"
      :parTableData="tableData"
      :nodatatext="nodatatext"
      @changePage="changePage"
      @changePageSize="changePageSize"
      style="margin-top: 25px;">
    </VTable>
    <modal v-model="editMobel" title="快递单号输入">
       <Form :model="postForm" :label-width="80">
          <FormItem label="快递单号" prop='logisticsOrderNo'>
              <Input v-model="postForm.logisticsOrderNo" placeholder="请输入" :width="150" ></Input>
          </FormItem>
          <FormItem label="快递公司" prop='logisticsCompany'>
              <Input v-model="postForm.logisticsCompany" placeholder="请输入"></Input>
          </FormItem>
       </Form>
      <div slot="footer">
        <Button @click="editMobel=false">取消</Button>
        <Button type="primary" @click="poster_ok">确定</Button>
      </div>
    </modal>

    <modal v-model="detailMobel" title="发票详情" :width="550" :mask-closable="false">
      <p class="invoiceDetailTitle" style="margin-top: 0;">乘客信息</p>
      <div class="top15">
        <div class="detailName">乘客姓名：</div><div class="details">{{detailForm.passengerName}}</div>
      </div>
      <div class="top15">
        <div class="detailName">乘客手机号：</div><div class="details">{{detailForm.passengerMobile}}</div>
      </div>
      <br>
      <p class="invoiceDetailTitle">发票信息</p>
      <div class="top15">
        <div class="detailName">发票类型：</div>
            <div class="details">
              <span v-if="detailForm.invoiceType =='1'">电子发票</span>
              <span v-if="detailForm.invoiceType =='2'">纸质发票</span>
              <span 
                v-if="detailForm.invoiceType =='1'"
                @click="lookInvoice(detailForm.invoiceUrl)"
                class="check-invoice-btn">查看发票
              </span>
            </div>
      </div>
      <div class="top15">
        <div class="detailName">抬头类型：</div>
        <div class="details" v-if="detailForm.headerType == 1">企业单位</div>
        <div class="details" v-if="detailForm.headerType == 2">个人/非企业单位</div>
      </div>
      <div class="top15">
        <div class="detailName">发票抬头：</div>
        <div class="details">{{detailForm.header}}</div>
      </div>
      <div class="top15" v-if="detailForm.headerType == 1">
        <div class="detailName">税号：</div>
        <div class="details">{{detailForm.taxNum}}</div>
      </div>
      <div class="top15">
        <div class="detailName">发票内容：</div>
        <div class="details">{{detailForm.content}}</div>
      </div>
      <div class="top15">
        <div class="detailName">发票金额：</div>
        <div class="details">{{detailForm.money}}元</div>
      </div>
      <div class="top15" v-if="detailForm.registerAddress!=''">
        <div class="detailName">注册地址：</div>
        <div class="details">{{detailForm.registerAddress}}</div>
      </div>
      <div class="top15" v-if="detailForm.registerTel!=''">
        <div class="detailName">注册电话：</div>
        <div class="details">{{detailForm.registerTel}}</div>
      </div>
      <div class="top15" v-if="detailForm.openingBank!=''">
        <div class="detailName">开户银行：</div>
        <div class="details">{{detailForm.openingBank}}</div>
      </div>
      <div class="top15" v-if="detailForm.openingAccount!=''">
        <div class="detailName">开户账号：</div>
        <div class="details">{{detailForm.openingAccount}}</div>
      </div>
      <br>
      <p class="invoiceDetailTitle">开票详情</p>
      <div class="top15">
        <div class="detailName">开票状态：</div>
        <div class="details" v-if="detailForm.status == '0'"> 待开票</div>
        <div class="details" v-if="detailForm.status == '1'"> 已开票-寄送中</div>
        <div class="details" v-if="detailForm.status == '2'"> 已开票</div>
        <div class="details" v-if="detailForm.status == '3'"> 已取消</div>
        <div class="details" v-if="detailForm.status == '4'"> 已作废</div>
        <div class="details" v-if="detailForm.status == '5'"> 已开票（电子发票）</div>
      </div>
      <div class="top15">
        <div class="detailName">接受方式：</div>
        <div class="details" v-if="detailForm.invoiceType =='1'">
            电子邮箱({{detailForm.email}})
        </div>
        <div class="details" v-if="detailForm.invoiceType =='2'">
          <p>邮寄  &nbsp;&nbsp;&nbsp;<Button type="primary" @click="toPost" v-if="detailForm.status == '0'">录入单号</Button></p>
          <p>收件人：{{detailForm.recipient}}</p>
          <p>联系电话：{{detailForm.mobile}}</p>
          <p>所在地区(省市区)：{{detailForm.area}}</p>
          <p>详细地址：{{detailForm.detailAddress}}</p>
        </div>
      </div>
      <div class="top15">
        <div class="detailName" v-if="detailForm.payType=='1' || detailForm.payType=='2'">邮费：</div>
        <div class="details" v-if="detailForm.payType=='1'">到付</div>
        <div class="details" v-if="detailForm.payType=='2'">寄付</div>
      </div>
      <div class="top15">
        <div class="detailName">申请时间：</div><div class="details">{{detailForm.createTime}}</div>
      </div>
      <div class="top15" v-if="detailForm.status == '1'||detailForm.status == '2'">
        <div class="detailName">快递单号：</div><div class="details">{{detailForm.logisticsOrderNo}}</div>
      </div>
      <div class="top15" v-if="detailForm.status == '1'||detailForm.status == '2'">
        <div class="detailName">单号输入时间：</div><div class="details">{{detailForm.expressDate}}</div>
      </div>
      <p class="invoiceDetailTitle">相关订单</p>
      <Table border :columns="columnOrder" :data="oderData"></Table>
    </modal>

    <modal v-model="lookMobel" title="查看发票" :mask-closable="false">
      <div class="top15" style="margin-bottom: 15px">
        <img style="width: 100%" :src='invoiceImg' alt="">
      </div>
      <div slot="footer">
        <Button @click="lookMobel=false">关闭</Button>
        <Button type="primary" @click="downloadIamge">下载图片</Button>
      </div>
    </modal>
  </div>
</template>

<script>
import {getInvoiceList, getInvoiceDetail, inputPostInfo} from '@/api/finance.js'
import {inputList,Columns,columnOrder} from "./index";
import { downloadIamge } from '@/libs/tools'
import { getToken } from '@/libs/util'
import { config } from '@/config/index'
import fileDownload from 'js-file-download'
import axios from 'axios'

export default {
    data () {
      return {
        inputList: [],
        params: {},
        parColumns: [],
        tableData:[],
        current: 1,
        pageSize: 10,
        isLoading: true,
        total: 10,
        editMobel:false,
        posterNum:'',
        invoiceLi:{},
        detailMobel:false,
        detailForm: {},
        postForm:{
          logisticsOrderNo: ''
        },
        toType:'',
        lookMobel:false,
        invoiceImg:'',
        oderData:[],
        columnOrder:[],
        isAllDataRender: false,
        nodatatext: '请根据搜索条件筛选数据'
      }
    },
    mounted () {
      this.inputList = inputList
      this.columnOrder = columnOrder(this)
      Object.entries(Columns(this)).forEach(([key,value])=> {this.parColumns.push(value)})
      this.$store.commit('changeLoadingFlag', false)
    },
    methods: {
      downloadIamge(){
        axios({
          method: 'post',
          url: this._baseUrl + '/common/downloadFile',
          responseType: 'blob',
          headers: { 'Authorization': getToken() },
          data: { url: this.invoiceImg }
        }).then(function (res) {
          if(res.data) fileDownload(res.data, 'invoice.png')
        }).catch(function (error) {
          console.log(error)
        })
      },
      handleSearch (val) {
        this.params = val
        this.current = 1
        this.getTableList()
      },
      reset () {
        this.params = {}
        this.current = 1
        this.getTableList()
      },
      getTableList:function () {
        this.$store.commit('changeLoadingFlag', true)
        let data = {currPage : this.current ,pageSize: this.pageSize}
        if(this.params){
          data = Object.assign(data,this.params)
        }
        getInvoiceList(data).then(res => {
          this.tableData = res.data.data.list
          this.total = res.data.data.totalCount
          this.$store.commit('changeLoadingFlag', false)
        })
      },
      changePage: function(val){
        this.current = val;
        this.getTableList();
      },
      changePageSize: function(val){
        this.pageSize = val;
      },
      poster_ok: function () {
        if(this.postForm.logisticsOrderNo==''){
          this.$Message.error('输入不能为空')
        }else {
          let data = this.postForm;
          inputPostInfo(data).then(res=>{
            this.$Message.success('录入成功')
            this.editMobel = false
            this.getTableList()
            if(this.toType==1){
              getInvoiceDetail({uuid: this.postForm.uuid}).then(res => {
                this.postForm ={}
                this.detailForm = res.data.data
                this.oderData = res.data.data.itineraryList
              })
            } else {
              this.postForm ={}
            }
          })
        }
      },
      lookInvoice: function (url) {
        this.lookMobel=true;
        this.invoiceImg='https://' + url
      },
      toPost: function () {
        this.postForm.uuid = '';
        this.postForm.uuid = this.detailForm.uuid;
        this.editMobel = true;
        this.toType=1;
      }
    }
  }
</script>

<style scoped>
  .invoiceDetailTitle{
    padding-left: 50px;
    line-height: 30px;
    margin-top: 20px;
    font-weight: bold;
  }
  .detailName{
    width: 135px;
    display: inline-block;
    padding-left: 50px;
    vertical-align: top;
  }
  .details{
    display: inline-block;
  }
  .check-invoice-btn{
    color: #01a0e4;
    text-decoration: underline;
    cursor: pointer;
    padding-left: 10px;
  }
</style>
