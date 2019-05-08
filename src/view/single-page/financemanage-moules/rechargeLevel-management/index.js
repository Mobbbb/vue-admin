import { editRechargeLeve } from '@/api/finance'

const statusMap = {
    0: '停用',
    1: '启用'
}

export const returnColumns = (that) => {
	return [
        {
            title: '档位',
            key: 'money',
            minWidth: 100,
            tooltip: true,
        },
        {
            title: '状态',
            key: 'status',
            minWidth: 120,
            tooltip: true,
            render: (h, params) => {
                return h('div', statusMap[params.row.status])
            }
        },
        {
            title:'操作',
            key:'action',
            minWidth: 140,
            render: (h, params) => {
                let text = '开启'
                if(params.row.status === 1) text = '关闭'
                return h('div', [
                	h('Button', {
			            props: {
			              type: params.row.status === 1 ? 'warning' : 'success',
			              ghost: true,
			              size: "small"
			            },
                        directives: [{
                            name: 'hasAuth',
                            value: 'rechargeLevel-management-update'
                        }],
			            on: {
			                click: () => {
                                let data = { 
                                    status: !params.row.status, 
                                    uuid: params.row.uuid 
                                }
			                    editRechargeLeve(data).then(res => {
                                    that.$Message.success('更改成功')
                                    that.getTableList()
                                })
			                }
			            }
			        }, text)
			    ])
            }
        }
    ]
}

export const inputList = [
	{
        name: 'text-input', 
        bind_key: 'vin',
        placeholder: '请输入车牌VIN码',
        value: '',
        title: '车牌VIN码：',
        titleWidth: 80,
        inputWidth: 220, // input框的宽度
        key: '6',
        isHide: false
    },
    {
        name: 'text-input', 
        bind_key: 'num',
        placeholder: '请输入车牌号',
        value: '',
        title: '车牌号：',
        titleWidth: 80,
        inputWidth: 220, // input框的宽度
        key: '6',
        isHide: false
    },
    {
        name: 'drop-input', 
        bind_key: 'type',
        placeholder: '请选择车机登录方式',
        dropList: [],
        value: '',
        title: '车机登录方式：',
        titleWidth: 100,
        inputWidth: 220, // input框的宽度
        key: '6',
        isHide: false
    },
    {
        name: 'date-input', 
        placeholder: '请选择更新时间',
        bind_key: ['upTime', 'downTime'],
        value: '',
        title: '更新时间：',
        titleWidth: 80,
        inputWidth: 220, // input框的宽度
        key: '6',
        isHide: false
    },
    {
        name: 'drop-input', 
        bind_key: 'agentUuid',
        placeholder: '请选择运营商',
        dropList: [],
        value: '',
        title: '运营商：',
        titleWidth: 80,
        inputWidth: 220, // input框的宽度
        key: '6',
        isHide: false
    }
]