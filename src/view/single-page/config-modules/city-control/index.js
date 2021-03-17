import { typeTimeMap2 } from '@/libs/status-map'

export const openStatusMap = {
	0 : '未开通',
	1 : '已开通', 
}

export const statusMap = {
    1: '生效中',
    0: '未开始',
    '-1': '已失效'
} 

export const operationColumns = [
	{
        title: '序号',
        minWidth: 160,
        tooltip: true,
        key: 'xxx',
        slot: 'index'
    },
    {
        title: '策略名称',
        minWidth: 160,
        tooltip: true,
        key: ''
    },
    {
        title: '生效时间',
        minWidth: 160,
        tooltip: true,
        key: 'effectiveTime'
    },
    {
        title: '订单类型',
        minWidth: 160,
        tooltip: true,
        key: 'typeTime',
        render: (h, params) => {
            return h('span', typeTimeMap2[params.row.typeTime] + '订单')
        }
    },
    {
        title: '状态',
        minWidth: 160,
        tooltip: true,
        key: 'status',
        render: (h, params) => {
            return h('span', statusMap[params.row.status])
        }
    },
    {
        title: '操作人',
        minWidth: 160,
        tooltip: true,
        key: 'creator'
    },
    {
        title: '版本号',
        minWidth: 160,
        tooltip: true,
        key: 'version'
    },
    {
        title: '操作',
        minWidth: 160,
        tooltip: true,
        key: 'action',
        slot: 'action'
    }
]

export const inputList = [
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'status', // 返回数据的key名
        placeholder: '请选择状态',
        dropList: [
            {
                value: 1,
                label: '生效中'
            },
            {
                value: 0,
                label: '未开始'
            },
            {
                value: -1,
                label: '已失效'
            }
        ],
        value: '', // 用于数据绑定
        title: '状态 :', // 展示的字段名
        titleWidth: 40, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
    },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'typeTime', // 返回数据的key名
        placeholder: '请选择状态',
        dropList: [
            {
                value: 1,
                label: '即时用车'
            },
            {
                value: 2,
                label: '预约用车'
            }
        ],
        value: '', // 用于数据绑定
        title: '订单类型 :', // 展示的字段名
        titleWidth: 65, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
    }
]

export const badInputList = [
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'status', // 返回数据的key名
        placeholder: '请选择状态',
        dropList: [
            {
                value: 1,
                label: '生效中'
            },
            {
                value: 0,
                label: '未开始'
            },
            {
                value: -1,
                label: '已失效'
            }
        ],
        value: '', // 用于数据绑定
        title: '状态 :', // 展示的字段名
        titleWidth: 40, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
    }
]