$(function() {
    //初始化
    operate.operateInit();
});
// 操作
var operate = {
    // 初始化按钮事件
    operateInit : function() {
        this.operateAdd();
        this.operateUpdate();
        this.operateDelete();
        this.DepartmentModel = {
            id : ko.observable(),  //和标签中的data-bind  对应
            Name : ko.observable(),
            Level : ko.observable(),
            Des : ko.observable(),
            CreateTime : ko.observable()
        };
    },
    // 新增
    operateAdd : function() {
        $('#btn_add').on(
                "click",
                function() {
                    $("#myModal").modal().on(
                            "shown.bs.modal",
                            function() {
                                var oEmptyModel = {
                                    id : ko.observable(),
                                    Name : ko.observable(),
                                    Level : ko.observable(),
                                    Des : ko.observable(),
                                    CreateTime : ko.observable()
                                };
                                ko.utils.extend(operate.DepartmentModel,
                                        oEmptyModel);
                                ko.applyBindings(operate.DepartmentModel,
                                        document.getElementById("myModal"));
                                operate.operateSave();
                            }).on('hidden.bs.modal', function() {
                        ko.cleanNode(document.getElementById("myModal"));
                    });
                });
    },
    // 编辑  修改这里我没有做  如果需要的话  把弹出页面中input中的data-bind中value:name 换成value:你后台传来的变量名称                   
    operateUpdate : function() {
        $('#btn_edit').on(
                "click",
                function() {
                    $("#myModal").modal().on(
                            "shown.bs.modal",
                            function() {
                                var arrselectedData = tableInit.myViewModel
                                        .getSelections();
                                if (!operate.operateCheck(arrselectedData)) {
                                    return;
                                }
                                // 将选中该行数据有数据Model通过Mapping组件转换为viewmodel
                                ko.utils.extend(operate.DepartmentModel,
                                        ko.mapping.fromJS(arrselectedData[0]));
                                ko.applyBindings(operate.DepartmentModel,
                                        document.getElementById("myModal"));
                                operate.operateSave();
                            }).on('hidden.bs.modal', function() {
                        // 关闭弹出框的时候清除绑定(这个清空包括清空绑定和清空注册事件)
                        ko.cleanNode(document.getElementById("myModal"));
                    });
                });
    },
    // 删除
    operateDelete : function() {  //当点击删除的时候  会进入这个方法
        $('#btn_delete').on(
                "click",
                function() {
                    var arrselectedData = $("#tb_departments").bootstrapTable(
                            'getSelections');
                    if (arrselectedData.length <= 0) {
                        alert("请选中一行");
                    } else {
                        var b = JSON.stringify(arrselectedData);
                        $.ajax({
                            url : "/billMaven/categoryDelect",
                            type : "post",
                            data : {
                                "name" : b  //传输到后台的是 json对象 后台接收后需要转换成list  然后循环获取id删除
                            },
                            success : function(status) {
                                alert(status);
                                $("#tb_departments").bootstrapTable('refresh');
                            }
                        });
                    }
                });
    },
    // 保存数据
    operateSave : function() {  //当点击保存的时候回跳到这个方法
        $('#btn_submit').on("click", function() { 
            // 取到当前的viewmodel
            var oViewModel = operate.DepartmentModel;
            // 将Viewmodel转换为数据model
            var oDataModel = ko.toJS(oViewModel);
            if (oDataModel.Name == undefined || oDataModel.Name.trim() == "") {
                alert("类目不能为空");
            } else {
                var span = $("#span").html();
                $.ajax({
                    url : "/billMaven/categorysave",  //url
                    type : "post",
                    data : {   //参数
                        "name" : oDataModel.Name,
                        "state" : span
                    },
                    success : function(status) {
                        alert(status);
                        $("#tb_departments").bootstrapTable('refresh');
                    }
                });
            }
        });
    },
    // 数据校验
    operateCheck : function(arr) {
        if (arr.length <= 0) {
            alert("请至少选择一行数据");
            return false;
        }
        if (arr.length > 1) {
            alert("只能编辑一行数据");
            return false;
        }
        return true;
    }
}