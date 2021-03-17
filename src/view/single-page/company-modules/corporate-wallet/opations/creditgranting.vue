<template>
  <div class="creditgrantingStyle">
    <Tabs v-model="tabChange">
      <TabPane label="查看" name="view">
        <div>
          <Form :label-width="120">
            <FormItem label="企业名称">
              <div>{{creditInfoDetail.companyName}}</div>
            </FormItem>
            <!-- <FormItem label="企业联系人">
                            <div>{{creditInfoDetail.companyName}}</div>
            </FormItem>-->
            <FormItem label="当前授信额度">
              <div>{{creditInfoDetail.creditLine}}元</div>
            </FormItem>
            <FormItem label="账单生成周期">
              <div>
                每月
                <span style="color: #000">{{creditInfoDetail.billCycle}}</span> 日
              </div>
            </FormItem>
            <FormItem label="当前可用额度">
              <div>
                <span style="color: red">{{formatAmount(creditInfoDetail.availableCredit)}}</span> 元
              </div>
            </FormItem>
            <FormItem label="最迟付款日">
              <div>
                账单生成后
                <span style="color: #000">{{creditInfoDetail.latestDate}}</span> 日
              </div>
            </FormItem>
            <FormItem label="相关">
              <div>
                <Button type="primary">下载全量文件</Button>
              </div>
            </FormItem>
          </Form>
           <div class="opations">
            <Button @click="goback" class="closebtn">关闭</Button>
          </div>
        </div>
      </TabPane>
      <TabPane label="编辑" name="edit">
        <div>
          <Form :label-width="120">
            <FormItem label="企业名称">
              <div>{{creditInfoDetail.companyName}}</div>
            </FormItem>
            <FormItem label="当前授信额度">
              <div style="color: red;display: inline-block;">{{formatAmount(creditInfoDetail.creditLine)}}</div>
              <div style="display: inline-block;margin-left: 4px;">元</div>
            </FormItem>
            <FormItem label="当前可用额度">
              <div>
                <span style="color: red">{{formatAmount(creditInfoDetail.availableCredit)}}</span> 元
              </div>
            </FormItem>
            <FormItem label="变动后授信额度">
              <div style="display: inline-block;">
                <Input v-model="adjustCreditLine" style="width: 200px;"/>
              </div>
              <div style="display: inline-block;margin-left: 20px;">元</div>
            </FormItem>
            <FormItem label="账单生成周期">
              <div>
                每月
                <Select style="width:80px" v-model="billCycle">
                  <Option :value="item" v-for="item in 32" :key="item">{{item}}日</Option>
                </Select>
              </div>
            </FormItem>
            <FormItem label="最迟付款日">
              <div>
                账单生成后
                <span style="color: #000">{{creditInfoDetail.latestDate}}</span> 日
              </div>
            </FormItem>
            <FormItem label="文件上传：">
              <UploadFile
                :uploadtitle="uploadtitle"
                @uploadSuccess="loadSuccessCall"
                @uploadError="uploadErrorCall"
              ></UploadFile>
            </FormItem>
          </Form>
          <div class="opations">
            <Button @click="goback" class="closebtn">关闭</Button>
            <Button type="primary" @click="saveEdit">保存</Button>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { formatAmount } from "@/libs/util.js";
import { creditInfo, creditEdit } from "@/api/enterpriseVehicle.js";
import UploadFile from "_a/uploadfile/index";
export default {
  name: "creditgranting",
  components: {
    UploadFile
  },
  data() {
    return {
      uploadtitle: "文件上传",
      companyId: this.$route.params.id,
      creditInfoDetail: {},
      tabChange: "view",
      uploadfiles: [],
      latestDate: "",
      billCycle: "",
      adjustCreditLine: ""
    };
  },
  mounted() {
    this.getcreditInfo();
  },
  methods: {
    getcreditInfo() {
      creditInfo(this.companyId)
        .then(res => {
          this.creditInfoDetail = res.data.data;
        })
        .catch(err => {});
    },
    goback() {
      this.$router.go(-1);
    },
    saveEdit() {
      let data = {
        companyId: this.companyId,
        adjustCreditLine: this.adjustCreditLine,
        billCycle: this.billCycle,
        latestDate: this.creditInfoDetail.latestDate,
        files: this.uploadfiles
      };
      creditEdit(data)
        .then(res => {
          this.$Message.success(res.data.msg);
          this.getcreditInfo();
          this.tabChange = 'view'
        })
        .catch(err => {});
    },
    loadSuccessCall(data) {
      this.uploadfiles.push(data.data);
    },
    uploadErrorCall(errr) {}
  }
};
</script>
<style lang="less">
.creditgrantingStyle {
  .ivu-form-item {
    margin-bottom: 20px !important;
  }
  .opations{
      margin-left: 500px;
      .closebtn{
          margin-right: 30px;
      }
  }
}
</style>