
$().ready(function(){
    function InitMainTable() {
        
        var queryUrl = '/datas/gjTracking.json'
        $('#tableComponent').bootstrapTable({
            url: queryUrl,                      
            method: 'GET',                      
            
            striped: true,                      
            cache: false,                       
            pagination: true,                   
            sortable: true,                     
            sortOrder: "asc",                   
            sidePagination: "client",           
            pageNumber: 1,                      
            pageSize: 10,                       
            pageList: [10, 20, 30],             
            search: false,                      
            strictSearch: true,
            showColumns: false,                  
            showRefresh: false,                  
            minimumCountColumns: 2,             
            clickToSelect: true,                
            
            uniqueId: "ID",                     
            showToggle: false,                   
            cardView: false,                    
            detailView: false,                  
            
            queryParams: function (params) {   
                
                var temp = {
                    rows: params.limit,                         
                    page: (params.offset / params.limit) + 1,   
                    sort: params.sort,      
                    sortOrder: params.order 
                };
                return temp;
            },
            columns: [{
                checkbox: true,
                visible: true                  
            }, {
                field: 'ids',
                title: '序号',
                align: 'center',
                editable: true,
            }, {
                field: 'type',
                title: '构件类型',
                align: 'center',
                sortable: true
            }, {
                field: 'encode',
                title: '构件编码',
                align: 'center',
                events: createFlowsheet,
                formatter: stageFormatter,
            }, {
                field: 'floor',
                title: '楼层',
                align: 'center',
                sortable: true
            }, {
                field: 'single',
                align: 'center',
                title: '单体'
            }, {
                field: 'states',
                title: '构件状态',
                align: 'center'
            }, {
                field: 'output',
                title: '是否导出',
                align: 'center'
            }, {
                field: 'ID',
                title: '操作',
                width: 120,
                align: 'center',
                valign: 'middle',
                formatter: actionFormatter  
            },],
            onLoadSuccess: function () {
            },
            onLoadError: function () {
                alert("数据加载失败！");
            },
        });
    };
    
    function actionFormatter(value, row, index) {
        var id = value;
        var result = "";
        
        result += "<a href='javascript:;' class='btn btn-xs' style='color:blue' onclick=\"EditViewById('" + id + "')\" title='编辑'><span class='glyphicon glyphicon-pencil'></span></a>";
        result += "<a href='javascript:;' class='btn btn-xs' style='color:red' onclick=\"DeleteByIds('" + id + "')\" title='删除'><span class='glyphicon glyphicon-remove'></span></a>";
        return result;
    }
    
    function stageFormatter(value, row, index) {
        var id = value;
        return ["<a class='clickColumn' style='color:blue' href='javascript:void(0)'>" + id + " </a>"].join('');
    }
    
    window.createFlowsheet = {
        "click .clickColumn": function (e, value, row, index) {
            var componentColor = [];
            for (var j = 0; j < 11; j++) {
                componentColor.push('lightblue');
            }
            var n = componentColor.length;
            var ranOrange = Math.floor(Math.random() * n);
            componentColor[ranOrange] = 'orange';
            var componentData = [
                { key: "购买", color: componentColor[0] },
                { key: "钢筋安装", color: componentColor[1] },
                { key: "浇筑养护", color: componentColor[2] },
                { key: "修补", color: componentColor[3] },
                { key: "预留预埋", color: componentColor[4] },
                { key: "入库", color: componentColor[5] },
                { key: "出库", color: componentColor[6] },
                { key: "运输", color: componentColor[7] },
                { key: "现场验收", color: componentColor[8] },
                { key: "吊装", color: componentColor[9] },
                { key: "交付验收", color: componentColor[10] }
            ];
            $("#componentLCT").remove();    
            
            $('#componentPanel')[0].innerHTML = '<div id="componentLCT" style="width:100%; height:150px; background-color: rgb(242, 248, 248);"></div>'
            initLCT(componentData);
            var componentStage = componentData[ranOrange].key;
            $("#tableManager").remove();
            $("#zzrPanel")[0].innerHTML = '<table class="table table-striped table_list_box" id="tableManager"></table>'
            InitManTable(componentStage);
        }
    }
    InitMainTable();
    
    
    
    function initLCT(componentDataInner) {
        var $ = go.GraphObject.make;  
        LCTDiagram = $(go.Diagram, "componentLCT",
            {
                initialContentAlignment: go.Spot.Center, 
                "undoManager.isEnabled": true,  
                layout: $(go.TreeLayout, 
                    { angle: 0, layerSpacing: 35 })
            });
        
        LCTDiagram.nodeTemplate =
            $(go.Node, "Auto",  
                $(go.Shape, "RoundedRectangle", { strokeWidth: 0, fill: "white" },
                    
                    new go.Binding("fill", "color")),
                $(go.TextBlock,
                    { margin: 15 },  
                    
                    new go.Binding("text", "key"))
            );
        
    
        LCTDiagram.model = new go.GraphLinksModel(
            componentDataInner,
            [
                { from: "购买", to: "钢筋安装" },
                { from: "购买", to: "预留预埋" },
                { from: "预留预埋", to: "浇筑养护" },
                { from: "钢筋安装", to: "浇筑养护" },
                { from: "浇筑养护", to: "修补" },
                { from: "修补", to: "入库" },
                { from: "入库", to: "出库" },
                { from: "出库", to: "运输" },
                { from: "运输", to: "现场验收" },
                { from: "现场验收", to: "吊装" },
                { from: "吊装", to: "交付验收" }
            ]);
    }
    
    
    
    function InitManTable(stages) {
        
        var manUrl = '/datas/componentMan.json';
        $('#tableManager').bootstrapTable({
            url: manUrl,                      
            method: 'GET',                      
    
            columns: [{
                checkbox: true,
                visible: true                  
            }, {
                field: 'man',
                title: '操作人',
                align: 'center'
            }, {
                field: 'stage',
                title: '构件阶段',
                align: 'center',  
                formatter: function(value, row, index){
                    return stages;
                }    
            }, {
                field: 'state',
                title: '构件状态',
                align: 'center'
            }, {
                field: 'check',
                title: '工序检查',
                align: 'center',
            }, {
                field: 'remarks',
                align: 'center',
                title: '备注'
            }, {
                field: 'image',
                title: '图片',
                align: 'center',
                formatter: links    
            }, {
                field: 'time',
                title: '更新时间',
                align: 'center'
            },],
            onLoadSuccess: function () {
            },
            onLoadError: function () {
                alert("数据加载失败！");
            }
        });
    };
    function links(value, row, index) {
        return ['<a href="#" download="1-4-PCB5b.jpg" style="color:blue">下载图片</a>'].join('');
    }
})