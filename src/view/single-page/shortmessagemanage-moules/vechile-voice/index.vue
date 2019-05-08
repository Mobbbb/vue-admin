<template>
  <div>
    <SearchList :inputList="inputList" @on-search='queryData' @on-reset="clearQueryData"></SearchList>
    <div style="margin: 0 0 20px 0;" >
      <Button type="primary" @click="addMessage" v-hasAuth="'vechile-voice-add'">新建消息</Button>
    </div>
    <VTable
      class="staff-table-container"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize">
    </VTable>
    <Modal
      :title="modalTitle"
      :mask-closable="false"
      v-model='isShowDetail'
      width="600">
      <div class="voiceDetail">
        <p>
          <span class="editName">发送对象：</span><span class="editDetail">{{sendRole}}</span>
        </p>
        <p>
          <span class="editName">发送范围：</span>
          <span v-if="detailMessageObj.carDriver==8">指定车辆</span>
          <span v-if="detailMessageObj.carDriver==4">指定运营商</span>
          <span v-if="detailMessageObj.carDriver==9">批量</span>
        </p>
        <p v-if='detailMessageObj.carDriver == 8' style="padding-left: 126px;">
          <span v-for="(item, index) in detailMessageObj.zdCar">
            {{item}}
            <span v-if="detailMessageObj.zdCar.length !== index + 1">、</span>
          </span>
        </p>
        <p v-if='detailMessageObj.carDriver == 4' style="padding-left: 126px;">
          <span v-for="(item, index) in detailMessageObj.zdyys">
            {{item}}
            <span v-if="detailMessageObj.zdyys.length !== index + 1">、</span>
          </span>
        </p>
        <p v-if='detailMessageObj.carDriver == 9'>
          <span class="editName"></span>
          <ExportFile :exportUrl='exportMsgUrl' ajaxMethod='post' :queryData="exportData"></ExportFile>
        </p>
        <p>
          <span class="editName">消息内容：</span>{{detailMessageObj.contents}}
        </p>
      </div>
      <div slot="footer">
        <Button  @click="isShowDetail=false">关闭</Button>
      </div>
    </Modal>

    <Modal
      :title="modalTitle"
      :mask-closable="false"
      v-model='isShowModal'
      width="600">
      <Form :model='addMessageObj' :label-width='80' :rules='addMsgRule' ref='vechileForm'>
        <FormItem label='发送对象' >
          <Input v-model='sendRole' readonly style="width:200px"></Input>
        </FormItem>
        <Row>
          <FormItem label='发送范围' prop='carDriver'>
            <Select v-model="addMessageObj.carDriver" @on-change='changeSendScope' clearable filterable style="width:200px">
              <Option :value="8">指定车辆</Option>
              <Option :value="4">指定运营商</Option>
              <Option :value="9">批量</Option>
            </Select>
          </FormItem>
          <div v-if='scopeId == 8'>
            <FormItem prop='vinList'>
              <Input v-model="addMessageObj.vinList" type="textarea" :rows="4" placeholder="请输入车牌号，以英文逗号隔开" />
            </FormItem>
          </div>
          <div v-if='scopeId == 4'>
            <FormItem label='业务类型' prop='businessType'>
              <Select v-model="addMessageObj.businessType" multiple clearable filterable style="width:200px">
                <Option v-for="(item, index) in businessTypes" :value="item.value" :key="index">{{ item.text }}</Option>
              </Select>
            </FormItem>
            <FormItem label='运营商' prop='agentUuid'>
              <TreeInput
                :data='operatorGroup' 
                @on-change="selectNode"
                v-model="addMessageObj.agentUuid">
              </TreeInput>
            </FormItem>
          </div>
          <FormItem v-if='scopeId == 9'>
            <ImportFile 
              :importFileUrl='importUrl' 
              @on-success="successBack"
              toDownTemplateUrl='/carDriverTemplate.xlsx' 
              style="display: inline-block;">
            </ImportFile>
          </FormItem>
        </Row>
        <FormItem label='消息内容'  prop='carDriverContent'>
          <Input v-model="addMessageObj.carDriverContent" type="textarea" :rows="4" placeholder="请输入短信内容" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="submitAddMessage"  :loading="isNotloading" type="primary">
         <span v-if="!isNotloading">确定</span>
          <span v-else>请稍后...</span>
          </Button>
        <Button @click="isShowModal=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import TreeInput from '_a/tree-input/tree-input.vue';
import ImportFile from '_a/import-file/index.vue';
import ExportFile from '_a/export-file/exportFile.vue';
import {tableTitle, pageData, inputList} from './fields.js';
import {vechileVoiceList, sendVechileMessage, viewVechileDetail} from '@/api/driver.js';
import { changeKeyMethod } from '@/libs/tools.js'

export default {
  components: {
    ImportFile,
    ExportFile,
    TreeInput
  },
  data() {
    const businessType = (rule, value, callback) => {
        if(typeof(value) !== 'undefined' && value.length) callback()
        else callback(new Error('业务类型不得为空'))
    }
    const agentUuid = (rule, value, callback) => {
      if(this.addMessageObj.agentUuid.length) callback()
      else callback(new Error('运营商不得为空'))
    }
    return {
      addMsgRule: {
        carDriver: [{required: true,message:'请选择发送范围'}],
        carDriverContent: [{required: true, message: '请输入发送内容', trigger:'blur'}],
        vinList: [{required: true, message: '请输入Vin码，用英文逗号隔开'}],
        businessType: [{required: true, validator: businessType, trigger: 'change'}],
        agentUuid: [{required: true, validator: agentUuid, trigger: 'change'}],
      },
      exportData: {},
      inputList: [],
      importUrl: '/carDriver/importExcel',
      detailMessageObj: Object,
      isShowDetail:false,
      ...pageData
    }
  },
  created() {
    this.inputList = JSON.parse(JSON.stringify(inputList))
    this.getTableColumns();
    this.getList();
  },
  methods: {
    selectNode() {
      this.$refs.vechileForm.validateField('agentUuid')
    },
    clearQueryData(data) {
      this.current = 1;
      this.queryAjaxPramas = {}
      this.getList();
    },
    queryData(data) {
      data.createTime = this.$moment(data.createTime).format('YYYY-MM-DD')
      this.current = 1;
      this.queryAjaxPramas = data
      this.getList();
    },
    getList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize
      };
      let obj = Object.assign(params, this.queryAjaxPramas);
      vechileVoiceList(obj).then(res => {
        this.total = res.data.data.totalCount;
        this.tableData = res.data.data.list;
        this.$store.commit('changeLoadingFlag', false)
      })
    },
    getTableColumns () {
      let data = []
      let actions = {
        key: 'action',
        title: '详情',
        width: 100,
        render: (h, params) => {
          return h('Button', {
            props: {
              type: 'success',
              size: 'small',
              ghost: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'vechile-voice-detail'
            }],
            on: {
              click: ()=> {
                let batchNo = params.row.batchNo;
                this.viewDetail(batchNo)
              }
            }
          }, '详情')
        }
      }
      data = [...tableTitle];
      data.push(actions);
      this.tableColumns = data;
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    changePage (val) {
      if(val) {
        this.current = val;
        this.getList();
      }
    },
    changeSendScope(data){
      if (data) {
        this.scopeId = -1;
        this.scopeId = data;
      }
    },
    viewDetail(batchNo) {
      this.exportData = {
        batchNo: batchNo
      }
      this.modalTitle = '查看详情';
      this.isShowDetail = true;
      this.detailMessageObj = {};
      viewVechileDetail({batchNo: batchNo}).then(res => {
        let data = res.data.data
        this.scopeId = data.carDriver
        this.detailMessageObj = data
      })
    },
    addMessage() {
      this.modalTitle = '新建消息';
      this.scopeId = 8;
      this.isShowModal = true;
      this.addMessageObj = {
        agentUuid: [] 
      };
      this.$refs.vechileForm.resetFields();
      this.operatorGroup = JSON.parse(localStorage.getItem('pcOperatorList'))
    },
    successBack(res) {
      if (res.success) {
        this.addMessageObj.sessionId = res.data;
        this.getList();
      }
    },
    submitAddMessage() {
      this.$refs.vechileForm.validate(valid=> {
        if(valid) {
          this.isNotloading = true;
          let url = "appointToCar";
          let params = {
            carDriverContent: this.addMessageObj.carDriverContent
          };
          if (this.scopeId == 8) {
            params.carDriver = this.addMessageObj.carDriver;
            params.vinList = this.addMessageObj.vinList.split(',');
          }
          if (this.scopeId == 4) {
            url = 'operatorListInform';
            params.agentUuid = [...this.addMessageObj.agentUuid];
            params.businessType = this.addMessageObj.businessType;
          }
          if (this.scopeId == 9) {
            url = 'insertExcel';
          }
          params.sessionId = this.addMessageObj.sessionId;
          sendVechileMessage(params, url).then(res=>{
            if(res.data.success) {
              this.$Message.success('发送成功!')
              this.isShowModal = false;
              this.isNotloading = false;
              this.getList();
            }else {
              this.isNotloading = false;
            }
          }).catch(err=>{
            this.isNotloading = false;
          })
        }
      })
    }
  }
}
</script>

<style>
  .voiceDetail p{line-height: 30px;display: flex; padding-left: 50px;text-align: left}
  .voiceDetail .editName{
    width: 76px;
    padding: 0;
    display: inline-block;
  }
  .voiceDetail .editDetail{
    width: 400px;
    display: inline-block;
  }
</style>
