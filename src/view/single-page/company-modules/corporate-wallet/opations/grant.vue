<template>
  <div>
    <Tabs v-model="tabChange">
      <TabPane label="申请" name="view">
        <div>
          <Form :label-width="80">
            <FormItem label="事由">
              <Input placeholder="请输入事由" style="width: 300px" v-model="comfirmData.reason"/>
            </FormItem>
            <FormItem label="金额">
              <Input placeholder="请输入金额" style="width: 300px" v-model="comfirmData.amount"/>
            </FormItem>
            <FormItem label="申请人">
              <Input placeholder="请输入申请人" style="width: 300px" v-model="comfirmData.applicant"/>
            </FormItem>
            <FormItem label="相关文件">
              <UploadFile
                :uploadtitle="uploadtitle"
                @uploadSuccess="loadSuccessCall"
                @uploadError="uploadErrorCall"
              ></UploadFile>
            </FormItem>
          </Form>
          <div>
            <Button type="primary" @click="applyConfirm">申请</Button>
          </div>
        </div>
      </TabPane>
      <TabPane label="记录" name="edit">
        <div>
          <VTable
            class="staff-table-container"
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :isLoading="isLoading"
            :parColumns="tableColumns"
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            style="margin-top: 25px;"
          ></VTable>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { grantApplication, grantList } from "@/api/enterpriseVehicle.js";
import { returnFieldstitle } from "../fields.js";
import UploadFile from "_a/uploadfile/index";
export default {
  name: "creditgranting",
  components: {
    UploadFile
  },
  data() {
    return {
      companyId: this.$route.params.id,
      total: 0,
      current: 1,
      pageSize: 10,
      isLoading: true,
      tableColumns: [],
      tableData: [],
      tabChange: "view",
      uploadtitle: '上传文件',
      comfirmData: {
        companyId: this.$route.params.id,
        reason: "",
        amount: "",
        applicant: "",
        files: []
      }
    };
  },
  created() {
    Object.entries(returnFieldstitle(this)).forEach(([key, value]) => {
      this.tableColumns.push(value);
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    changePage(val) {
      this.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    getList() {
      let data = {
        currPage: this.current,
        pageSize: this.pageSize,
        companyId: this.companyId
      };
      grantList(data)
        .then(res => {
          this.total = res.data.data.totalCount;
          this.tableData = res.data.data.list;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch(err => {
          this.total = 0;
          this.tableData = [];
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    applyConfirm() {
      grantApplication(this.comfirmData)
        .then(res => {
          this.$Message.success(res.data.msg);
          this.getList();
          this.tabChange = 'edit'
        })
        .catch(err => {});
    },
    loadSuccessCall(data) {
      this.comfirmData.files.push(data.data);
    },
    uploadErrorCall(errr) {}
  }
};
</script>
<style lang="less">
</style>