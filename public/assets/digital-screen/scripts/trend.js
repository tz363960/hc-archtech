var symptomName = last_year_month();


$(function () {


    init();

})

function init() {

    var myColor = ['#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6'];

    //主要业务
    var histogramChart1 = echarts.init(document.getElementById('histogramChart1'));
    histogramChart1.setOption({

        color: ['#5bc0de'],
        grid: {
            left: '5%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}人"
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            data: ['个人存款', '个人贷款', '公司贷款', '股权管理', '信用担保', '国际汇款', '外汇业务', '支票兑换', '公司存款'],
            axisLine: {
                lineStyle: {
                    color: '#5bc0de'
                },
            },
            axisLabel: {
                interval: 0,
                rotate: 40,
                textStyle: {
                    color: '#fff'
                }
            }
        }],
        yAxis: [{
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#5bc0de'
                },
            },
            splitLine: {
                "show": false
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                },
                formatter: function (value) {
                    return value + ""
                },
            },
        }],
        series: [{
            name: '主要业务',
            type: 'bar',
            barWidth: 20,
            data: [2210, 1085, 926, 669, 634, 452, 412, 312, 156],
        }, ]
    })

    //主要症状
    var histogramChart2 = echarts.init(document.getElementById('histogramChart2'));
    var upColor = '#ec0000';
    var upBorderColor = '#8A0000';
    var downColor = '#00da3c';
    var downBorderColor = '#008F28';

    var dataCount = 8e1;
    var data = generateOHLC(dataCount);
    histogramChart2.setOption({
        dataset: {
            source: data
        },
        title: {
            text: 'Data Amount: ' + echarts.format.addCommas(dataCount)
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            }
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: false
                },
            }
        },
        grid: [{
                left: '10%',
                right: '2%',
                bottom: 200
            },
            {
                left: '10%',
                right: '2%',
                height: 80,
                bottom: 80
            }
        ],
        xAxis: [{
                axisLabel:{
                    textStyle:{
                        color:'#F8F8FF'
                    }
                },
                type: 'category',
                scale: true,
                boundaryGap: false,
                // inverse: true,
                axisLine: {
                    onZero: false
                },
                splitLine: {
                    show: false
                },
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax'
            },
            {
                type: 'category',
                gridIndex: 1,
                scale: true,
                boundaryGap: false,
                axisLine: {
                    onZero: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax'
            }
        ],
        yAxis: [{
                axisLabel:{
                    textStyle:{
                        color:'#F8F8FF'
                    }
                },
                scale: true,
                splitArea: {
                    show: true
                }
            },
            {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }
        ],
        dataZoom: [{
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 10,
                end: 100
            },
            {
                show: true,
                xAxisIndex: [0, 1],
                type: 'slider',
                bottom: 10,
                start: 10,
                end: 100,
                handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '95%'
            }
        ],
        visualMap: {
            show: false,
            seriesIndex: 1,
            dimension: 6,
            pieces: [{
                value: 1,
                color: upColor
            }, {
                value: -1,
                color: downColor
            }]
        },
        series: [{
                type: 'candlestick',
                itemStyle: {
                    color: upColor,
                    color0: downColor,
                    borderColor: upBorderColor,
                    borderColor0: downBorderColor
                },
                encode: {
                    x: 0,
                    y: [1, 4, 3, 2]
                }
            },
            {
                name: 'Volumn',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {
                    color: '#7fbe9e'
                },
                large: true,
                encode: {
                    x: 0,
                    y: 5
                }
            }
        ]
    })

    //传染病发病趋势
    var lineChart1 = echarts.init(document.getElementById('lineChart1'));
    lineChart1.setOption({
        title: {
            text: '业务人次趋势',
            textStyle: {
                fontSize: 16,
                color: '#ff7f50'
            },
        },
        color: ["#ff7f50"],
        grid: {
            left: '15%',
            right: '5%',
            bottom: '15%',

        },
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}人"
        },

        calculable: true,
        yAxis: [{
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#ff7f50'
                },
            },
            splitLine: {
                "show": false
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                },
                formatter: function (value) {
                    return value + ""
                },
            },
        }],
        xAxis: [{
            type: 'category',
            data: symptomName,
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#ff7f50'
                },
            },
            splitLine: {
                "show": false
            },
            axisLabel: {
                // interval:0,
                // rotate:40,
                textStyle: {
                    color: '#fff'
                },
                formatter: function (value) {
                    return value + ""
                },
            },
        }],
        series: [{
            name: '传染病人数',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: 'default'
                    }
                }
            },
            data: [12202, 11323, 31401, 41534, 43620, 32370, 22810, 29120, 31532, 51401, 11334, 3350]
        }, ]

    })

    //主要疾病排行
    var histogramChart3 = echarts.init(document.getElementById('histogramChart3'));
    histogramChart3.setOption({

        grid: {
            top: '12%',
            left: '30%'
        },
        xAxis: {
            show: false
        },
        yAxis: [{
            show: true,
            data: ['进出口', '外汇业务', '公司贷款', '个人存款', '股权管理', '信用担保', '国际汇款', '公司存款'],
            inverse: true,
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#fff',
                formatter: (value, index) => {
                    return [

                        `{lg|${index+1}}  ` + '{title|' + value + '} '
                    ].join('\n')
                },
                rich: {
                    lg: {
                        backgroundColor: '#339911',
                        color: '#fff',
                        borderRadius: 15,
                        // padding: 5,
                        align: 'center',
                        width: 15,
                        height: 15
                    },
                }
            },


        }, {
            show: true,
            inverse: true,
            data: [2000, 1800, 1200, 1100, 900, 900, 800, 700],
            axisLabel: {
                textStyle: {
                    fontSize: 12,
                    color: '#fff',
                },
            },
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },

        }],
        series: [{
            name: '条',
            type: 'bar',
            yAxisIndex: 0,
            data: [20, 18, 12, 11, 9, 9, 8, 7],
            barWidth: 10,
            itemStyle: {
                normal: {
                    barBorderRadius: 20,
                    color: function (params) {
                        var num = myColor.length;
                        return myColor[params.dataIndex % num]
                    },
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    formatter: '{c}%'
                }
            },
        }, {
            name: '框',
            type: 'bar',
            yAxisIndex: 1,
            barGap: '-100%',
            data: [100, 100, 100, 100, 100, 100, 100, 100],
            barWidth: 15,
            itemStyle: {
                normal: {
                    color: 'none',
                    borderColor: '#00c1de',
                    borderWidth: 1,
                    barBorderRadius: 15,
                }
            }
        }, ]
    })

    //业务金额趋势
    var lineChart2 = echarts.init(document.getElementById('lineChart2'));
    lineChart2.setOption({
        title: {
            text: '总金额趋势',
            textStyle: {
                fontSize: 16,
                color: '#32cd32'
            },
            x: "center"
        },
        color: ["#32cd32"],
        grid: {
            left: '15%',
            right: '5%',
            bottom: '25%',

        },
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}人"
        },

        calculable: true,
        yAxis: [{
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#32cd32'
                },
            },
            splitLine: {
                "show": false
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                },
                formatter: function (value) {
                    return value + ""
                },
            },
        }],
        xAxis: [{
            type: 'category',
            data: symptomName,
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: "#F8F8FF"
                },
            },
            splitLine: {
                "show": false
            },
            axisLabel: {
                // interval:0,
                // rotate:40,
                textStyle: {
                    color: '#fff'
                },
                formatter: function (value) {
                    return value + ""
                },
            },
        }],
        series: [{
            name: '疾病发病人数',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: 'default'
                    }
                }
            },
            data: [520, 232, 701, 434, 190, 230, 210, 120, 132, 101, 134, 890]
        }, ]

    })

    //国籍分布
    var pieChart1 = echarts.init(document.getElementById('pieChart1'));
    pieChart1.setOption({
        color: ["#32cd32", "#ff7f50", "#87cefa", "#FD6C88", "#4b5cc4", "#faff72"],
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}人"
        },
        calculable: true,
        series: [{
            name: '发病人数',
            type: 'pie',
            radius: [30, 110],
            center: ['50%', '50%'],
            roseType: 'area',
            x: '50%',



            sort: 'ascending',
            data: [{
                    value: 87,
                    name: '埃塞俄比亚'
                },
                {
                    value: 5,
                    name: '南非共和国'
                },
                {
                    value: 48,
                    name: '美国'
                },
                {
                    value: 25,
                    name: '中国'
                },
                {
                    value: 23,
                    name: '阿尔及利亚'
                },
                {
                    value: 53,
                    name: '法国'
                },
                {
                    value: 25,
                    name: '英国'
                },
                {
                    value: 21,
                    name: '瑞士'
                },
            ]
        }]
    })

    //性别分布
    var labelFromatter = {
        normal: {
            label: {
                position: 'center',
                formatter: function (params) {
                    console.log(params)
                    if (params.name == "女性") {
                        return "女性" + ":" + (params.percent + '%')
                    } else {
                        return "男性" + ":" + (params.percent + '%')
                    }
                },
            },
            labelLine: {
                show: false
            }
        },
    };

    var pieChart2 = echarts.init(document.getElementById('pieChart2'));
    pieChart2.setOption({

        color: ['#87cefa', '#FD6C88'],
        tooltip: {
            trigger: 'item',
            formatter: "{b}({c})<br/>{d}%"
        },

        series: [{
            type: 'pie',
            center: ['50%', '50%'],
            radius: [55, 95],
            x: '0%', // for funnel
            itemStyle: labelFromatter,
            data: [{
                    name: '男性',
                    value: 158
                },
                {
                    name: '女性',
                    value: 142
                },
            ]
        }, ],
    })

}


function generateOHLC(count) {
    var data = [];

    var xValue = +new Date(2019, 0, 1);
    var minute = 60 * 1000;
    var baseValue = Math.random() * 1200;
    var boxVals = new Array(4);
    var dayRange = 12;

    for (var i = 0; i < count; i++) {
        baseValue = baseValue + Math.random() * 20 - 10;

        for (var j = 0; j < 4; j++) {
            boxVals[j] = (Math.random() - 0.5) * dayRange + baseValue;
        }
        boxVals.sort();

        var idxRandom = Math.random();
        var openIdx = Math.round(Math.random() * 3);
        var closeIdx = Math.round(Math.random() * 2);
        if (closeIdx === openIdx) {
            closeIdx++;
        }
        var volumn = boxVals[3] * (800 + Math.random() * 100);

        // ['open', 'close', 'lowest', 'highest', 'volumn']
        // [1, 4, 3, 2]
        data[i] = [
            echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', xValue += minute),
            +boxVals[openIdx].toFixed(2), // open
            +boxVals[3].toFixed(2), // highest
            +boxVals[0].toFixed(2), // lowest
            +boxVals[closeIdx].toFixed(2), // close
            volumn.toFixed(0),
            getSign(data, i, +boxVals[openIdx], +boxVals[closeIdx], 4) // sign
        ];
    }

    return data;

    function getSign(data, dataIndex, openVal, closeVal, closeDimIdx) {
        var sign;
        if (openVal > closeVal) {
            sign = -1;
        } else if (openVal < closeVal) {
            sign = 1;
        } else {
            sign = dataIndex > 0
                // If close === open, compare with close of last record
                ?
                (data[dataIndex - 1][closeDimIdx] <= closeVal ? 1 : -1)
                // No record of previous, set to be positive
                :
                1;
        }

        return sign;
    }
}