import { updateDriverM } from '@/api/operator-carrier.js'

const statusMap = {
    1: '在职',
    2: '离职',
    3: '冻结'
}

const statusMap2 = {
    1: '正常',
    2: '短期封号',
    3: '长期封号',
    4: '未审核',
    5: '删除',
    6: '离职',
    7: '黑名单',
    8: '强制下线',
    9: '冻结'
}

/*
* 司管列表table
*/
export const returnFields = (that) => {
    let emptyBtn = () => { return '' }
    let driverListBtn = (h, params) => {
        return h('Button', {
            props: {
              type: "info",
              ghost: true,
              size: "small"
            },
            style:{
                marginRight: '15px'
            },
            on: {
                click: () => {
                    that.popDetail = true
                    that.driverMId = params.row.uuid
                }
            }
        }, '司机列表')
    } 
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
                    if(params.row.driverCount){ // 底下有司机
                       that.$Modal.confirm({
                            title: '提示',
                            content: '<p>该司管下包含从属司机，请先重新分配司机归属，再进行此操作。</p>'
                        })
                    } else {
                        that.$Modal.confirm({
                            title: '提示',
                            content: '<p>确认' + text +'该司管吗？</p>',
                            cancelText: '取消',
                            onOk: () => {
                                updateDriverM({
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
                    if(params.row.driverCount){ // 底下有司机
                       that.$Modal.confirm({
                            title: '提示',
                            content: '<p>该司管下包含从属司机，请先重新分配司机归属，再进行此操作。</p>'
                        })
                    } else {
                        that.$Modal.confirm({
                            title: '提示',
                            content: '<p>确认设置该司管为已离职吗？</p>',
                            cancelText: '取消',
                            onOk: () => {
                                updateDriverM({
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
            key: '111',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '司机数',
            key: 'driverCount',
            tooltip: true,
            minWidth: 100
        },
        {
            title:'操作',
            key:'action',
            fixed: 'right',
            width: 120,
            render: (h, params) => {
                return h('div', [driverListBtn(h, params)])
                /*if(params.row.status === 1){
                    return h('div', [driverListBtn(h, params),editBtn(h, params),freezeBtn(h, params, '冻结'),dimissionBtn(h, params)])
                } else if(params.row.status === 3){
                    return h('div', [driverListBtn(h, params),editBtn(h, params),freezeBtn(h, params, '解冻')])
                } else {
                    return h('div', [driverListBtn(h, params),editBtn(h, params)])
                }*/
            }
        }
    ]
}

/*
* 司机列表table
*/
export const returnDetailFields = (that) => {
    return [
        {
            title: '姓名',
            key: 'name',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '司机ID',
            key: 'driverNo',
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
            key: 'entryTime',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '状态',
            key: 'status',
            tooltip: true,
            minWidth: 100,
            render: (h, params) => {
                return h('span', statusMap2[params.row.status])
            }
        },
        {
            title:'操作',
            key:'action',
            width: 120,
            fixed: 'right',
            render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            type: "info",
                            ghost: true,
                            size: "small"
                        },
                        on: {
                            click: () => {
                                that.$router.push({
                                    name: 'staff-detail',
                                    params: { id: params.row.uuid }
                                })
                            }
                        }
                    }, '司机详情')
                ])
            }
        }
    ]
}


export const inputList = [
	{
        name: 'text-input', 
        bind_key: 'realName',
        placeholder: '请输入姓名',
        value: '',
        title: '司管姓名:',
        titleWidth: 65,
        inputWidth: 200, // input框的宽度
        key: '6',
        isHide: false
    },
    {
        name: 'text-input',
        bind_key: 'mobile',
        placeholder: '请输入司管手机号',
        value: '',
        title: '司管手机号:',
        titleWidth: 75,
        inputWidth: 200, // input框的宽度
        key: '6',
        isHide: false
    },
    {
        name: 'drop-input', // 下拉选择框
        bind_key: 'status',
        placeholder: '请选择司管状态',
        value: '',
        title: '司管状态:',
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
        key: '5',
        isHide: false
    }
]


export const disInputList = [
    {
        name: 'text-input', 
        bind_key: 'name',
        placeholder: '输入司机姓名',
        value: '',
        title: '司机:',
        titleWidth: 40,
        inputWidth: 200, // input框的宽度
        key: '6',
        isHide: false
    },
    {
        name: 'text-input', 
        bind_key: 'mobile',
        placeholder: '输入司机手机号',
        value: '',
        title: '手机号：',
        titleWidth: 65,
        inputWidth: 200, // input框的宽度
        key: '6',
        isHide: false
    },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'driverManagerUuid', // 返回数据的key名
        placeholder: '请选择所属司管',
        value: '', // 绑定返回数据
        dropList: [], // 级联列表
        title: '所属司管:', // 展示的字段名
        titleWidth: 65, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
        key: '888', // 该文本框的唯一标识，用于匹配该文本框是否展示
        isHide: false // false: 不隐藏 / true: 隐藏
    }
]