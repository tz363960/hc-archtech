        $(function() {

            $("#jsGrid_enterprise").jsGrid({
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
                controller: db_enterprise,
                fields: [
                    { name: "单位名称", type: "text", width: 100 },
                    { name: "单位资质", type: "text", width: 100 },
                    { name: "联系人", type: "text", width: 100 },
                    { name: "联系人电话", type: "text", width:100},
                    { type: "control" }
                ]
            });

        });