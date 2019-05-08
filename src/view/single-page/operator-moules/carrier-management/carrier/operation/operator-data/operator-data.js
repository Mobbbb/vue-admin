export const waterLine = { // 流水y轴数据
    name: '总流水',
    type: 'line',
    barWidth: '60%',
    data: [],
    symbol: 'circle',
    symbolSize: '3',
    yAxisIndex: 0,
    itemStyle: {
        color: '#3fc768'
    }
}

export const orderLine = { // 订单y轴数据
    name: '总订单',
    type: 'line',
    barWidth: '60%',
    data: [],
    symbol: 'circle',
    symbolSize: '3',
    yAxisIndex: 1,
    itemStyle: {
        color: '#3398db'
    }
}

export const carLine = {
    name: '总车辆数',
    type: 'line',
    barWidth: '60%',
    data: [],
    symbol: 'circle',
    symbolSize: '3',
    yAxisIndex: 1,
    itemStyle: {
        color: '#3fc768'
    }
}

export const yAxisConfig = { // y轴配置
    type: 'value',
    nameGap: 25,
    nameTextStyle: {
        color: '#3fc768',
        fontSize: 14
    },
    offset: 10, // 相对默认位置的偏移
    axisLine: { // 轴线
        show: false
    },
    axisTick: { // 刻度
        show: false
    },
    splitLine: { // 分割线样式
        show: true,
        lineStyle: {
            type: 'dashed',
            opacity: 0.9
        }
    },
    axisLabel: {
        color: '#3fc768'
    }
}


export const option = {
    color: ['#3398DB'],
    legend: {
        top: 0,
        itemHeight: 8,
        itemWidth: 7,
        itemGap: 30,
        data: ['总订单', '总流水'],
        right: '10%',
        textStyle: {
            fontSize: 14
        }
    },
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(50,50,50,0.8)',
        formatter: function(a){
            let str = '<div style="padding: 5px 20px 5px 10px;">' + a[0].name
            let labelColor = ['#3fc768', '#3398db']
            let unit = []
            for(let i = 0; i < a.length; i++){
                switch (a[i].seriesName) {
                    case '总流水':
                        unit[i] = '元'
                        break
                    case '总订单':
                        unit[i] = '单'
                        break
                    case '总车辆数':
                        unit[i] = '辆'
                        break
                    }
            }
            a.forEach(function(item, index){
                str += '<div style="display: flex; align-items: center;">'+
                            '<div style="width: 6px; height: 6px; border-radius: 6px; background: '+ item.color +'; margin-right: 10px;"></div>'+
                            '<div>'+ item.seriesName.substr(1,2) +'：' + item.data + unit[index] +'</div>'+
                        '</div>'
            })
             str += '</div>'
            return str
        }
    },
    grid: {
        left: '4%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: [],
        axisTick: {
            alignWithLabel: true
        },
        axisLabel: {
            padding: [10,0,0,0],
            interval: 0,
            color: 'rgba(0, 0, 0, 0.7)'
        },
        axisLine: {
            lineStyle: {
                color: '#d9d9d9'
            }
        }
    }],
    yAxis: [
        {
            type: 'value',
            //name: '总流水/元',
            nameGap: 25,
            nameTextStyle: {
                color: '#3fc768',
                fontSize: 14,
                padding: [0,40,0,0]
            },
            offset: 10, // 相对默认位置的偏移
            axisLine: { // 轴线
                show: false
            },
            axisTick: { // 刻度
                show: false
            },
            splitLine: { // 分割线样式
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.9
                }
            },
            axisLabel: {
                color: '#3fc768'
            }
        },
        {
            type: 'value',
            //name: '总订单/单',
            nameGap: 25,
            nameTextStyle: {
                color: '#3398db',
                fontSize: 14,
                padding: [0,0,0,50]
            },
            offset: 10, // 相对默认位置的偏移
            axisLine: { // 轴线
                show: false
            },
            axisTick: { // 刻度
                show: false
            },
            splitLine: { // 分割线样式
            	show: false,
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.9
                }
            },
            axisLabel: {
                color: '#3398db'
            }
        }
    ],
    series: [
		waterLine, orderLine
    ]
}