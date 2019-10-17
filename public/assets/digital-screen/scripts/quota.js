$(function () {


    init();

})

function init() {



    var myColor = ['#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6'];

    //各部门来访人次
    var histogramChart1 = echarts.init(document.getElementById('histogramChart1'));
    histogramChart1.setOption({

        grid: {
            top: '20%',
            left: '32%'
        },
        xAxis: {
            show: false
        },
        yAxis: [{
            show: true,
            data: ['国内个人', '国内对公', '海外个人', '海外对公', ],
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
            data: [4000, 3000, 2000, 1000],
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
            data: [40, 30, 20, 10],
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
            data: [100, 100, 100, 100],
            barWidth: 15,
            itemStyle: {
                normal: {
                    color: 'none',
                    borderColor: '#00c1de',
                    borderWidth: 3,
                    barBorderRadius: 15,
                }
            }
        }, ]
    })

    //各部门业务人次
    var histogramChart2 = echarts.init(document.getElementById('histogramChart2'));
    histogramChart2.setOption({

        grid: {
            top: '20%',
            left: '32%'
        },
        xAxis: {
            show: false
        },
        yAxis: [{
            show: true,
            data: ['国内个人', '国内对公', '海外个人', '海外对公', ],
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
            data: [2200, 2400, 2600, 2800],
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
            data: [22, 24, 26, 28],
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
            data: [100, 100, 100, 100],
            barWidth: 15,
            itemStyle: {
                normal: {
                    color: 'none',
                    borderColor: '#00c1de',
                    borderWidth: 3,
                    barBorderRadius: 15,
                }
            }
        }, ]
    })

    //VIP客户量
    var pieChart1 = echarts.init(document.getElementById('pieChart1'));
    pieChart1.setOption({
        color: ["#87cefa", "#ff7f50", "#32cd32", "#da70d6", ],
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}人"
        },
        calculable: true,
        series: [{
            name: 'VIP客户量',
            type: 'pie',
            radius: [30, 110],
            center: ['50%', '50%'],
            roseType: 'area',
            x: '50%',
            max: 40,
            sort: 'ascending',
            data: [{
                    value: 10,
                    name: '国内个人'
                },
                {
                    value: 5,
                    name: '国内对公'
                },
                {
                    value: 15,
                    name: '海外个人'
                },
                {
                    value: 25,
                    name: '海外对公'
                },
            ]
        }]
    })

    //医疗费用
    var lineChart1 = echarts.init(document.getElementById('lineChart1'));
    lineChart1.setOption({
        color: ["#87cefa", "#ff7f50", "#32cd32", "#da70d6", ],
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}M$"
        },
        legend: {
            data: ['个人存款', '个人支票', '消费贷款', '存单证明'],
            y: 'bottom',
            x: 'center',
            textStyle: {
                color: '#fff',
                fontSize: 12
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '10%',
            containLabel: true
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisLine: {
                lineStyle: {
                    color: '#87cefa'
                },
            },
            axisLabel: {
                interval: 0,
                rotate: 40,

                textStyle: {
                    color: '#fff',
                    fontSize: 13
                }
            }
        }],
        yAxis: [{
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#87cefa'
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
                    return value + "M$"
                },
            },
        }],
        series: [{
                name: '个人存款',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [10, 12, 21, 54, 260, 830, 710]
            },
            {
                name: '个人支票',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [30, 182, 434, 791, 390, 30, 10]
            },
            {
                name: '消费贷款',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [1320, 1132, 601, 234, 120, 90, 20]
            },
            {
                name: '存单证明',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [320, 132, 61, 34, 20, 9, 2]
            }
        ]

    })

    //体检人次
    var lineChart2 = echarts.init(document.getElementById('lineChart2'));
    lineChart2.setOption({
        color: ["#87cefa", "#ff7f50", "#32cd32", "#da70d6", ],
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}人"
        },
        legend: {
            data: ['股权贷款', '定期贷款', '商品贷款', '私募股权', ],
            y: 'bottom',
            x: 'center',
            textStyle: {
                color: '#fff',
                fontSize: 12
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '10%',
            containLabel: true
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisLine: {
                lineStyle: {
                    color: '#87cefa'
                },
            },
            axisLabel: {
                interval: 0,
                rotate: 40,

                textStyle: {
                    color: '#fff',
                    fontSize: 13
                }
            }
        }],
        yAxis: [{
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#87cefa'
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
                    return value + "M$"
                },
            },
        }],
        series: [{
                name: '股权贷款',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [2240, 1522, 4221, 2524, 4460, 4530, 3510]
            },
            {
                name: '定期贷款',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [1230, 2682, 2534, 4691, 3490, 4130, 1910]
            },
            {
                name: '商品贷款',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [2320, 4132, 3161, 2134, 2112, 4190, 3120]
            },
            {
                name: '私募股权',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [4320, 3132, 5461, 2534, 3202, 5193, 2222]
            }
        ]

    })

    //VIP客户金额
    var pieChart2 = echarts.init(document.getElementById('pieChart2'));
    pieChart2.setOption({
        color: ["#87cefa", "#ff7f50", "#32cd32", "#da70d6", ],
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}M$"
        },
        calculable: true,
        series: [{
            name: 'VIP客户金额',
            type: 'pie',
            radius: [30, 110],
            center: ['45%', '50%'],
            roseType: 'area',
            x: '50%',
            max: 40,
            sort: 'ascending',
            data: [{
                    value: 700,
                    name: '国内个人'
                },
                {
                    value: 500,
                    name: '国内对公'
                },
                {
                    value: 105,
                    name: '海外个人'
                },
                {
                    value: 250,
                    name: '海外对公'
                },
            ]
        }]
    })

    //国内
    var histogramChart3 = echarts.init(document.getElementById('histogramChart3'));
    histogramChart3.setOption({

        color: ['#87cefa'],
        grid: {
            left: '5%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}%"
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            data: ['存款业务', '贷款业务', '股权管理', '信用担保', '支票兑换'],
            axisLine: {
                lineStyle: {
                    color: '#87cefa'
                },
            },
            axisLabel: {
                interval: 0,
                rotate: 40,

                textStyle: {
                    color: '#fff',
                    fontSize: 13
                }
            }
        }],
        yAxis: [{
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#87cefa'
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
                    return value + "%"
                },
            },
        }],
        series: [{
            name: '药占比',
            type: 'bar',
            barWidth: 30,
            data: [22, 23, 18, 17, 10],
        }, ]
    });

    //海外
    var histogramChart4 = echarts.init(document.getElementById('histogramChart4'));
    histogramChart4.setOption({

        color: ['#87cefa'],
        grid: {
            left: '5%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a}<br/>{b}<br/>{c}%"
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            data: ['国际汇款', '进出口业务', '银行担保', '外汇业务', '支票兑换', ],
            axisLine: {
                lineStyle: {
                    color: '#87cefa'
                },
            },
            axisLabel: {
                interval: 0,
                rotate: 40,

                textStyle: {
                    color: '#fff',
                    fontSize: 13
                }
            }
        }],
        yAxis: [{
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#87cefa'
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
                    return value + "%"
                },
            },
        }],
        series: [{
            name: '药占比',
            type: 'bar',
            barWidth: 30,
            data: [10, 23, 21, 24, 12],
        }, ]
    });

}