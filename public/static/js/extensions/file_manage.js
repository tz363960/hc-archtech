$().ready(function(){
    $("#btn_add").on("click", function () {
        $('#hiddenUploadField').click();
    })
    var strUrl = location.href;
    var arrUrl = strUrl.split("/");
    var strPage = arrUrl[arrUrl.length - 1];    
    var $table = strPage == 'design-files.html' ? $('#tableDesign'):$('#tableConstruct');
    
    function InitMainTable() {
        
        var queryUrl = strPage == 'design-files.html' ? '/DesignTable':'/constructTable';
        $table.bootstrapTable({
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
            pageList: [10, 25, 50, 100],        
            search: true,                      
            strictSearch: true,
            showColumns: true,                  
            showRefresh: true,                  
            minimumCountColumns: 2,             
            clickToSelect: true,                
            
            uniqueId: "ID",                     
            showToggle: true,                   
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
                field: 'Name',
                title: '名称',
                width: 250,
                align: 'center',
                formatter:stageFormatter
            }, {
                field: 'idCopy',
                title: '变更号',
                align: 'center',
                sortable: true
            }, {
                field: 'Type',
                title: '变更类型',
                align: 'center'
            }, {
                field: 'Time',
                title: '变更时间',
                align: 'center',
                sortable: true
            }, {
                field: 'Content',
                align: 'center',
                title: '变更内容'
            }, {
                field: 'Add',
                title: '备注',
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
            onDblClickRow: function (row, $element) {
                var id = row.ID;
                EditViewById(id, 'view');
            },
        });
    };
    function actionFormatter(value, row, index) {
        var id = value;
        var result = "";
        
        result += "<a href='javascript:;' class='btn btn-xs' style='color:blue' onclick=\"EditViewById('" + id + "')\" title='编辑'><span class='glyphicon glyphicon-pencil'></span></a>";
        result += "<a href='javascript:;' class='btn btn-xs' style='color:red' onclick=\"DeleteTrByIds(this)\" title='删除'><span class='glyphicon glyphicon-remove'></span></a>";
        return result;
    }
    function stageFormatter(value, row, index) {
        var id = value;
        var returnText = ["<a class='clickColumn' style='color:blue' href='javascript:void(0)'>" + id + " </a>"].join('');
        return returnText
    }
    InitMainTable();
})
function DeleteTrByIds(element){
    var tdnode = $(element);
    var trnode = tdnode.parents('tr');
    console.log(trnode[0].childNodes[2].innerText);
    trnode.remove();
}