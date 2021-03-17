export const operationMap = {
	0: '唤醒',
	1: '重启',
	2: ''
}

export const columns = [
	{
        title: '车辆VIN码',
        key: 'name',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '车牌号',
        key: 'name',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '所属运营商',
        key: 'name',
        tooltip: true,
        minWidth: 100
    },
    {
        title: 'TBOX状态',
        key: 'name',
        tooltip: true,
        minWidth: 100
    },
    {
        title: 'AIBOX状态',
        key: 'name',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '操作',
        key: 'action',
        tooltip: true,
        minWidth: 200,
        slot:'action'
    }
]

export const inputList = [
	{
        name: 'text-input', // 文本输入框名
        bind_key: 'vin', // 返回数据的key名
        placeholder: '请输入车辆vin码',
        value: '', // 用于数据绑定
        title: '车辆VIN码 :', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'plateNum', // 返回数据的key名
        placeholder: '请输入车牌号',
        value: '', // 用于数据绑定
        title: '车牌号 :', // 展示的字段名
        titleWidth: 55, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
    }
]