        $(function() {

            $("#jsGrid_stuff").jsGrid({
                height: "100%",
                width: "100%",
                filtering: false,
                editing: true,
                inserting: true,
                sorting: true,
                paging: true,
                autoload: true,
                pageSize: 15,
                pageButtonCount: 5,
                deleteConfirm: "Do you really want to delete the client?",
                controller: db,
                fields: [
                    { name: "姓名", type: "text", width: 100 },
                    { name: "单位", type: "text", width: 100 },
                    { name: "部门", type: "select", items: db.countries, valueField: "Id", textField: "Name" },
                    { name: "联系电话", type: "text", width: 100 },
                    { name: "账号", type: "text", width: 100 },
                    { name: "是否为管理员", type: "checkbox", title: "是否为管理员", sorting: false },
                    { type: "control" }
                ]
            });

        });