export const sendMap = {
  0: '乘客',
  1: '司机',
  2: '车机',
  3: '运营商'
}
export const driverMap = { // 发送范围
  2: '指定乘客',
  3: '指定司机',
  4: '指定运营商',
  5: '乘客批量',
  7: '司机批量',
  10: '用户群组'
}
export const taskStatusMap =  {
  0: '待审核',
  1: '待发送',
  2: '审核失败',
  3: '发送中',
  4: '已发送'
}

export const columns = [
  {
    title: '序号',
    key: 'index',
    tooltip: true,
    minWidth: 70,
    slot: 'index',
    fixed: 'feft'
  },
  {
    title: '任务名称',
    key: 'taskName',
    minWidth: 150,
    tooltip: true
  },
  {
    title: '发送对象',
    key: 'sendName',
    minWidth: 150,
    tooltip: true,
    render:(h, params) => {
      return h('span', {
        domProps: {
          textContent: sendMap[params.row.sendName]
        }
      })
    }
  },
  {
    title: '发送内容',
    key: 'content',
    minWidth: 150,
    tooltip: true
  },
  {
    title: '发送范围',
    key: 'driver',
    minWidth: 150,
    tooltip: true,
    render:(h, params) => {
      let text = driverMap[params.row.driver]
      if (!driverMap.hasOwnProperty(params.row.driver)) {
        text = params.row.driver
      }
      return h('span', text)
    }
  },
  {
    title: '发送时间',
    key: 'sendTime',
    minWidth: 150,
    tooltip: true
  },
  {
    title: '对象数量',
    key: 'targetNum',
    minWidth: 150,
    tooltip: true
  },
  {
    title: '状态',
    key: 'taskStatus',
    minWidth: 150,
    tooltip: true,
    render: (h, params) => {
      return h('span', taskStatusMap[params.row.taskStatus])
    }
  },
  {
    key: "action",
    title: "详情",
    minWidth: 100,
    slot: 'action'
  }
]

export const inputList = [
  {
    name: 'text-input',
    bind_key: 'taskName',
    placeholder: '请输入名称',
    value: '',
    titleWidth: 70,
    title: '任务名称 :',
    inputWidth: 200,
  },
  {
    name: 'drop-input',
    bind_key: 'sendName',
    placeholder: '请选择',
    value: '',
    dropList: [
      {
        value: 0,
        label: '乘客'
      },
      {
        value: 1,
        label: '司机'
      }
    ],
    title: '发送对象 :',
    inputWidth: 200,
    titleWidth: 70,
  },
  {
    name: 'date-input',
    bind_key: ['startTime', 'endTime'],
    placeholder: '请选择',
    value: '',
    titleWidth: 70,
    title: '发送日期 :',
    inputWidth: 200,
  },
  {
    name: 'drop-input',
    bind_key: 'taskStatus',
    placeholder: '请选择',
    value: '',
    dropList: [
      {
        value: 0,
        label: '待审核'
      },
      {
        value: 1,
        label: '待发送'
      },
      {
        value: 2,
        label: '审核失败'
      },
      {
        value: 3,
        label: '发送中'
      },
      {
        value: 4,
        label: '已发送'
      }
    ],
    title: '状态 :',
    inputWidth: 200,
    titleWidth: 70,
  },
]