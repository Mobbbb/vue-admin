// 系统策略表格控制
let statusMap = {
  1: '出租车',
  2: '专车',
  4: '快车',
  5: '全部'
}
export const returnFields = (that, name) => {
  const getorderpricve = () => {
    // 订单
    return {
      csmNum: {
        title: '序号',
        key: 'csmNum',
        tooltip: true,
        width: 100,
        render: (h, params) => {
          let titles = params.index + 1
          return h('div', titles)
        }
      },
      strategyName: {
        title: '策略名',
        key: 'strategyName',
        tooltip: true,
        minWidth: 160
      },
      strategyType: {
        title: '策略类型',
        key: 'strategyType',
        tooltip: true,
        minWidth: 160,
        render: (h, params) => {
          let titles = '乘客有条件免费取消次数定义'
          return h('div', titles)
        }
      },
      city: {
        title: '适用城市',
        key: 'city',
        tooltip: true,
        minWidth: 160
      },
      status: {
        title: '状态',
        key: 'status',
        minWidth: 160,
        tooltip: true,
        render: (h, params) => {
          let titles = params.row.status === 1 ? '使用中' : '已停用'
          return h('div', titles)
        }
      },
      action: {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 150,
        render: (h, params) => {
          let is_del = params.row.status
          let titlesfont = is_del === 1 ? '停用' : '启用'
          return h('div', [
            h('Button', {
              'class': {
                tableBtn: true
              },
              props: {
                type: "warning",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: 'hasAuth',
                value: 'strategy_control-editOrder'
              }],
              on: {
                click: () => {
                  let idx = params.index
                  let tableData = JSON.parse(JSON.stringify(that.orderpricvedata.rootTabelData))
                  that.editIndex = idx
                  that.editStatus = true
                  that.csmModalData = tableData[idx]
                  that.modaltitle = '编辑策略'
                  that.type = 'edit'
                  that.newMobel = true
                  that.$refs.csmForm.resetFields();
                }
              }
            }, '编辑'),
            h('Button', {
              props: {
                type: is_del === 1 ? 'error' : "info",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: 'hasAuth',
                value: 'strategy_control-updateOrder'
              }],
              on: {
                click: () => {
                  let idx = params.index
                  that.deleteIndex = idx
                  that.deleteflag = 'orderpricflag'
                  if (is_del == 1) {
                    that.deleteModel = true
                  } else {
                    that.restartModel = true
                  }
                }
              }
            }, titlesfont)
          ])
        }
      }
    }
  }
  const getcallpolice = () => {
    // 偏离警告
    return {
      csmNum: {
        title: '序号',
        key: 'csmNum',
        ellipsis: true,
        tooltip: true,
        minWidth: 100,
        render: (h, params) => {
          return h('div', params.index + 1)
        }
      },
      name: {
        title: '名称',
        key: 'name',
        ellipsis: true,
        tooltip: true,
        minWidth: 120
      },
      serviceType: {
        title: '业务类型',
        key: 'serviceType',
        ellipsis: true,
        tooltip: true,
        minWidth: 120,
        render: (h, params) => {
          return h('div', statusMap[params.row.serviceType] || '暂无')
        }
      },
      divergeTime: {
        title: '偏离时限',
        key: 'divergeTime',
        ellipsis: true,
        tooltip: true,
        minWidth: 100
      },
      divergeNum: {
        title: '偏离次数',
        key: 'divergeNum',
        ellipsis: true,
        tooltip: true,
        minWidth: 100
      },
      divergePercent: {
        title: '偏离里程占比',
        key: 'divergePercent',
        ellipsis: true,
        tooltip: true,
        minWidth: 120,
      },
      cityName: {
        title: '城市',
        key: 'cityName',
        ellipsis: true,
        tooltip: true,
        minWidth:100
        // render: (h, params) => {
        //   let citydata = JSON.parse(JSON.stringify(that.citysdata))
        //   let cityCodes = params.row.cityCode
        //   let titles = ''
        //   citydata.forEach(item => {
        //     item.nodes&&item.nodes.length && item.nodes.forEach(element => {
        //       if (element.cityID == cityCodes) {
        //         titles = element.province + element.city || '暂无'
        //       }
        //     })
        //   })
        //   return h('div', titles)
        // }
      },
      creator: {
        title: '创建人',
        key: 'creator',
        ellipsis: true,
        tooltip: true,
        minWidth: 120
      },
      action: {
        title: '操作',
        key: 'action',
        minWidth: 140,
        fixed: 'right',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              'class': {
                tableBtn: true
              },
              props: {
                type: "warning",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: 'hasAuth',
                value: 'strategy_control-editAlarm'
              }],
              on: {
                click: () => {
                  that.callpolicedata = params.row
                  that.callpolicedata.divergePercent = Number(params.row.divergePercent)
                  that.cityCodeArray = (params.row.cityCode && params.row.cityCode.split(',')) || []
                  that.callpolicedata.uuid = params.row.uuid
                  that.callpolicetitle = '编辑策略'
                  that.policedisabled = false
                  that.callpolicemodal = true
                  that.isAdd = false
                }
              }
            }, '编辑'),
            h('Button', {
              props: {
                type: "success",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: 'hasAuth',
                value: 'strategy_control-alarmDetail'
              }],
              on: {
                click: () => {
                  that.callpolicedata = params.row
                  that.callpolicedata.divergePercent = Number(params.row.divergePercent)
                  that.callpolicetitle = '查看策略'
                  that.policedisabled = true
                  that.callpolicemodal = true
                  that.isAdd = false
                }
              }
            }, '详情')
          ])
        }
      }
    }
  }
  switch (name) {
    case 'orderpricve':
     return getorderpricve();
    case 'checkon': return getcheckon();
    case 'callpolice': return getcallpolice();
    default: return getorderpricve();
  }
}

export const inputList = [
  {
    name: 'cascader-input', // 文本输入框名
    bind_key: ['provinceId', 'cityCode'], // 返回数据的key名
    placeholder: '请选择省/市',
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: '城市：', // 展示的字段名
    titleWidth: 40, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '666', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false, // false: 不隐藏 / true: 隐藏
    changeOnSelect: true
  },
  {
    name: 'drop-input',
    bind_key: 'serviceType',
    placeholder: '请选择业务类型',
    value: '',
    titleWidth: 70,
    dropList: [
      {
        value: 5,
        label: '全部'
      },
      {
        value: 1,
        label: '出租车'
      },
      {
        value: 2,
        label: '专车'
      },
      {
        value: 4,
        label: '快车'
      }
    ],
    title: '业务类型：',
    inputWidth: 200,
    unicode: '2',
    isHide: false
  }
]