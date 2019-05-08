<!--充电站-配置管理-供应商管理-wx-->

<template>
  <div class="appidenty">
    <Button type="primary" @click="addlistem" class="top20" v-hasAuth="'supplier-control-add'">新增供应商</Button>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      @sort="sort"
      @selectObj="selectObj"
      @changePage="changePage"
      @changePageSize="changePageSize"
      class="top15"
    ></VTable>
    <!-- 弹框 -->
    <modal :mask-closable="false" v-model="newMobel" :title="editorModal?'编辑':'新建'" @on-cancel="formReset('addparams')">
      <Form ref="addparams" :model="addparams" :rules="addparamsRule" :label-width="100">
        <FormItem v-show="!editorModal" label="供应商代码" prop="supplierId">
          <Input v-model="addparams.supplierId" placeholder="请输入供应商代码"/>
        </FormItem>
        <FormItem v-show="!editorModal" label="供应商名称" prop="supplierName">
          <Input v-model="addparams.supplierName" placeholder="请输入供应商名称"/>
        </FormItem>
        <FormItem label="品牌" prop="brandName">
          <Input v-model="addparams.brandName" placeholder="请输入品牌"/>
        </FormItem>
        <FormItem label="联系人" prop="contact">
          <Input v-model="addparams.contact" placeholder="请输入联系人"/>
        </FormItem>
        <FormItem label="联系人电话" prop="phone">
          <Input v-model="addparams.phone" placeholder="请输入联系人手机号"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="newMobel = false;formReset('addparams')">取消</Button>
        <Button type="primary" @click="addSubmit('addparams')">保存</Button>
      </div>
    </modal>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import { returnFields, addparamsRule } from "./fields";
import {
  axiosSupplierList,
  axiosAddSupplier,
  axiosEditSupplier,
  axiosSwitchSupplier
} from "@/api/charge.js";
export default {
  name: "chargeSupplierControl",
  components: {
    VTable
  },
  data() {
    return {
      addparamsRule,
      total: 0,
      current: 1,
      pageSize: 10,
      editorModal: false, //是否为编辑，否则为新建
      newMobel: false, //新建弹出框
      parColumns: [],
      tableData: [],
      addparams: {
        //新增参数
        supplierId: "", // 供应商代码
        supplierName: "", // 供应商名称
        brandName: "", // 品牌
        contact: "", // 联系人
        phone: "" // 联系人电话
      }
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 新增供应商
    addSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.addparams));

          // 如果是编辑，调用编辑
          if (this.editorModal) {
            axiosEditSupplier(params).then(res => {
              this.getList(true);
              this.newMobel = false;
              this.$Message.success(res.data.msg);
              this.formReset("addparams");
            });
          } else {
            // 否则是新增，调用新增
            axiosAddSupplier(params).then(res => {
              this.getList(true);
              this.newMobel = false;
              this.$Message.success(res.data.msg);
              this.formReset("addparams");
            });
          }
        }
      });
    },
    // 初始化新增表单
    formReset(name) {
      this.$refs[name].resetFields();
    },
    // 获取供应商列表
    getList(isNoLoading) {
      !isNoLoading && this.$store.commit("changeLoadingFlag", true);
      let that = this;
      let data = {
        pageSize: this.pageSize,
        currPage: this.current
      };
      axiosSupplierList(data).then(res => {
        let resdata = res.data.data;
        this.tableData = (resdata && resdata.list) || [];
        this.total = resdata && resdata.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    // 点击新增
    addlistem: function() {
      this.editorModal = false;
      this.newMobel = true;
    },
    sort: function() {},
    selectObj: function() {},
    changePage: function(val) {
      this.current = val;
      this.getList();
    },
    changePageSize: function(val) {
      this.pageSize = val;
      this.getList();
    }
  }
};
</script>
<style lang="less">
</style>
