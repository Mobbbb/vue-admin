import { updateFaceStatus } from '@/api/configData'

const loginTypeMap = {
    0: '人脸识别',
    1: '账号'
}

export const returnColumns = (that) => {
	return [
        {
            title: '车辆VIN码',
            key: 'vin',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '车牌号',
            key: 'plateNum',
            minWidth: 100,
            tooltip: true,
        },
        {
            title: '所属运营商',
            key: 'agentName',
            minWidth: 100,
            tooltip: true,
        },
        {
            title: '车机登录方式',
            key: 'loginType',
            minWidth: 120,
            tooltip: true,
            render: (h, params) => {
                return h('div', loginTypeMap[params.row.loginType])
            }
        },
        {
            title: '更新时间',
            key: 'updateTime',
            minWidth: 100,
            tooltip: true,
        },
        {
            title:'操作',
            key:'action',
            width: 140,
            fixed: 'right',
            render: (h, params) => {
                let text = '切换至人脸识别'
                if(params.row.loginType === 0) text = '切换至账号登录'
                return h('div', [
                	h('Button', {
			            props: {
			              type: "warning",
			              ghost: true,
			              size: "small"
			            },
                        directives: [{
                            name: 'hasAuth',
                            value: 'face_recognition-switch'
                        }],
			            on: {
			                click: () => {
                                let data = {
                                    uuid: params.row.uuid,
                                    loginType: !params.row.loginType
                                }
			                    updateFaceStatus(data).then(res => {
                                    that.$Message.success('操作成功')
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
        placeholder: '请输入车辆VIN码',
        value: '',
        title: '车辆VIN码：',
        titleWidth: 80,
        inputWidth: 220, // input框的宽度
        key: '6',
        isHide: false
    },
    {
        name: 'text-input', 
        bind_key: 'plateNum',
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
        bind_key: 'loginType',
        placeholder: '请选择车机登录方式',
        dropList: [
            {
                value: 0,
                label: '人脸识别'
            },
            {
                value: 1,
                label: '账号'
            }
        ],
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
        bind_key: ['updateStartTime', 'updateEndTime'],
        value: '',
        title: '更新时间：',
        titleWidth: 80,
        inputWidth: 220, // input框的宽度
        key: '6',
        isHide: false
    },
    {
        name: 'cascader-input', // 文本输入框名
        bind_key: ['provinceId', 'cityId' ,'agentUuid'], // 返回数据的key名
        placeholder: '请选择',
        cascaderList: [],
        value: [], // 用于数据绑定
        title: '运营商：', // 展示的字段名
        titleWidth: 80, // 展示的字段名的宽度
        key: '5', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 220,
        isHide: false, // false: 不隐藏 / true: 隐藏
        changeOnSelect: false
    }
]