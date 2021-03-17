<template>
  <div class="dispatchcar">
    <div class="outerlist">
      <div class="searchlist">
        <multiSselect
          :url="companyUrl"
          query="companyName"
          data-key="companyName"
          data-label="companyName"
          @on-success="getcompany"
          :width="300"
          :titlefront="titlefront"
          ref="muselect"
        ></multiSselect>
      </div>
      <div class="rechargecord">
        <Button type="primary" @click="search">查询</Button>
        <Button @click="reset" style="margin: 0 20px">清空</Button>
        <Button type="primary" @click="torechargeRecord">充值记录</Button>
      </div>
    </div>
    <VTable
      :total="tabelData.total"
      :current="tabelData.current"
      :pageSize="tabelData.pageSize"
      :isLoading="tabelData.isLoading"
      :parColumns="tabelData.parColumns"
      :parTableData="tabelData.tableDataCom"
      @changePage="changePage"
      @changePageSize="changePageSize"
      class="top20"
    ></VTable>
    <Modal v-model="freezOptaion" title="冻结操作">
      <p>确定要执行冻结操作吗？</p>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="confirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { returnFields } from "./fields.js";
import VTable from "_a/v-table/v-table";
import { walletList, freezeWallet } from "@/api/enterpriseVehicle.js";
import multiSselect from "_a/multi-select/multi-select";
export default {
  components: {
    VTable,
    multiSselect
  },
  data() {
    return {
      searchParams: {},
      tabelData: {
        total: 0,
        current: 1,
        pageSize: 10,
        isLoading: false,
        parColumns: [],
        tableDataCom: []
      },
      madalParams: {},
      columns: [],
      modalData: [],
      modalSearchList: [],
      freezOptaion: false,
      companyUrl: "/company/wallet/list",
      companyId: "",
      titlefront: '企业名称'
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.tabelData.parColumns.push(value);
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    getcompany(value) {
      this.searchParams.companyName = value[0];
    },
    search() {
      this.tabelData.current = 1;
      this.getList();
    },
    reset() {
      this.searchParams = {};
      this.tabelData.current = 1;
      this.tabelData.pageSize = 10;
      this.$refs.muselect.clearValue();
      this.getList();
    },
    changePage(val) {
      this.tabelData.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.tabelData.pageSize = val;
      this.getList();
    },
    getList() {
      let data = Object.assign(
        {},
        {
          currPage: this.tabelData.current,
          pageSize: this.tabelData.pageSize
        },
        this.searchParams
      );
      walletList(data)
        .then(res => {
          this.tabelData.total = res.data.data.totalCount;
          this.tabelData.tableDataCom = res.data.data.list;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch(err => {
          this.tabelData.total = 0;
          this.tabelData.tableDataCom = [];
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    confirm() {
      freezeWallet(this.companyId)
        .then(res => {
          this.$Message.success(res.data.msg);
          this.getList()
          this.freezOptaion = false;
        })
        .catch(err => {
          this.$Message.error("冻结失败");
          this.freezOptaion = false;
        });
    },
    cancel() {
      this.freezOptaion = false;
    },
    torechargeRecord() {
      let id = this.searchParams.companyId
      if (id) {
        this.$router.push({
          path: `/corporateWallet/walletRecharge/${id}`
        });
      } else {
        this.$Message.warning('没有查到企业ID')
      }
    }
  }
};
</script>
<style lang="less">
.outerlist {
  display: flex;
  align-items: center;
}
.searchlist {
  display: inline-block;
  margin-right: 20px;
}
.rechargecord {
  display: flex;
  align-items: center;
}
</style>
