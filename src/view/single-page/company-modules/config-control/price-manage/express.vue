<template>
  <div class="container_box">
    <searchList :inputList="inputList" @on-search="queryList" @on-reset="handelReset"></searchList>
    <!-- v-hasAuth="'city_control-add'" -->
    <Button type="primary" @click="showAddModel">新增企业</Button>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="cityColumns"
      :parTableData="cityData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      style="margin-top: 20px;"
    ></VTable>
    <Modal v-model="addModal" title="新增企业" :mask-closable="false">
      <Form :model="addForm" :label-width="120" :rules="addFormRule" ref='addForm'>
        <FormItem label="企业名称:" prop="companyValue">
        <Select v-model="addForm.companyValue"  @on-change='selectCompany' label-in-value filterable style="width:200px">
            <Option
                v-for="item in companyList"
                :value="item.uuid"
                :key="item.uuid">{{(item.name)}}</Option>
        </Select>
        </FormItem>
        <FormItem label="统一社会信用代码:">
          <span>{{companyInfo.orgCode}}</span>
        </FormItem>
        <FormItem label="联系人:">
          <span>{{companyInfo.contactName}}</span>
        </FormItem>
        <FormItem label="联系电话:">
          <span>{{companyInfo.contactTel}}</span>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSaveCmpany">确定</Button>
      </div>
    </Modal>
    <Modal title="企业策略" v-model="isShowCommerceModal" :width="600">
      <div class="operate-btn" v-show="viewHistoryDetail">
        <Button type="primary" v-if="isViewDetail" @click="isViewDetail = false">编辑</Button>
        <Button type="success" v-else @click="getCompanyFormInfo">保存</Button>
      </div>
      <section>
        <h3 class="desc-title">实时</h3>
        <auditForm ref="imediate" :tabName='tabName' :isShowDetail="isViewDetail" :detailData='imediateDetailInfo'></auditForm>
      </section>

      <section>
        <h3 class="desc-title">预约</h3>
        <auditForm ref="bespeak" :tabName='tabName' :isShowDetail="isViewDetail" :detailData='bespeakDetailInfo'></auditForm>
      </section>
      <div slot="footer">
        <Button @click="isShowCommerceModal=false">取消</Button>
      </div>
    </Modal>
    <Modal title="查看历史版本" v-model="isShowHistoryModal" footer-hide :width="650">
      <Table :columns="columns" :data="historyData"></Table>
    </Modal>
  </div>
</template>                                                                

<script>
import { mapActions, mapState } from "vuex";
import auditForm from "./auditForm.vue";
import {
  getModelsLeveList,
  updateCarModel,
  addCmpany,
  deleteEnterprise,
  turnoffCompany,
  turnOnCompany,
  queryHistoryVersion,
  addStrategy,
  editStrategy,
  strategyDetail
} from "@/api/company-api/config.js";
import {getCompanyDetail} from "@/api/company-api/company.js"
import { pagedata } from "./data.js";
export default {
  name: "express",
  components: {
    auditForm
  },
  props: {
    tabIndex: String
  },
  data() {
    return {
      queryParams: {},
      tabName: Number(this.tabIndex),
      loginName:this.$store.state.user.userName,
      ...pagedata,
      uuid: "",
      rowInfo: {},
      viewHistoryDetail: true,
      isHasDetailData: true,
      imediateDetailInfo: {},
      bespeakDetailInfo: {},
      cityColumns: [
        {
          title: "企业名称",
          minWidth: 160,
          key: "enteroriseName"
        },
        {
          title: "状态",
          key: "status",
          minWidth: 160,
          render: (h, params) => {
            let text = params.row.status == 0 ? "未开通" : "已开通";
            return h("span", text);
          }
        },
        {
          title: "创建时间",
          key: "createTime",
          minWidth: 160,
        //   render: (h, params) => {
        //     let x = params.row.createTime;
        //     x = this.$moment(x).format("YYYY-MM-DD HH:mm:ss");
        //     return h("span", x);
        //   }
        },
        {
          title: "版本",
          key: "versionString",
          minWidth: 160,
          render: (h,params)=>{
              let text = params.row.versionString ? 'V'+params.row.versionString : params.row.versionString;
              return h('span', text)
          }
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 350,
          render: (h, params) => {
            return (
              h("div"),
              [
                h(
                  "a",
                  {
                    style: {
                      marginRight: "10px",
                      display: params.row.status === 1 ? "inline-block" : "none"
                    },
                    on: {
                      click: () => {
                        let info = params.row;
                        this.closeStra(info);
                      }
                    }
                  },
                  "关闭"
                ),
                h(
                  "a",
                  {
                    style: {
                      marginRight: "10px",
                      display: params.row.status === 0 ? "inline-block" : "none"
                    },
                    on: {
                      click: () => {
                        let info = params.row;
                        this.openStra(info);
                      }
                    }
                  },
                  "开启"
                ),
                h(
                  "a",
                  {
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        let info = params.row;
                        this.viewHistoryDetail = true;
                        let data = {
                          orgOpenId:  params.row.uuid
                        }
                        this.strategyDetail(data);
                        this.viewTactics(info);
                      }
                    }
                  },
                  "企业策略"
                ),
                h(
                  "a",
                  {
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        let info = params.row;
                        this.deleteCompany(info);
                      }
                    }
                  },
                  "删除"
                ),
                // h(
                //   "a",
                //   {
                //     style: {
                //       marginRight: "10px"
                //     },
                //     on: {
                //       click: () => {
                //         let info = params.row;
                //         this.uuid = params.row.uuid;
                //         this.auditCompany(info);
                //       }
                //     }
                //   },
                //   "编辑企业"
                // ),
                h(
                  "a",
                  {
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        let info = params.row;
                        this.viewHistoryVersion(info);
                      }
                    }
                  },
                  "查看历史版本"
                )
              ]
            );
          }
        }
      ],
      columns: [
        {
          title: "版本号",
          width: 200,
          key: "versionString",
          render: (h, params)=>{
              let text = 'V'+params.row.versionString
              return h('span',text)
          }
        },
        {
          title: "创建时间",
          width: 200,
          key: "createTime"
        },
        {
          title: "操作",
          key: "action",
          width: 215,
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    let info = params.row;
                    this.viewHistoryDetail = false;
                    this.viewHistoryDeatil(info);
                  }
                }
              },
              "查看详情"
            );
          }
        }
      ]
    };
  },
  computed: {
    ...mapState({
      companyList: state => state.common.companyList
    })
  },
  created() {
    this.getList();
    this.getCompanyList();
    
  },
  methods: {
    ...mapActions(["getCompanyList"]),
    strategyDetail(data) {//策略详情
        this.isShowCommerceModal = true;
        this.imediateDetailInfo = {};
        this.bespeakDetailInfo = {};
        strategyDetail(data).then(res => {
            if(res.data.success) {
                if(res.data.data && res.data.data.length>0) {
                    res.data.data.forEach(item=>{
                        if(item.typeTime == 1) {
                            this.imediateDetailInfo = item; //实时
                        } else if(item.typeTime == 2){
                            this.bespeakDetailInfo = item;// 预约
                        }
                    })
                    return this.isHasDetailData = true;
                }
                return this.isHasDetailData = false;
            }
        });
    },
    showAddModel() {
      this.addModal = true;
      this.addForm = {};
      this.companyInfo = {};
      this.$refs.addForm.resetFields();
    },
    //重置
    handelReset() {
      this.current = 1;
      this.queryParams = {};
      this.getList();
    },
    //获取分页List
    getList() {
      let data = {
        bussniseType: this.tabName,
        currPage: this.current,
        pageSize: this.pageSize,
        ...this.queryParams
      };
      this.$store.commit("changeLoadingFlag", true);
      getModelsLeveList(data).then(res => {
        this.cityData = res.data.data.list;
        this.total = res.data.data.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    queryList(res) {
      this.current = 1;
      this.queryParams = {
        enteroriseName: res.enteroriseName,
      };
      this.getList()
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    changePage(val) {
      this.current = val;
      this.getList();
    },
    closeStra(info) {
      let data = {
        uuid: info.uuid,
        loginName: info.loginName,
        enteroriseId: info.enteroriseId,
        status: 0,
        bussniseType: this.tabName
      };
      this.$Modal.confirm({
        title: "提示",
        content: "<p>您确认要关闭该企业的专属价格策略么？</p>",
        onOk: () => {
          turnoffCompany(data).then(res => {
           if(res.data.success) {
                this.$Message.success("关闭成功!");
                this.getList();
           }
          });
        }
      });
    },
    openStra(info) {
      let data = {
        uuid: info.uuid,
        loginName: info.loginName,
        enteroriseId: info.enteroriseId,
        status: 1,
        bussniseType:this.tabName
      };
      this.$Modal.confirm({
        title: "提示",
        content: "<p>您确认要开启该企业的专属价格策略么？</p>",
        onOk: () => {
          turnOnCompany(data).then(res => {
              if(res.data.success) {
                this.$Message.success("开启成功!");
                this.getList();
              }
          });
        }
      });
    },
    viewTactics(info) {
      //企业策略
      this.isShowCommerceModal = true;
      this.rowInfo = info;
      this.isViewDetail = true;
      this.resetFormValue();
    },
    deleteCompany(info) {
      let data = {
        uuid: info.uuid
      };
      //删除
      this.$Modal.confirm({
        title: "删除企业",
        content: "<p>您确认要删除该企业么？</p>",
        onOk: () => {
          deleteEnterprise(data).then(res => {
            this.$Message.success("删除成功");
            this.getList();
          });
        }
      });
    },
    auditCompany(info) {
      //编辑企业
      this.isShowCommerceModal = true;
      this.isViewDetail = false;
      this.resetFormValue();
    },
    viewHistoryVersion(info) {
      let data = {
        uuid: info.uuid,
        bussniseType: this.tabName
      };
      this.isShowHistoryModal = true;
      queryHistoryVersion(data).then(res => {
        this.historyData = res.data.data;
      });
    },
    viewHistoryDeatil(info) { //查看历史版本的详情
     let params = {
         versionString: info.versionString,
         orgOpenId: info.orgOpenId
     }
      this.strategyDetail(params)
    },
    resetFormValue() {
      this.tabValue = "1";
      this.$refs.imediate.resetForm();
      this.$refs.bespeak.resetForm();
    },
    getCompanyFormInfo() {//编辑企业策略
      let data = { strategys: [] };
      let imediateform = this.$refs.imediate.saveInfo();
      let bespeakform = this.$refs.bespeak.saveInfo();
      if (imediateform && bespeakform) {
        data.strategys.push(this.paramsFactory(imediateform, 1));
        data.strategys.push(this.paramsFactory(bespeakform, 2));
      } else {
        return this.$Message.error({
          content: "请检查实时和预约是否填写完整",
          duration: 3
        });
      }
      let commonMethod = this.isHasDetailData ? editStrategy : addStrategy;
      commonMethod(data).then(res => {
        if (res.data.success) {
          this.isShowCommerceModal = false;
          this.$Message.success(res.data.msg);
          this.getList();

        }
      });
    },
    paramsFactory(result, typeTime) {
      let info =  {
        loginName: this.loginName, //   string  登录人
        //orgOpenId: this.rowInfo.uuid, //   string  开通企业id
        businessType: Number(this.tabName), //   int 业务类型 2-专车 4-快车,
        typeTime, //   int 时效性 1-实时,2-预约
        ...result
      };
       if(this.isHasDetailData) {//如果是编辑策略  uuid和orgopenid 从详情中获取
            if(typeTime == 1){//实时
                info.uuid=  this.imediateDetailInfo.uuid
                info.orgOpenId= this.imediateDetailInfo.orgOpenId;
            }else {//预约
                info.uuid=  this.bespeakDetailInfo.uuid
                info.orgOpenId= this.bespeakDetailInfo.orgOpenId;
            }
      } else {//如果是新增策略 uuid和orgopenid 从列表中获取uuid
          info.uuid= this.rowInfo.uuid;
          info.orgOpenId= this.rowInfo.uuid;
      }
      return info;
    },
    selectCompany(data) {//选择企业名称获取企业详情
       if(data&&data.value) {
            this.companyName = data.label;
            getCompanyDetail({uuid: data.value}).then(res=>{
                if(res.data.success) {
                    this.companyInfo = res.data.data;
                }
            })
       }
    },
     //新增企业
    handleSaveCmpany() {
      let type = this.tabName == '2' ? "专车" : '快车';
      let data = {
        enteroriseId:  this.companyInfo.uuid, //   string  企业id
        enteroriseName: this.companyName, //   string  企业名称
        orgId: this.companyInfo.orgId, //   string  机构id
        bussniseType: Number(this.tabName), //   int 业务类型 2-专车 4-快车
        loginName: this.loginName //string  登录人
      };
      this.$Modal.confirm({
        title: "新增企业",
        content: "确认开通" + this.companyName + "的" + type + "业务吗",
        onOk: () => {
          addCmpany(data).then(res => {
            this.$Message.success("开通成功！");
            this.getList();
            this.addModal = false;
          });
        }
      });
    },
  }
};
</script>

<style lang="less">
.desc-title {
  font-size: 16px;
  margin: 8px 0;
}
.operate-btn {
  position: absolute;
  right: 10px;
  z-index: 1000;
}
</style>

