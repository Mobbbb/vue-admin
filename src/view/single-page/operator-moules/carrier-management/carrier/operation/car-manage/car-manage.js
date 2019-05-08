import { updateCarManagerStatus } from '@/api/operator-carrier.js'

const statusMap = {
    1: '在职',
    2: '离职',
    3: '冻结'
}

/*
* 车管列表table
*/
export const returnFields = (that) => {
    let emptyBtn = () => { return '' }
    let editBtn = (h, params) => {
        return h('Button', {
            props: {
              type: "warning",
              ghost: true,
              size: "small"
            },
            style:{
                marginRight: '15px'
            },
            on: {
                click: () => {
                    let $params = JSON.parse(JSON.stringify(params.row))
                    $params.joinTime = new Date($params.joinTime)
                    that.popEdit = true
                    that.params = $params
                }
            }
        }, '编辑')
    }
    let freezeBtn = (h, params, text) => { 
        return h('Button', {
            props: {
              type: "warning",
              ghost: true,
              size: "small"
            },
            style:{
                marginRight: '15px'
            },
            on: {
                click: () => {
                    let status = 1
                    if(params.row.status === 1) status = 3 // 变成冻结
                    if(params.row.status === 3) status = 1 // 变成正常
                    if(params.row.ownedVehiclesCount){ // 底下有车辆
                       that.$Modal.confirm({
                            title: '提示',
                            content: '<p>该车管下包含从属车辆，请先重新分配车辆归属，再进行此操作。</p>'
                        })
                    } else {
                        that.$Modal.confirm({
                            title: '提示',
                            content: '<p>确认' + text +'该车管吗？</p>',
                            cancelText: '取消',
                            onOk: () => {
                                updateCarManagerStatus({
                                    uuid: params.row.uuid, 
                                    status: status
                                }).then(res => {
                                    if(res.data.success) {
                                        that.$Message.success('设置成功！')
                                        that.getTableList()
                                    }
                                })
                            }
                        })
                    } 
                }
            }
        }, text)
    }
    let dimissionBtn = (h, params) => {
        return h('Button', {
            props: {
              type: "error",
              ghost: true,
              size: "small"
            },
            style:{
                marginRight: '15px'
            },
            on: {
                click: () => {
                    if(params.row.ownedVehiclesCount){ // 底下有车辆
                       that.$Modal.confirm({
                            title: '提示',
                            content: '<p>该车管下包含从属车辆，请先重新分配车辆归属，再进行此操作。</p>'
                        })
                    } else {
                        that.$Modal.confirm({
                            title: '提示',
                            content: '<p>确认设置该车管为已离职吗？</p>',
                            cancelText: '取消',
                            onOk: () => {
                                updateCarManagerStatus({
                                    uuid: params.row.uuid, 
                                    status: 2
                                }).then(res => {
                                    if(res.data.success) {
                                        that.$Message.success('设置成功！')
                                        that.getTableList()
                                    }
                                })
                            }
                        })
                    }  
                }
            }
        }, '离职')
    }
    return [
        {
            title: '姓名',
            key: 'realName',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '手机号',
            key: 'mobile',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '入职时间',
            key: 'joinTime',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '状态',
            key: 'status',
            tooltip: true,
            minWidth: 100,
            render: (h, params) => {
                return h('span', statusMap[params.row.status])
            }
        },
        {
            title: '职级',
            key: 'rank',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '车辆数',
            key: 'ownedVehiclesCount',
            tooltip: true,
            minWidth: 100
        },
        /*{
            title:'操作',
            key:'action',
            fixed: 'right',
            width: 210,
            render: (h, params) => {
                if(params.row.status === 1){
                    return h('div', [editBtn(h, params),freezeBtn(h, params, '冻结'),dimissionBtn(h, params)])
                } else if(params.row.status === 3){
                    return h('div', [editBtn(h, params),freezeBtn(h, params, '解冻')])
                } else {
                    return h('div', [editBtn(h, params)])
                }
            }
        }*/
    ]
}

/*
* 车辆列表table
*/
export const returnDetailFields = (that) => {
    return [
        {
            type: 'selection',
            width: 60,
            align: 'center',
            minWidth: 100
        },
        {
            title: '车辆ID',
            key: 'userName',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '车牌',
            key: 'userName',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '车架号',
            key: 'a',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '品牌车型车款',
            key: 'userName',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '持有方',
            key: 'userName',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '资产管理方',
            key: 'userName',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '状态',
            key: 'userName',
            width: 120,
            tooltip: true,
            minWidth: 100
        },
        {
            title: '绑定司机',
            key: 'userName',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '备注',
            key: 'userName',
            tooltip: true,
            minWidth: 100
        },
        {
            title:'操作项',
            key:'action',
            width: 120,
            fixed: 'right',
            render: (h, params) => {
                return h('div', [
                    h('span', {
                        'class':{
                            tableBtn: true
                        },
                        on: {
                            click: () => {
                                that.$router.push({
                                    name: 'vehicle-detail',
                                    params: { id: 'LS5A2DJX0JA000137' }
                                })
                            }
                        }
                    }, '详情'),
                    h('span', {
                        'class':{
                            tableBtn: true
                        },
                        on: {
                            click: () => {
                                that.popTransfer = true
                                that.selectionLists = [JSON.parse(JSON.stringify(params.row))]
                            }
                        }
                    }, '转移')
                ])
            }
        }
    ]
}


/*
* 以下配置暂无用，忽略
*
*
*
*
*
*
*
*
*
*
*
*/

export const waitForTransferCarColumns = (that) => {
    return [
        {
            title: '车牌号',
            key: 'userName',
            tooltip: true,
        },
        {
            title: '车架号',
            key: 'a',
            tooltip: true,
        },
        {
            title: '车管',
            key: 'number',
            tooltip: true,
        }
    ]
}

export const carManagerColumns = (that) => {
    return [
        {
            type: 'selection',
            width: 50,
            align: 'center'
        },
        {
            title: '车管姓名',
            key: 'userName',
            tooltip: true,
        },
        {
            title: '手机号',
            key: 'number',
            tooltip: true,
        }
    ]
}


export const inputList = [
	{
        name: 'text-input', 
        bind_key: 'name',
        placeholder: '请输入姓名',
        value: '',
        title: '车管姓名：',
        titleWidth: 65,
        inputWidth: 200, // input框的宽度
        key: 'name',
        isHide: false
    },
    {
        name: 'text-input',
        bind_key: 'mobile',
        placeholder: '请输入车管手机号',
        value: '',
        title: '车管手机号：',
        titleWidth: 75,
        inputWidth: 200, // input框的宽度
        key: 'mobile',
        isHide: false
    },
    {
        name: 'drop-input', // 下拉选择框
        bind_key: 'status',
        placeholder: '请选择车管状态',
        value: '',
        title: '车管状态：',
        titleWidth: 65,
        inputWidth: 200, // input框的宽度
        dropList: [
            {
                label: '在职',
                value: 1
            },
            {
                label: '离职',
                value: 2
            },
            {
                label: '冻结',
                value: 3
            }
        ],
        key: 'status',
        isHide: false
    },
]


export const disInputList = [
    {
        name: 'text-input', 
        bind_key: 'name',
        placeholder: '输入车牌号或车辆VIN码',
        value: '',
        title: '车牌号：',
        titleWidth: 50,
        inputWidth: 200, // input框的宽度
        key: '6',
        isHide: false
    },
    {
        name: 'remote-input', // 远程输入框
        bind_key: 'driveManag', // 返回数据的key名
        placeholder: '请选择所属司管',
        value: '', // 用于数据绑定
        title: '所属车管：', // 展示的字段名
        titleWidth: 65, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
        remoteMethod: function(){}, // 远程输入框输入时触发方法
        remoteList: [
            {
                label: '全部',
                value: '1124'
            },
            {
                label: '无',
                value: '11'
            },
            {
                label: '司管A',
                value: '1111'
            },
            {
                label: '司管B',
                value: '111111'
            }
        ], // 远程输入框匹配到的列表
        key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
        isHide: false // false: 不隐藏 / true: 隐藏
    }
]