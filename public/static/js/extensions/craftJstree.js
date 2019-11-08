// 工艺库的jstree
$(function () {
    createTree();
    function createTree() {
        $('#jstree_gyk').jstree({
            'core': {
                'data': {
                    'url': function (node) {
                        return node.id === '#' ?
                            '/datas/test.json' :
                            '/datas/test.json';
                    },
                    'data': function (node) {
                        console.log(node);
                        return { 'id': node.id };
                    },
                    'check_callback': true //check_callback：必须为true（否则增删改动作没有反应，这些动作都是需要回调。）
                }
            },
            'types': {  //定义jstree中对象的图标,这样右键菜单才有作用
                'default': {
                    'icon': 'glyphicon glyphicon-question-sign'
                },
                '#': {
                    'icon': 'glyphicon glyphicon-cloud'
                },
                'folder': {
                    'icon': 'glyphicon glyphicon-folder-open'
                },
                'files': {
                    'icon': 'glyphicon glyphicon-file'
                }
            },
            'plugins': ["types", "state", "sort", "contextmenu"],
            contextmenu: { items: editNode }
        }).on('loaded.jstree', function () {
            $('#jstree_gyk').jstree().open_all();
        }).bind("activate_node.jstree", function (evt, data) {	// 可以写入语句表示点击tree后发生的事件

        })
    }

    function editNode(Nodes) {
        var items;
        switch (Nodes.type) {
            case "folder":
                items = {
                    newFolder: {
                        label: "新建子文件夹",
                        icon: 'glyphicon glyphicon-folder-open',
                        action: function () {
                            var treeNode = $('#jstree_gyk').jstree(true).get_selected(true)[0];
                            var dataToServer = treeNode.original;   // object
                            var timestamp = (new Date()).valueOf();
                            var modalPanel = '<div class="modal" style="display: block" id="createFolders" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" id="closeCreateFolder"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">创建新文件夹</h4></div><div class="modal-body"><input type="text" id="newFolderName" class="form-control"></div><div class="modal-footer"><button type="button" class="btn btn-default" id="cancerCreateFolder">取消</button><button type="button" class="btn btn-primary" id="createNewFolder">创建</button></div></div></div></div>';
                            dataToServer.timestamp = timestamp;	// 取时间戳为id
                            $(".content-wrap").append(modalPanel);
                            $("#closeCreateFolder").click(function () {
                                $("#createFolders").remove();
                            });
                            $("#cancerCreateFolder").click(function () {
                                $("#createFolders").remove();
                            });
                            $("#createNewFolder").click(function () {
                                dataToServer.text = $("#newFolderName").val();	// 取得创建文件夹名的值
                                $("#createFolders").remove();
                                $.get("/quality-control/create-folder", dataToServer, function (data) {
                                    $('#jstree_gyk').jstree(true).refresh();
                                });
                            });

                        }
                    },
                    newCraft: {
                        label: "新建工艺",
                        icon: 'glyphicon glyphicon-wrench',
                        action: function () {
                            $('#gykUploadField').click();
                        }
                    },
                    deleteNode: {
                        label: "删除文件夹",
                        icon: 'glyphicon glyphicon-trash',
                        action: function () {
                            var ifDelete = window.confirm("确定删除文件夹及其子文件夹？");
                            if (ifDelete) {
                                var treeNode = $('#jstree_gyk').jstree(true).get_selected(true)[0];
                                var dataToServer = treeNode.original;   // object
                                $.get("/quality-control/delete-folders", dataToServer, function (data) {
                                    $('#jstree_gyk').jstree(true).refresh();
                                    alert(data);
                                });
                            }
                        }
                    }
                };
                break;
            case "files":
                items = {
                    translateFile: {
                        label: "打开",
                        action: function () {
                            var treeNode = $('#jstree_gyk').jstree(true).get_selected(true)[0]; //选中的对象（文件）
                            console.log(treeNode);
                        },
                        icon: 'glyphicon glyphicon-cloud'
                    },
                    deleteFile: {
                        label: "删除文件",
                        action: function () {
                            var ifDelete = window.confirm("确定删除此文件？");
                            if (ifDelete) {
                                var treeNode = $('#jstree_gyk').jstree(true).get_selected(true)[0];
                                var dataToServer = treeNode.original;   // object
                                $.get("/quality-control/delete-files", dataToServer, function (data) {
                                    $('#jstree_gyk').jstree(true).refresh();
                                    alert(data);
                                });
                            }
                        },
                        icon: 'glyphicon glyphicon-trash'
                    }
                };
                break;
        }
        return items;
    }

    $('#refreshFolders').click(function () {
        $('#jstree_gyk').jstree(true).refresh();
    });

    $('#deleteNodes').click(function () {
        var ifDelete = window.confirm("确定删除文件夹及其子文件夹？");
        if (ifDelete) {
            var treeNode = $('#jstree_gyk').jstree(true).get_selected(true)[0];
            var dataToServer = treeNode.original;   // object
            // 在回调函数中刷新jstree
            $.get("/quality-control/delete-node", dataToServer, function (data) { $('#jstree_gyk').jstree(true).refresh(); });
        }
    })

    $('#gykUploadField').change(function () {
        var node = $('#jstree_gyk').jstree(true).get_selected(true)[0];
        var _this = this;
        if (_this.files.length == 0) return;
        var file = _this.files[0];  //这就是this指代$('#gykUploadField')，this.file就是文件框选中的文件

        switch (node.type) {
            case 'folder':
                var timestamp = (new Date()).valueOf();
                var formData = new FormData();
                filename = file.name;
                formData.append('gykFileToUpload', file);
                formData.append('parent', node.id);
                formData.append('id', timestamp);
                formData.append('type', 'files');
                formData.append('text', filename);

                $.ajax({
                    url: '/quality-control/create-files',
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (data) {
                        $('#jstree_gyk').jstree(true).refresh();
                        _this.value = '';   //上一个框已完毕重新刷新this
                        alert(data);
                    }
                });
                break;
        }
    });
})




