class Chart extends Autodesk.Viewing.Extension {
    constructor( viewer, options ) {
        super( viewer, options );

        this.onGeometryLoaded = this.onGeometryLoaded.bind( this );
    }

    onGeometryLoaded( event ) {



        //图1：柱状图：调用viewer中数据
        var instanceTree = event.model.getData().instanceTree;
        var depth_0 = instanceTree.maxDepth;
       
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('bar-chart'));
        // 指定图表的配置项和数据
        var itemStyle = {
            normal: {
                opacity: 0.8,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        };

        var option = {
            angleAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                z: 10
            },
            radiusAxis: {
            },
            polar: {
            },
            series: [{
                type: 'bar',
                data: [1, 2, 3, 4, 3, depth_0, 1],
                itemStyle: itemStyle,
                coordinateSystem: 'polar',
                name: 'A',
                stack: 'a'
            }, {
                type: 'bar',
                data: [2, 4, 6, 1, 3, 2, 1],
                coordinateSystem: 'polar',
                name: 'B',
                stack: 'a'
            }, {
                type: 'bar',
                data: [1, 2, 3, 4, 1, 2, depth_0],
                coordinateSystem: 'polar',
                name: 'C',
                stack: 'a'
            }],
            legend: {
                show: true,
                data: ['A', 'B', 'C']
            }
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        //图2：极坐标双数值轴
        var myChartLine = echarts.init(document.getElementById('line-chart'));

        var data = [];

        for (var i = 0; i <= 100; i++) {
            var theta = i / 100 * 360;
            var r = 5 * (1 + Math.sin(theta / 180 * Math.PI));
            data.push([r, theta]);
        }
        

        var option = {
            title: {
                text: 'BIM极坐标双数值轴'
            },
            legend: {
                data: ['line']
            },
            polar: {},
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            angleAxis: {
                type: 'value',
                startAngle: 0
            },
            radiusAxis: {
            },
            series: [{
                coordinateSystem: 'polar',
                name: 'line',
                type: 'line',
                data: data
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChartLine.setOption(option);

        // 基于准备好的dom，初始化echarts实例

    }

    load() {
        this.viewer.addEventListener(
            Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
            this.onGeometryLoaded
        );
        return true;
    }

    unload() {
        this.viewer.removeEventListener(
            Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
            this.onGeometryLoaded
        );
        return true;
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension( 'MyChartExtension', Chart );