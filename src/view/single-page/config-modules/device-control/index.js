import { timeFormat } from "@/libs/util";
export const receiveDeviceMap = {
  0: '车机',
  1: '手机'
}

export const deviceStatusMap = {
  0: '未生效',
  1: '已生效',
  2: '失效',
}

export const inputList = [
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'carVin', // 返回数据的key名
    placeholder: '请输入车辆VIN码',
    value: '', // 用于数据绑定
    title: '车辆VIN码：', // 展示的字段名
    titleWidth: 75, // 展示的字段名的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    inputWidth:200,
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'plateNumber', // 返回数据的key名
    placeholder: '请输入车牌号',
    value: '', // 用于数据绑定
    title: '车牌号：', // 展示的字段名
    titleWidth: 50, // 展示的字段名的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    inputWidth:200,
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'drop-input', // 文本输入框名
    bind_key: 'receiveDevice', // 返回数据的key名
    dropList: [
      {
        label: '车机',
        value: 0
      },
      {
        label: '手机',
        value: 1
      }
    ],
    placeholder: '请选择接单设备',
    value: '', // 用于数据绑定
    title: '接单设备：', // 展示的字段名
    titleWidth: 75, // 展示的字段名的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    inputWidth:200,
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'date-time-input',
    bind_key: ['operateStart' ,'operateEnd'],
    placeholder: '请选择更新时间',
    value: '',
    title: '更新时间：',
    titleWidth: 75,
    inputWidth:200,
    unicode: '4',
    isHide: false
  },
  {
    name: 'cascader-input', // 文本输入框名
    bind_key: ['provinId', 'cityId' ,'agentUuid'], // 返回数据的key名
    placeholder: '请选择',
    cascaderList: [],
    value: [], // 用于数据绑定
    title: '运营商：', // 展示的字段名
    titleWidth: 50, // 展示的字段名的宽度
    key: '5', // 该文本框的唯一标识，用于匹配该文本框是否展示
    inputWidth:200,
    isHide: false, // false: 不隐藏 / true: 隐藏
    changeOnSelect: false
  },
]

export const Columns = (that) => {
  return {
    vin: {
      title: '车辆VIN码',
      key: 'carVin',
      tooltip: true,
      minWidth: 150,
      fixed: 'left'
    },
    carNum: {
      title: '车牌号',
      key: 'plateNumber',
      minWidth: 150,
      tooltip: true
    },
    agentName: {
      title: '所属运营商',
      key: 'agentName',
      minWidth: 150,
      tooltip: true
    },
    /*deviceType: {
      title: '设备类型',
      key: 'deviceType',
      ellipsis: true,
      render: (h,params) =>{
        return h('div',[
          h('span',{
            style: {
              display: params.row.setType == 1 ? 'inline-block': 'none'
            }
          },'指定车辆'),
          h('span',{
            style: {
              display: params.row.setType == 2 ? 'inline-block': 'none'
            }
          },'批量')
        ])
      }
    },*/
    receiveDevice: {
      title: '接单设备',
      key: 'receiveDevice',
      tooltip: true,
      minWidth: 150,
      render: (h,params) =>{
        let text = '';
        if (params.row.receiveDevice === 0 ) {
          text = '车机'
        } else  if (params.row.receiveDevice === 1 ) {
          text = '手机'
        }
        return  h('span',text)
          //return h('div',[
          // h('span',{
          //   style: {
          //     display: params.row.receiveDevice === 0 ? 'inline-block': 'none'
          //   }
          // },'车机'),
          // h('span',{
          //   style: {
          //     display: params.row.receiveDevice === 1 ? 'inline-block': 'none'
          //   }
          // },'手机')
        // ])
      }
    },
    /*oldReceiveDevice: {
      title: '原接单设备',
      key: 'oldReceiveDevice',
      ellipsis: true,
      render: (h,params) =>{
        return h('div',[
           h('span',{
             style: {
               display: params.row.oldReceiveDevice == 0 ? 'inline-block': 'none'
             }
           },'车机屏'),
           h('span',{
             style: {
               display: params.row.oldReceiveDevice == 1 ? 'inline-block': 'none'
             }
           },'司机APP')
         ])
       }
    },*/
    deviceChange: {
      title: '生效时间',
      key: 'effectStart',
      minWidth: 150,
      tooltip: true
    },
    deviceEnd: {
      title: '失效时间',
      key: 'effectEnd',
      minWidth: 150,
      tooltip: true
    },
    updatedOn: {
      title: '更新时间',
      key: 'updateTime',
      minWidth: 150,
      tooltip: true
    },
    action: {
      title:'操作',
      key:'action',
      width: 200,
      fixed: 'right',
      render: (h, params) => {
        let colorEnd;
        let colorEdit;
        let text = ''
        params.row.deviceStatus === '1' ? colorEnd = '#EF5B5E': colorEnd = '#ddd'
        params.row.deviceStatus === '3' ? colorEdit = '#609EF3': colorEdit = '#ddd'
        if(!params.row.receiveDevice){
          text = '切换为手机接单'
        } else {
          text = '切换为车机接单'
        }
        return h('div', [
          h('Button', {
            style:{
              display: that.$utils.pkAccess('config_equip_info') ? 'inline-block' :'none',
              marginRight: '15px'
            },
            props:{
              type: 'info',
              size: 'small',
              ghost: true
            },
            on: {
              click: () => {
                that.$router.push({
                  name: 'device_control_detail',
                  query: {
                    carVin: params.row.carVin
                  }
                })
              }
            }
          }, '详情'),
          h('Button', {
            props:{
              type: 'warning',
              size: 'small',
              ghost: true
            },
            on: {
              click: () => {
                that.popSwitch = true
                that.switchInfo = params.row
              }
            }
          }, text)
        ]);
      }
    }
  }
}

export const detailColumns = (that) => {
  return [
    {
      key: 'updateTime',
      minWidth: 120,
      title: '更新时间',
      tooltip: true
    },
    {
      key: 'oldReceiveDevice',
      minWidth: 100,
      title: '原接单设备',
      tooltip: true,
      render: (h, params) => {
        return h('span', receiveDeviceMap[params.row.oldReceiveDevice])
      }
    },
    {
      key: 'receiveDevice',
      minWidth: 120,
      title: '目标接单设备',
      tooltip: true,
      render: (h, params) => {
        return h('span', receiveDeviceMap[params.row.receiveDevice])
      }
    },
    {
      key: 'effectStart',
      minWidth: 170,
      title: '生效时间',
      tooltip: true
    },
    {
      key: 'effectEnd',
      minWidth: 170,
      title: '失效时间',
      tooltip: true
    },
    {
      key: 'deviceStatus',
      minWidth: 100,
      title: '状态'
    },
    {
      key: 'remark',
      minWidth: 100,
      title: '备注',
      tooltip: true
    }
  ]
}

export const dataDevice = [
  {
    deviceType: '批量',
    deviceName: '车机屏',
    deviceStart: '2017-12-21 09:00',
    deviceEnd: '2018-12-23 09:00',
    deviceStatus: '1',
    deviceChange: '2017-12-21 09:00',
  },
  {
    deviceType: '指定车辆',
    deviceName: '司机APP',
    deviceStart: '2017-12-21 09:10',
    deviceEnd: '2019-06-09 09:00',
    deviceStatus: '1',
    deviceChange: '2017-12-21 09:00',
  },
  {
    deviceType: '指定车辆',
    deviceName: '车机屏',
    deviceStart: '2020-03-03 09:50',
    deviceEnd: '2025-02-28 18:50',
    deviceStatus: '3',
    deviceChange: '2018-10-01 09:00',
  },
  {
    deviceType: '批量',
    deviceName: '司机APP',
    deviceStart: '2016-10-23 13:23',
    deviceEnd: '2017-4-23 09:23',
    deviceStatus: '2',
    deviceChange: '2017-4-23 09:23',
  },
  {
    deviceType: '批量',
    deviceName: '司机APP',
    deviceStart: '2016-10-03 12:12',
    deviceEnd: '2016-10-23 13:23',
    deviceStatus: '2',
    deviceChange: '2016-10-23 13:23',
  }

]

export  const deviceSet=[
  {
    deviceVin: '',
    device: '',
    deviceStart: '',
    deviceEnd: '',
    deviceRemark: '',
  },
  {
    deviceCity: '',
    deviceOperator: '',
    device: '',
    deviceStart: '',
    deviceEnd: '',
    deviceRemark: '',
  }
]
