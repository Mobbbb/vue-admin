import { typeTimeMap, couponTypeMap, typeModuleMap } from '@/libs/status-map'

export const statusMap = {
    1: '启用',
    2: '关闭'
}

export const columns = [
	{
	    title: '序号',
	    key: 'index',
	    tooltip: true,
	    minWidth: 100,
	    fixed: 'left',
        slot: 'index'
  	},
	{
	    title: '券模板名称',
	    key: 'templateName',
	    tooltip: true,
	    minWidth: 150,
	    fixed: 'left'
  	},
	{
	    title: '券模板编码',
	    key: 'templateCode',
	    tooltip: true,
	    minWidth: 150,
  	},
	{
	    title: '券类型',
	    key: 'templateType',
	    tooltip: true,
	    minWidth: 150,
        render: (h, params) => {
            return h('span', couponTypeMap[params.row.templateType] || '暂无')
        }
  	},
	{
	    title: '券面额（元）',
	    key: 'couponMoney',
	    tooltip: true,
	    minWidth: 150,
        render: (h, params) => {
            let text = '暂无'
            if (params.row.templateType === 1) { // 折扣券
                text = '最高抵扣' + params.row.highestMoney + '元'
            } 
            if (params.row.templateType === 2) { // 抵扣券
                text = params.row.couponMoney + '元'
            }
            return h('span', text)
        }
  	},
	{
	    title: '用券规则',
	    key: 'rules',
	    tooltip: true,
	    minWidth: 150,
        render: (h, params) => {
            let text = '暂无'
            if (params.row.templateType === 1) { // 折扣券
                text = params.row.discount + '折'
            }
            if (params.row.templateType === 2) { // 抵扣券
                if (params.row.needCondition === 0) { // 不限门槛
                    text = '不限门槛'
                } else { // 限制门槛
                    text = '满' + params.row.conditionMoney + '元可用'
                }
            }
            return h('span', text)
        }
  	},
  	{
	    title: '业务线',
	    key: 'businessTypeList',
	    tooltip: true,
	    minWidth: 160,
        render: (h, params) => {
            let arr = []
            params.row.businessTypeList.forEach(item => {
                arr.push(typeModuleMap[item])
            })
            return h('span', arr.join('、'))
        }
  	},
  	{
	    title: '订单类型',
	    key: 'userLimitList',
	    tooltip: true,
	    minWidth: 150,
        render: (h, params) => {
            let arr = []
            params.row.userLimitList.forEach(item => {
                arr.push(typeTimeMap[item])
            })
            return h('span', arr.join('、'))
        }
  	},
  	{
	    title: '创建人',
	    key: 'creator',
	    tooltip: true,
	    minWidth: 150,
  	},
  	{
	    title: '券模板状态',
	    key: 'status',
	    tooltip: true,
	    minWidth: 150,
        render: (h, params) => {
            return h('span', statusMap[params.row.status])
        }
  	},
  	{
	    title: '操作',
	    key: 'action',
	    tooltip: true,
	    minWidth: 220,
	    slot: 'action',
	    fixed: 'right'
  	},
]

export const historyColumns = [
    {
        title: '序号',
        key: 'index',
        tooltip: true,
        minWidth: 100,
        slot: 'index'
    },
    {
        title: '操作人',
        key: 'xxxx',
        tooltip: true,
        minWidth: 150,
    },
    {
        title: '操作类型',
        key: 'xxxx',
        tooltip: true,
        minWidth: 150,
    },
    {
        title: '操作时间',
        key: 'xxxx',
        tooltip: true,
        minWidth: 150,
    },
]

export const inputList = [
	{
        name: 'text-input', // 文本输入框名
        bind_key: 'templateName', // 返回数据的key名
        placeholder: '请输入券模板名称',
        value: '', // 用于数据绑定
        title: '券模板名称：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'templateCode', // 返回数据的key名
        placeholder: '请输入券模板编码',
        value: '', // 用于数据绑定
        title: '券模板编码：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
    },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'templateType', // 返回数据的key名
        placeholder: '请选择券类型',
        dropList: [
        	{
        		label: '折扣券',
        		value: 1
        	},
        	{
        		label: '抵扣券',
        		value: 2
        	}
        ],
        value: '', // 用于数据绑定
        title: '券类型：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
    },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'businessType', // 返回数据的key名
        placeholder: '请选择业务线',
        dropList: [
        	{
        		label: '快车',
        		value: 4
        	},
        	{
        		label: '专车',
        		value: 2
        	},
        	{
        		label: '出租车',
        		value: 1
        	}
        ],
        value: '', // 用于数据绑定
        title: '业务线：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
    },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'orderType', // 返回数据的key名
        placeholder: '请选择订单类型',
        dropList: [
            {
                label: '实时',
                value: 1
            },
            {
                label: '预约',
                value: 2
            }
        ],
        value: '', // 用于数据绑定
        title: '订单类型：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
    },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'templateStatus', // 返回数据的key名
        placeholder: '请选择券模板状态',
        dropList: [
        	{
        		label: '启用中',
        		value: 1
        	},
        	{
        		label: '已停用',
        		value: 2
        	}
        ],
        value: '', // 用于数据绑定
        title: '券模板状态：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'creator', // 返回数据的key名
        placeholder: '请输入创建人',
        value: '', // 用于数据绑定
        title: '创建人：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
    }
]