// 任务类型
let taskList = [{
  value: 1,
  label: '发送短信'
}]
// 状态
let statusMap = {
  0: '待审核',
  1: '已通过',
  2: '已驳回'
}
let statusList = []
Object.keys(statusMap).forEach(key=>{
  statusList.push({
    value: key,
    label: statusMap[key]
  })
})
// 发送对象
export const sendMap = {
  0: '乘客',
  1: '司机',
  2: '车机',
  3: '运营商',
}
// 发送范围
export const driverMap = {
  2: '指定乘客',
  3: '指定司机',
  4: '指定运营商',
  5: '乘客批量',
  7: '司机批量',
  10: '用户分群',
}
// table配置
export const returnFields = (that) => {
  return {
    taskName: {
      title: '任务名称',
      key: 'taskName',
      ellipsis: true,
      tooltip: true,
      minWidth: 200
    },
    type: {
      title: '任务类型',
      key: 'type',
      ellipsis: true,
      tooltip: true,
      minWidth: 160,
      render: (h, params) => {
        let val = params.row.type === 1?'短信任务':''
        return h('div', val)
      }
    },
    taskDetail: {
      title: '任务详情',
      key: 'taskDetail',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: "text",
              ghost: true,
              size: "small"
            },
            style:{
              color: '#2d8cf0',
              textDecoration: 'underline'
            },
            on: {
              click: () => {
                let data = {
                  uuid:params.row.uuid,
                  type:params.row.type,
                }
                that.getDetailInfo(data)
              }
            }
          }, '查看详情')
        ])
      }
    }, 
    createTime: {
      title: '提交时间',
      key: 'createTime',
      ellipsis: true,
      tooltip: true,
      minWidth: 160
    },
    approver: {
      title: '审批人',
      key: 'approver',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    status: {
      title: '状态',
      key: 'status',
      ellipsis: true,
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        return h('div', statusMap[params.row.status])
      }
    },
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: 'success',
              ghost: true,
              size: "small"
            },
            class: {
              tableBtn: true
            },
            style: {
              display: (params.row.status === 0 && params.row.expiryStatus === 0) ? 'inline-block' : 'none'
            },
            // directives: [{
            //   name: 'hasAuth',
            //   value: 'charge-city-control-switch'
            // }],
            on: {
              click: () => {
                that.$Modal.confirm({
                  title: '确认此任务审批通过？',
                  onOk: () => {
                    let data = {
                      uuid: params.row.uuid,
                      status: 1
                    }
                    that.approvalSwitch(data)
                  }
                })
              }
            }
          }, '审批通过'),
          h('Button', {
            props: {
              type: 'error',
              ghost: true,
              size: "small"
            },
            style: {
              display: (params.row.status === 0 && params.row.expiryStatus === 0) ? 'inline-block' : 'none'
            },
            // directives: [{
            //   name: 'hasAuth',
            //   value: 'charge-city-control-switch'
            // }],
            on: {
              click: () => {
                that.$Modal.confirm({
                  title: '确认此任务审批不通过？',
                  onOk: () => {
                    let data = {
                      uuid: params.row.uuid,
                      status: 2
                    }
                    that.approvalSwitch(data)
                  }
                })
              }
            }
          }, '审批不通过')
        ])
      }
    }
  }
}
export const inputList = [
  {
    name: "text-input",
    bind_key: "taskName",
    placeholder: "请输入名称",
    value: "",
    title: "任务名称：",
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "drop-input",
    bind_key: "type",
    placeholder: "请选择",
    dropList: taskList,
    value: "",
    title: "任务类型：",
    titleWidth: 60,
    inputWidth: 120, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "date-input", // 文本输入框名
    bind_key: "date", // 返回数据的key名
    placeholder: "请选择日期",
    value: "", // 用于数据绑定
    title: "提交时间：", // 展示的字段名
    titleWidth: 60, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    options: {},
    key: "6", // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: "drop-input",
    bind_key: "status",
    placeholder: "请选择",
    dropList: statusList,
    value: "",
    title: "状态：",
    titleWidth: 40,
    inputWidth: 120, // input框的宽度
    key: "6",
    isHide: false
  }
]
export const searchData = {}
export const pageObj = {
  total: 0,
  current: 1,
  pageSize: 10
}