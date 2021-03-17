export const sexMap = {
    2: '未知',
    1: '男',
    0: '女'
}

export const checkBoxMap = {
    cityCheck: 'cityConfig',        // 城市勾选状态
    sexCheck: 'sexConfig',          // 性别勾选状态
    ageCheck: 'ageConfig',          // 年龄勾选状态
    orderCheck: 'orderDateRange',   // 订单勾选状态
    timeCheck: 'timeConfig',        // 注册时间勾选状态
    bubbleCheck: 'bubbleConfig'
}

export const insideCheckBoxMap = {
    orderNumCheck: 'orderNumConfig',        // 完单数量勾选状态
    orderTimeRangeCheck: 'orderTimeRange',  // 下单时段勾选状态
}

export const timeTypeMap = {
    1: '最近',
    2: '固定时间范围'
}

export const conditionType = {
    1: '导入类',
    2: '条件类'
}

export const statusMap = {
    1: '启用中',
    2: '已停用'
}

export const cityTypeMap = {
    1: '注册城市',
    2: '下单城市',
    3: '冒泡城市'
}

export const columns = [
	{
        title: '用户群名称',
        key: 'userGroupName',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '用户群编码',
        key: 'userGroupCode',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '用户群类型',
        key: 'userGroupType',
        tooltip: true,
        minWidth: 100,
        render: (h, params) => {
            return h('span', conditionType[params.row.userGroupType])
        }
    },
    {
        title: '用户群人数',
        key: 'userGroupCount',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '创建人',
        key: 'createName',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '更新时间',
        key: 'updateTime',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '用户群状态',
        key: 'status',
        tooltip: true,
        minWidth: 100,
        render: (h, params) => {
            if (params.row.userGroupCount === null || params.row.userGroupCount === '') {
                return h('span', '计算中')
            } else {
                return h('span', statusMap[params.row.userGroupStatus])
            }
        }
    },
    {
        title: '操作',
        key: 'action',
        tooltip: true,
        width: 220,
        slot: 'action'
    }
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
        key: 'index',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '操作类型',
        key: 'index',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '操作时间',
        key: 'index',
        tooltip: true,
        minWidth: 100
    }
]

export const inputList = [
	{
        name: 'text-input', // 文本输入框名
        bind_key: 'userGroupName', // 返回数据的key名
        placeholder: '请输入名称',
        value: '', // 用于数据绑定
        title: '用户群名称 :', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'userGroupCode', // 返回数据的key名
        placeholder: '请输入编码',
        value: '', // 用于数据绑定
        title: '用户群编码 :', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
    },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'userGroupType', // 返回数据的key名
        placeholder: '请选择',
        value: '', // 用于数据绑定
        dropList: [
        	{
        		value: 1,
        		label: '导入类'
        	},
        	{
        		value: 2,
        		label: '条件类'
        	}
        ],
        title: '用户群类型 :', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
        key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'createName', // 返回数据的key名
        placeholder: '请输入创建人',
        value: '', // 用于数据绑定
        title: '创建人 :', // 展示的字段名
        titleWidth: 60, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
        key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'userGroupStatus', // 返回数据的key名
        placeholder: '请选择',
        value: '', // 用于数据绑定
        dropList: [
            {
                value: 1,
                label: '启用中'
            },
            {
                value: 2,
                label: '已停用'
            }
        ],
        title: '用户群状态 :', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
        key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
        isHide: false // false: 不隐藏 / true: 隐藏
    }
]