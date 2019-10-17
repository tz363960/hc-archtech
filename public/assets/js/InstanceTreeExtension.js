class InstanceTreeExtension extends Autodesk.Viewing.Extension {
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




        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        //图2：极坐标双数值轴
        var myChartLine = echarts.init(document.getElementById('line-chart'));


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

Autodesk.Viewing.theExtensionManager.registerExtension( 'MyTreeExtension', InstanceTreeExtension );