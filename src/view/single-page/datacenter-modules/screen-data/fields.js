export const defaultData = {
    checkArr:[
        {
            name: '完成订单数',
            data: 2189,
            text: '结束计费时间为当日的订单数',
            pre: 14
        },
        {
            name: '订单总流水',
            data: 181818,
            text: '完成订单的实际总费用加总',
            pre: 14
        },
        {
            name: '实时单完成订单数',
            data: 2189,
            text: '结束计费时间为当日的实时订单数',
            pre: 14
        },
        {
            name: '实时单订单总流水',
            data: 2189,
            text: '完成实时单订单的实际总费用加总',
            pre: 14
        },
        {
            name: '预约单完成订单数',
            text: '结束计费时间为当日的预约订单数',
        }
    ],
    dataArr:[
        {
            name:'司机接单',
            type:'line',
            stack: '总量',
            itemStyle : {  
                normal : {
                    color: '#2D8CF0',
                    lineStyle:{  
                        color:'#2D8CF0'  
                    }  
                }  
            },
            areaStyle: {},
            data:[120, 132, 101, 134, 90, 230, 210]
        },
        {
            name:'乘客取消订单',
            type:'line',
            stack: '总量',
            itemStyle : {  
                normal : {
                    color: 'red',
                    lineStyle:{  
                        color:'red'  
                    }  
                }  
            },
            areaStyle: {},
            data:[220, 182, 191, 234, 290, 330, 310]
        },
        {
            name:'平台取消订单',
            type:'line',
            stack: '总量',
            itemStyle : {  
                normal : {
                    color: 'orange',
                    lineStyle:{  
                        color:'orange'  
                    }  
                }  
            },
            areaStyle: {},
            data:[150, 232, 201, 154, 190, 330, 410]
        },
        {
            name:'付款完成订单',
            type:'line',
            stack: '总量',
            itemStyle : {  
                normal : {
                    color: 'green',
                    lineStyle:{  
                        color:'green'  
                    }  
                }  
            },
            areaStyle: {},
            data:[320, 332, 301, 334, 390, 330, 320]
        },
        {
            name:'坏账订单',
            type:'line',
            stack: '总量',
            itemStyle : {  
                normal : {
                    color: 'yellow',
                    lineStyle:{  
                        color:'yellow'  
                    }  
                }
            },
            areaStyle: {},
            data:[820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
}