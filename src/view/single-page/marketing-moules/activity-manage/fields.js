
import { axiosTerminationActivity,axiosOperationRecord } from "@/api/market"; 
// 活动类型
export const  activityTypeMap = {
  1: '注册活动',//
  2: '推荐乘客',//
  3: '充值活动',//
  4: '定向发券',//
  5: '渠道红包',//
  6: '行程分享',//
  7: '口令红包',//
  8: '客服发券',//
  9: '冒泡发券',//
  10: '助力活动'//
}
export const orderMap = {
  '1':'实时',
  '2':'预约'
}
export const businessLineMap = {
  '1':'出租车',
  '2':'专车',
  '4':'快车'
}
export const activityTypeList = []
Object.keys(activityTypeMap).forEach(key=>{
  activityTypeList.push({
    value:key,
    label:activityTypeMap[key]
  })
})

// 活动状态
let statusMap = {
  1: '未开始',
  2: '启用中',
  3: '已结束',
  4: '已终止'
}
let statusList = []
Object.keys(statusMap).forEach(key=>{
  statusList.push({
    value:key,
    label:statusMap[key]
  })
})
// tableb表头信息
export const returnFields = (that) => {
  return {
    index: {
      title: '序号',
      type: 'index',
      width: 60,
      align: 'center'
    },
    activityName: {
      title: '活动名称',
      key: 'activityName',
      ellipsis: true,
      tooltip: true,
      minWidth: 130
    },
    activityCode: {
      title: '活动编码',
      key: 'activityCode',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    activityType: {
      title: '活动类型',
      key: 'activityType',
      ellipsis: true,
      tooltip: true,
      minWidth: 80,
      render: (h, params) => {
        return h('div', activityTypeMap[params.row.activityType])
      }
    },
    cityName: {
      title: '城市',
      key: 'cityName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    effectiveTime: {
      title: '有效时间',
      key: 'effectiveTime',
      ellipsis: true,
      tooltip: true,
      minWidth: 230
    },
    activityStatus: {
      title: '活动状态',
      key: 'activityStatus',
      ellipsis: true,
      tooltip: true,
      minWidth: 70,
      render: (h, params) => {
        switch (Number(params.row.activityStatus)) {
          case 1:
            return h('div', '未开始')
          case 2:
            return h('div', '启用中')
          case 3:
            return h('div', '已结束')
          case 4:
            return h('div', '已终止')
          default:
            return false
        }
      }
    },
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 270,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: "info",
              ghost: true,
              size: "small"
            },
            'class': {
              tableBtn: true
            },
            // directives: [{
            //   name: 'hasAuth',
            //   value: 'price-control-edit'
            // }],
            on: {
              click: () => {
                that.$router.push('/marketing/activity-detail/'+params.row.activityUuid)
              }
            }
          }, '详情'),
          h('Button', {
            props: {
              type: "warning",
              ghost: true,
              size: "small"
            },
            'class': {
              tableBtn: true
            },
            style: {
              display: params.row.activityStatus<3? 'inline-block' : 'none'
            },
            // directives: [{
            //   name: 'hasAuth',
            //   value: 'price-control-edit'
            // }],
            on: {
              click: () => {
                that.$router.push('/marketing/new-activity/'+params.row.activityUuid)
              }
            }
          }, '修改'),
          h('Button', {
            props: {
              type: "error",
              ghost: true,
              size: "small"
            },
            'class': {
              tableBtn: true
            },
            style: {
              display: params.row.activityStatus<3? 'inline-block' : 'none'
            },
            // directives: [{
            //   name: 'hasAuth',
            //   value: 'price-control-edit'
            // }],
            on: {
              click: () => {
                that.$Modal.confirm({
                  title: '确认终止此活动？',
                  onOk: () => {
                    axiosTerminationActivity({activityUUid:params.row.activityUuid}).then(res=>{
                      if (res.data.success) {
                        that.$Message.success(res.data.msg);
                        that.getList(that.searchData);
                      } else {
                        that.$Message.error(res.data.msg);
                      }
                    })
                  }
                });
              }
            }
          }, '终止')
          // h('Button', {
          //   props: {
          //     type: "success",
          //     ghost: true,
          //     size: "small"
          //   },
          //   // directives: [{
          //   //   name: 'hasAuth',
          //   //   value: 'price-control-edit'
          //   // }],
          //   on: {
          //     click: () => {
          //       let param = {
          //         activityUUid: params.row.activityUuid,
          //         pageSize:1,
          //         currPage:1
          //       }
          //       // api未好
          //       // axiosOperationRecord(param).then(res=>{
          //       //   if (res.data.success) {
          //       //     let resdata = res.data.data
          //       //     that.recordData = (resdata && resdata.list) || [];
          //       //     that.recordPageObj.total = resdata && resdata.totalCount;
          //       //   } else {
          //       //     that.$Message.error(res.data.msg);
          //       //   }
          //       // })
          //       that.isRecordModal = true
          //       that.recordData = []
          //     }
          //   }
          // }, '操作记录')
        ])
      }
    }
  }
}


// 搜索列表
let inputList = [
  {
    name: "text-input",
    bind_key: "activityName",
    placeholder: "请输入活动名称",
    value: "",
    title: "活动名称：",
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "text-input",
    bind_key: "activityCode",
    placeholder: "请输入活动编码",
    value: "",
    title: "活动编码：",
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "activityType", // 返回数据的key名
    placeholder: "请选择活动类型",
    value: "", // 用于数据绑定
    title: "活动类型：", // 展示的字段名
    dropList: activityTypeList,
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 120, // input框的宽度
    key: "1", // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ['provinceId','cityId'], // 返回数据的key名
    placeholder: "请选择城市",
    value: [], // 用于数据绑定
    title: "城市：", // 展示的字段名
    cascaderList: [],
    titleWidth: 45, // 展示的字段名的宽度
    inputWidth: 150, // input框的宽度
    key: "1", // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "activityStatus", // 返回数据的key名
    placeholder: "请选择活动状态",
    value: "", // 用于数据绑定
    title: "活动状态：", // 展示的字段名
    dropList: statusList,
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 120, // input框的宽度
    key: "1", // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: "text-input",
    bind_key: "templateCode",
    placeholder: "请输入券模板编码",
    value: "",
    title: "券模板编码：",
    titleWidth: 80,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "date-time-input", // 文本输入框名
    bind_key: ['beginTime','endTime'], // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "有效时间：", // 展示的字段名
    titleWidth: 60, // 展示的字段名的宽度
    inputWidth: 300, // input框的宽度
    options: {},
    key: "6", // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  }
]

let searchData = {
  isInclude: false//search-list,时间是否为包含关系
}
let pageObj = {
  total: 0,
  current: 1,
  pageSize: 10
}
let recordColumns = [
  {
    title: '序号',
    type: 'index',
    width: 60,
    align: 'center'
  },
  {
    title:'操作人',
    key:'operator'
  },
  {
    title:'操作类型',
    key:'type'
  },
  {
    title:'修改项',
    key:'modify',
    width:140
  },
  {
    title:'修改前值',
    key:'before'
  },
  {
    title:'修改后值',
    key:'after'
  },
  {
    title:'操作时间',
    key:'modifyTime'
  }
]
export const cacheData = {
  pageObj,
  searchData,
  inputList,
  recordColumns,
  parColumns:[],
  tableData:[]
}