<template>
  <div>
    <Card :bordered="false">
      <p slot="title">全部账单</p>
      <Form ref="pushForm">
        <Row>
          <Col span="6">
            <FormItem label="公司名称：" style="margin-bottom: 0px">
              <span>{{companyName}}</span>
            </FormItem>
          </Col>
        </Row>
      </Form>
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
    </Card>
    <Modal v-model="imgViewStatus" title="电子票查看" @on-ok="ok" @on-cancel="cancel">
      <p>Content of dialog</p>
      
    </Modal>
  </div>
</template>
<script>
import { pageData, detailTableTitle } from "./fields.js";
import { settlementBill } from "@/api/company-api/company.js";
export default {
  data() {
    return {
      ...pageData,
      companyName: this.$route.query.companyName,
      imgViewStatus: false
    };
  },
  mounted() {
    this.gettableTitle();
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
        companyId: this.$route.params.id
      };
      settlementBill(data)
        .then(res => {
          this.total = res.data.data.totalCount;
          this.tableData = res.data.data.list;
          this.detailData = res.data;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch(err => {
          this.total = 0;
          this.tableData = [];
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    gettableTitle() {
      let data = [];
      /** 发票状态 */
const invoiceStatu = {
    1: '未开票',
    2: '申请中',
    3: '已开票',
    4: '已送出',
}
      let invoiceStatus={
        title: '发票状态',
        key: 'invoiceStatus',
        width: 200,
        render: (h, params) => {
            return h('div', [
                h('span', {
                    style: {
                        color: '#1890FF',
                        cursor: 'pointer',
                        marginLeft: '10px'
                    },
                    on: {
                        click: () => {
                            if (params.row.invoiceStatus == 2) {
                                // b)申请中
                            } else if (params.row.invoiceStatus == 3) {
                                //c)已开票

                            } else if (params.row.invoiceStatus == 4) {
                                //d)已送出

                            }
                        }
                    }
                }, invoiceStatu[params.row.invoiceStatus])
            ])
        }
      };
      let actions = {
        key: "action",
        title: "操作",
        width: 300,
        fixed: "right",
        align: "center",
        render: (h, params) => {
          return h("div", [
            h(
              "Button",
              {
                props: {
                  type: "success",
                  size: "small"
                },
                attrs: {
                  ghost: "ghost"
                },
                style: {
                  margin: "0 10px",
                  color: "#2db7f5",
                  borderColor: "#2db7f5"
                },
                on: {
                  click: () => {
                    this.$router.push({
                      path: `/companyCenter/financialManage/billCompanyDetail/${
                        params.row.billNo
                      }`
                    });
                  }
                }
              },
              "账单明细"
            )
          ]);
        }
      };
      data = [...detailTableTitle];
      data.push(invoiceStatus);
      data.push(actions);
      this.tableColumns = data;
    },
    ok () {},
    cancel () {},
  }
};
</script>

<style>
</style>


