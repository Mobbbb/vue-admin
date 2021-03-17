export const mapObj = {
    1: 'sceneTime', //时间范围 
    2:  'sceneLocation',  //地点范围 
    3: 'sceneAmount',  //用车限额 
    4: 'sceneCity',  //同城限制 
    5: 'sceneRoute', //订单类型 
    6: 'sceneCar', //用车分类 
    7: 'sceneRemark', //用车备注 
    8: 'sceneApproval', //审批人设置 
}

export const tableTitle = [{
        title: '企业名称',
        key: 'enteroriseName'
    },
    {
        title: '用车场景',
        key: 'sceneName'
    }
]

export const pageData = {
    total: 1,
    current: 1,
    pageSize: 10,
    tableColumns: [],
    tableData: [],
    isLoading: false,
    companyName: '南京亚太嘉园智慧空间营造有限公司',
    modalFrom :{
        isShowDetail: false,
        initTab:'0',
        showModal: false
    },
    sceneList: [
    
    ]

}




export const arrData = [
            {
                name: '时间范围',
                indeterminate: false,
                checkAll: false,
                list: [
                    {
                        label: '1',
                        value: '不限'
                    },
                    {
                        label: '2',
                        value: '按星期'
                    },
                    {
                        label: '3',
                        value: '按日期'
                    }
                ],
                checkAllGroup: []
            },
            {
                name: '地点范围',
                checkAll: false,
                indeterminate: false,
                list: [
                    {
                        label: '1',
                        value: '出发地范围'
                    },
                    {
                        label: '2',
                        value: '目的地范围'
                    }
                ],
                checkAllGroup: []
            },
            {
                name: '用车限额',
                indeterminate: false,
                checkAll: false,
                list: [
                    {
                        label: '1',
                        value: '月限额'
                    },
                    {
                        label: '2',
                        value: '日限额'
                    },
                    {
                        label: '3',
                        value: '单笔限额'
                    }
                ],
                checkAllGroup: []
            },
            {
                name: '同城限制',
                indeterminate: false,
                checkAll: false,
                list: [
                    {
                        label: '1',
                        value: '起点和终点必须在同一个城市'
                    }
                ],
                checkAllGroup: []
            },
            {
                name: '订单类型',
                indeterminate: false,
                checkAll: false,
                list: [
                    {
                        label: '1',
                        value: '实时单'
                    },
                    {
                        label: '2',
                        value: '预约单'
                    }
                ],
                checkAllGroup: []
            },
            {
                name: '用车分类',
                indeterminate: false,
                checkAll: false,
                list: [
                    {
                        label: '2',
                        value: '快车'
                    },
                    {
                        label: '4',
                        value: '专车'
                    }
                ],
                checkAllGroup: []
            },
            {
                name: '用车备注',
                indeterminate: false,
                checkAll: false,
                list: [
                    {
                        label: '1',
                        value: '备注'
                    }
                ],
                checkAllGroup: []
            },
            {
                name: '审批人设置',
                indeterminate: false,
                checkAll: false,
                list: [
                    {
                        label: '1',
                        value: '1级'
                    },
                    {
                        label: '2',
                        value: '2级'
                    }
                ],
                checkAllGroup: []
            },
        ]

export const inputList = [
    {
        name: 'text-input',
        bind_key: 'enteroriseName',
        placeholder: '请输入',
        value: '',
        title: '企业名称：',
        titleWidth: 75,
        inputWidth: 200,
        key: "6",
        isHide: false
    }
]