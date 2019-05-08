<template>
  <div>
    <SearchList :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
    <div class="btnGroup">
      <router-link :to="{name: 'once-coupons'}" v-hasAuth="'coupons-template-distribute'">
        <Button type="primary" style="margin-right:50px;">一次性发券</Button>
      </router-link>
      <router-link :to="{name: 'once-couponsRecord'}" v-hasAuth="'coupons-template-record'">
        <Button type="primary" style="margin-right:50px;">一次性发券记录</Button>
      </router-link>
      <Button type="primary" @click="newTemplate" v-hasAuth="'coupons-template-edit'">新增优惠模板</Button>
    </div>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @selectObj="selectObj"
      @changePage="changePage"
      @changePageSize="changePageSize"
      style="margin-top: 15px;"
    ></VTable>
    <Modal class-name="formModalStyle" v-model="isShow" :title="title" :mask-closable="false">
      <Form ref="formInline" :model="formInline" :label-width="120" :rules="formRule">
        <FormItem label="优惠券模板名称" prop="templateName">
          <Input v-model="formInline.templateName"></Input>
        </FormItem>
        <FormItem label="优惠券类型" prop="couponType">
          <Select @on-change="changeDetail" v-model="formInline.couponType">
            <Option :value="1">折扣券</Option>
            <Option :value="2">抵扣券</Option>
          </Select>
        </FormItem>
        <FormItem label="使用方" prop="platformType">
          <Select v-model="formInline.platformType">
            <Option :value="1">普通</Option>
            <Option :value="2">客服</Option>
          </Select>
        </FormItem>
        <FormItem label="业务类型" prop="useType">
          <Select v-model="formInline.useType">
            <Option :value="4">快车</Option>
            <Option :value="2">专车</Option>
            <Option :value="1">出租车</Option>
          </Select>
        </FormItem>
        <FormItem label="订单类型" prop="useLimit">
          <Select v-model="formInline.useLimit">
            <Option :value="1">实时</Option>
            <Option :value="2">预约</Option>
          </Select>
        </FormItem>
        <div v-if="formInline.couponType === 1">
          <FormItem label="折扣" prop="discount">
            <Input placeholder="请输入大于0小于10的值" v-model="formInline.discount" :maxlength="3" number>
              <span slot="append">折</span>
            </Input>
          </FormItem>
          <FormItem label="条件" prop="highestMoney">
            <Input placeholder="请输入大于0的值" v-model="formInline.highestMoney" number>
              <span slot="prepend">最高抵扣</span>
              <span slot="append">元</span>
            </Input>
          </FormItem>
        </div>
        <div v-else>
          <FormItem label="面额" prop="couponMoney">
            <Input v-model="formInline.couponMoney" number>
              <span slot="append">元</span>
            </Input>
          </FormItem>
          <FormItem label="条件" prop="astrict">
            <Input placeholder="请输入不小于0的数字" v-model="formInline.astrict" number>
              <span slot="prepend">满</span>
              <span slot="append">元使用</span>
            </Input>
          </FormItem>
        </div>
        <FormItem label="状态" prop="couponState">
          <Select clearable v-model="formInline.couponState">
            <Option :value="1">启用</Option>
            <Option :value="2">关闭</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          size="large"
          @click="save('add')"
          style="width: 80px"
          v-show="isAdd"
        >保存</Button>
        <Button
          type="primary"
          size="large"
          @click="save('update')"
          style="width: 80px"
          v-show="!isAdd"
        >保存</Button>
        <Button size="large" @click="isShow = false" style="width: 80px;">关闭</Button>
      </div>
    </Modal>
    <Modal v-model="isShowDisabled" :mask-closable="false">
      <p class="disabledTxt">您确定要{{disabledTxt}}此模板吗？</p>
      <div slot="footer">
        <Button type="primary" size="large" long @click="disabled">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { fields, pageData, inputList } from "./fields";
import {
  templateList,
  templateInfo,
  templateSave,
  templateUpdate
} from "@/api/passenger";

export default {
  created() {
    this.getList();
  },
  mounted() {
    this.inputList = JSON.parse(JSON.stringify(inputList));
    this.getTableColumns();
  },
  data() {
    return {
      ...pageData,
      inputList: [],
      isAdd: true, // true为新增，false为修改
      isShow: false, // 是否显示Modal
      deduction: false, // 抵扣券是否显示
      isDiscount: false, // 折扣券是否显示
      isShowDisabled: false, // 是否显示停用界面
      uuid: "", // 所选用户的uuid
      disabledTxt: "停用", // 停用启用文字描述
      disabledType: Number, // 是否启用、停用，  1 启用，2停用
      title: "",
      formInline: {},
      searchData: {}
    };
  },
  methods: {
    search: function(data) {
      this.searchData = data;
      this.current = 1;
      this.getList();
    },
    reset: function(data) {
      this.searchData = {};
      this.current = 1;
      this.getList();
    },
    getList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize
      };
      if (Object.keys(this.searchData).length>0) {
        Object.assign(params, this.searchData);
      }
      this.$store.commit('changeLoadingFlag', true)
      templateList(params).then(res => {
        if (res.data.success) {
          let data = res.data.data;
          this.isLoading = true;
          this.total = data.totalCount;
          this.current = data.currPage !== 0 ? res.data.data.currPage : 1;
          this.pageSize = data.pageSize;
          this.tableData = data.list;
          // this.tableData.forEach(item => {//无类型之分 叶进定义
          //   if(item.couponType===1){
          //     item.other = '满'+ item.astrict +'元使用'
          //   } else if(item.couponType===2){
          //     item.other = '最多优惠'+ item.astrict +'元'
          //   } else {
          //     item.other= '暂无数据'
          //   }
          // })
          this.$store.commit("changeLoadingFlag", false);
        }
      });
    },
    changeTableTitle(data) {
      this.tableColumnsChecked = data;
      this.getTableColumns();
    },
    getTableColumns() {
      let data = [];
      let action = {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 200,
        render: (h, params) => {
          let btnText = params.row.couponState === 1 ? "停用" : "启用";
          return h("div", [
            h(
              "Button",
              {
                props: {
                  type: "warning",
                  size: "small"
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'coupons-template-edit'
                }],
                attrs: {
                  ghost: "ghost"
                },
                style: {
                  marginRight: "15px",
                  display: params.row.couponState === 1 ? "inlin-block" : "none"
                },
                on: {
                  click: () => {
                    this.title = "修改活动";
                    this.isAdd = false;
                    this.formInline = {};
                    this.detail(params.row.uuid);
                  }
                }
              },
              "修改"
            ),
            h(
              "Button",
              {
                props: {
                  type: "success",
                  size: "small"
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'coupons-template-detail'
                }],
                attrs: {
                  ghost: "ghost"
                },
                style: {
                  marginRight: "15px"
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: "coupons-template-detail",
                      params: { id: params.row.uuid }
                    });
                  }
                }
              },
              "详情"
            ),
            h(
              "Button",
              {
                props: {
                  type: "primary",
                  size: "small"
                },
                directives: [{
                  name: 'hasAuth',
                  value: 'coupons-template-update'
                }],
                attrs: {
                  ghost: "ghost"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    this.isShowDisabled = true;
                    this.uuid = params.row.uuid;
                    if (params.row.couponState === 1) {
                      this.disabledTxt = "停用";
                      this.disabledType = 2;
                    } else if (params.row.couponState === 2) {
                      this.disabledTxt = "启用";
                      this.disabledType = 1;
                    }
                  }
                }
              },
              btnText
            )
          ]);
        }
      };
      this.tableColumnsChecked.forEach(col => data.push(fields[col]));
      data.push(action);
      this.tableColumns = data;
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    selectObj(data) {
      let strIds = [];
      data[0].forEach((currentValue, index, arr) => {
        strIds.push(currentValue.csmId);
      });
      this.ids = strIds.join();
    },
    changePage(val) {
      this.current = val;
      this.getList();
    },
    changeDetail(value) {
      if (value === 1) {
        this.isDiscount = true;
        this.deduction = false;
        delete this.formInline["couponMoney"];
      } else if (value === 2) {
        this.deduction = true;
        this.isDiscount = false;
        delete this.formInline["discount"];
      } else {
        this.isDiscount = false;
        this.deduction = false;
      }
    },
    newTemplate() {
      this.isShow = true;
      this.isAdd = true;
      this.formInline = {
        couponType: 1
      };
      this.title = "新增优惠券模板";
      this.$refs["formInline"].resetFields();
    },
    save(type) {
      let params = this.formInline;
      if (type === "add") {
        this.$refs["formInline"].validate(valid => {
          if (valid) {
            templateSave(params).then(res => {
              this.isShow = false;
              this.$Message.success(res.data.msg);
              this.getList();
            });
          } else {
            this.$Message.error("请重新确认内容!");
          }
        });
      } else if (type === "update") {
        this.$refs["formInline"].validate(valid => {
          if (valid) {
            templateUpdate(params).then(res => {
              if (res.data.success) {
                this.isShow = false;
                this.$Message.success(res.data.msg);
                this.getList();
              } else {
                this.$Message.error(res.data.msg);
              }
            });
          } else {
            this.$Message.error("请重新确认内容!");
          }
        });
      }
    },
    detail(id) {
      let params = {uuid: id};
      templateInfo(params).then(res => {
        if (res.data.success) {
          this.isShow = true;
          this.formInline = res.data.data;
          this.changeDetail(res.data.data.couponType);
        } else {
          this.$Message.error(res.data.errorMsg);
        }
      });
    },
    dataLimit() {
      if (this.formInline.highestMoney < 0) {
        this.formInline.highestMoney = "";
      }
    },
    disabled() {
      // 停用启用接口
      let params = {
        uuid: this.uuid,
        couponState: this.disabledType
      };
      templateUpdate(params).then(res => {
        if (res.data.success) {
          this.isShowDisabled = false;
          this.$Message.success(res.data.msg);
          this.getList();
        } else {
          this.$Message.error(res.data.errorMsg);
        }
      });
    }
  }
};
</script>
<style lang="less">
.couponsCenter {
  text-align: left;
}
.disabledTxt {
  text-align: center;
  padding: 40px 0px;
  font-size: 16px;
}
</style>