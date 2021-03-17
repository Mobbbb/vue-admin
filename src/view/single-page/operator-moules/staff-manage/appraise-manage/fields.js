import router from '@/router';
let scoreMap = {
  1: '正面',
  2: '中性',
  3: '负面'
}
let tagMap = {
  1: 'success',
  2: 'primary',
  3: 'error'
}
export const tableTitle = [
  {
    title: '订单编号',
    key: 'routeNo',
    tooltip: true,
    minWidth: 120,
    fixed: 'left',
    render(h, params) {
      return h('a', {
        domProps: {
          textContent: params.row.routeNo
        },
        on: {
          click() {
            router.push({
              path: '/order/order-detail/' + params.row.routePlanUuid
            })
          }
        }
      })
    }
  },
  {
    title: '所属城市',
    key: 'cityName',
    tooltip: true,
    width: 120
  },
  {
    title: '所属运营商',
    key: 'agentName',
    tooltip: true,
    width: 120
  },
  {
    title: '司机姓名',
    key: 'name',
    tooltip: true,
    width: 120
  },
  {
    title: '司机手机号',
    key: 'mobile',
    tooltip: true,
    width: 120
  },
  {
    title: '评价属性',
    key: 'score',
    tooltip: true,
    width: 120,
    render(h, params) {
      return h('span', {
        domProps: {
          textContent: scoreMap[params.row.score]
        }
      })
    },
  },
  // {
  //   title: '关联订单',
  //   key: 'routePlanUuid',
  //   tooltip: true,
  //   width: 270
  // },
  {
    title: '评价时间',
    key: 'createTime',
    tooltip: true,
    minWidth: 160
  },
  {
    title: '下单人姓名',
    key: 'passengerName',
    tooltip: true,
    minWidth: 120
  },
  {
    title: '下单人手机号',
    key: 'passengerMobile',
    tooltip: true,
    minWidth: 100
  },
  {
    title: '评价标签',
    key: 'evaluateTag',
    tooltip: true,
    minWidth: 180,
    render: (h,params)=>{
      let items = params.row.evaluateTag.split(',');
      let btns = [];
      Array.isArray(items)&&items.map((item, index) => {
        btns.push(
          h(
            "Tag",
            {
              props: {
                color: tagMap[params.row.score]
              }
            },
            item
          )
        );
      });
      return h("div", btns);
    }
  }
]
export const pageData = {
  createdOn:'',
  allTagList: [],
  isLoading: false,
  isShowMore:false,
  isShowMain: true,
  searchData: {},
  queryAjaxPramas: {},
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  tableData: [],
  // tableColumnsChecked: Object.keys(tableTitle)
}