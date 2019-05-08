import axios from '@/libs/api.request'

export const getPassengerList = (data) => {
  return axios.request({
    url: '/protocolAgree/queryPage',
    method: 'post',
    data: data
  })
}

export const returnFields = (that) => {
    return {
        total: 0,
        currPage: 1,
        pageSize: 10,
        columns: [
            {
                title: '用户类型',
                key: 'userType',
                width: 90,
                render: (h, params) => {
                    return h('span', '乘客')
                }
            },
            {
                title: '姓名',
                key: 'userName',
                tooltip: true,
                minWidth: 100
            },
            {
                title: '手机号',
                key: 'userPhone',
                tooltip: true,
                minWidth: 100
            },
            {
                title: '设备IMEI',
                key: 'imei',
                tooltip: true,
                minWidth: 100
            },
            {
                title: '协议同意时间',
                key: 'agreeTime',
                tooltip: true,
                minWidth: 120
            },
            {
                title: '协议版本',
                key: 'protocolVersion',
                tooltip: true,
                minWidth: 100
            },
            {
                title: '协议链接',
                key: 'protocolLink',
                tooltip: true,
                minWidth: 100
            }
        ]
    }    
}

export const searchConfig = [
    {
        name: 'text-input',
        bind_key: 'userName',
        placeholder: '请输入姓名',
        value: '',
        titleWidth: 60,
        title: '姓名：',
        inputWidth: 250,
        unicode: '2',
        isHide: false
    },
    {
        name: 'text-input',
        bind_key: 'imei',
        placeholder: '请输入设备IMEI',
        value: '',
        titleWidth: 65,
        title: '设备IMEI：',
        inputWidth: 250,
        unicode: '2',
        isHide: false
    },
    {
        name: 'text-input',
        bind_key: 'userPhone',
        placeholder: '请输入手机号',
        value: '',
        titleWidth: 60,
        title: '手机号：',
        inputWidth: 250,
        unicode: '2',
        isHide: false
    },
    {
        name: 'text-input',
        bind_key: 'protocolVersion',
        placeholder: '请输入协议版本',
        value: '',
        titleWidth: 60,
        title: '协议版本：',
        inputWidth: 250,
        unicode: '2',
        isHide: false
    }
]