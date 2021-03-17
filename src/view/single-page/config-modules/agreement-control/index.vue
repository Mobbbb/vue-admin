<!--app协议管理-->
<template>
  <div class="appidenty">
    <SearchList :inputList="inputList" @on-search='search' @on-reset="reset"></SearchList>
    <Button type="primary" @click="popAddViewStatus = true" v-hasAuth="'agreement_control-add'">新建</Button>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      class="top20">
      <template slot-scope="params" slot="index">
        <span>{{(current - 1)*pageSize + params.data.index + 1}}</span>
      </template>
    </VTable>
    <!-- 弹框 -->
    <Modal
      :mask-closable="false"
      :width="450"
      title="新建协议"
      v-model="popAddViewStatus"
      footer-hide>
      <Add v-model="popAddViewStatus" @on-confirm="confirm"></Add>
    </Modal>
    <Modal v-model="lookMobel" title="查看" :mask-closable="false">
      <div>
        点击地址查看协议内容：
        <span class="protocol-link" @click="tosightweb">
          {{ protocolLink || '' }}
        </span>
      </div>
    </Modal>
  </div>
</template>

<script>
import { returnFields } from "./fields"
import { protocolListdata } from "@/api/configData.js"
import { timeFormat } from "@/libs/util"
import Add from './operation/add'

export default {
  name: "agreementControl",
  components: {
    Add
  },
  data() {
    return {
      inputList: [
        {
          name: 'drop-input',
          bind_key: 'protocolName',
          placeholder: '请选择',
          value: '',
          dropList: [
            {
              value: 1,
              label: "乘客用户协议"
            },
            {
              value: 2,
              label: "司机用户协议"
            }
          ],
          title: '协议类型 :',
          inputWidth: 200,
          titleWidth: 70,
        },
      ],
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      tableColumns: [],
      searchParams: {},
      popAddViewStatus: false,  // 新建弹出框
      lookMobel: false,         // 详情弹出框
      protocolLink: ''
    }
  },
  mounted() {
    this.tableColumns = returnFields(this)
    this.getList()
  },
  methods: {
    search (data) {
      this.searchParams = data
      this.current = 1
      this.getList()
    },
    reset () {
      this.searchParams = {}
      this.current = 1
      this.getList()
    },
    confirm () {
      this.getList()
    },
    changePage (val) {
      this.current = val
      this.getList()
    },
    changePageSize (val) {
      this.pageSize = val
      this.getList()
    },
    getList () {
      let data = {...this.searchParams}
      data.pageSize = this.pageSize
      data.currPage = this.current
      this.$store.commit('changeLoadingFlag', true)
      protocolListdata(data).then(res => {
        let resdata = res.data.data
        this.tableData = resdata && resdata.list || []
        this.total = resdata && resdata.totalCount || 0
        this.$store.commit('changeLoadingFlag', false)
      })
    },
    tosightweb () {
      window.open(this.protocolLink, "_blank")
    }
  }
}
</script>

<style lang="less">
.appidenty {
  .searchlines {
    display: flex;
    align-items: center;
    .btnarea {
      button {
        margin-right: 15px;
      }
    }
  }
}
.protocol-link{
  color: #3399ff;
  cursor: pointer;
  font-size: 13px;
}
</style>
