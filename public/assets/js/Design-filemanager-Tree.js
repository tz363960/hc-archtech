$(document).ready(function () {
    preparePDFBucketTree();
    //刷新结构树
    $('#refreshPdf').click(function () {
        refreshTree();

    });
    //恢复结构树
    $('#restorePdf').click(function () {
        originalPdf();
    });
    //创建文件夹
    $('#createPDFFolder').click(function () {
        createNewFolder();
    });
})

function createNewFolder() {

}

function refreshTree() {
    $('#pdfBuckets').jstree(true).refresh()
}

function preparePDFBucketTree() {
    $('#pdfBuckets').jstree({
        'core': {
            "animation": 0,
            'check_callback': true,
            'themes': {
                "stripes": true,
                "icons": true
            },
            'data': {
                "url": '/design-filemanager/tree',
                "dataType": "json",
                "data": function (node) {
                    console.log(node);
                    return {
                        'id': node.id
                    };
                },
                'check_callback': true
            }
        },
        'types': {
            'default': {
                'icon': 'glyphicon glyphicon-question-sign'
            },
            '#': {
                'icon': 'glyphicon glyphicon-cloud'
            },
            'folder': {
                'icon': 'glyphicon glyphicon-folder-open'
            },
            'file': {
                'icon': 'glyphicon glyphicon-file'
            }
        },
        "plugins": ["types", "state", "sort", "contextmenu"],
        contextmenu: {
            items: pdfCustomMenu
        }

    }).on('loaded.jstree', function () {
        $('#pdfBuckets').jstree('open_all');
    }).bind("activate_node.jstree", function (evt, data) { //这里的data是选中节点的信息

        if (data.node.children != null && data.node.children.length == 0) {
            // if (tree.is_leaf(node)) {
            console.log("The selected nodes are:");
            console.log(data.node.text);
            PDFObject.embed("assets/pdf/pdf.pdf", "#pdfViewer");
        } else {
            console.log('此节点有下级节点');
        }
    });
}

function pdfCustomMenu(data) {
    var items;

    switch (data.type) {
        case "folder":
            items = {
                uploadFile: {
                    label: "上传文件",
                    action: function () {
                        $("#hiddenUploadField").click()
                    },
                    icon: 'glyphicon glyphicon-cloud-upload'
                },
                deleteFolder: {
                    label: "删除文件夹",
                    action: function () {
                        var treeNode = $('#pdfBuckets').jstree(true).get_selected(true)[0];
                        DeleteFile(treeNode);
                    },
                    icon: 'glyphicon glyphicon-eye-open'
                }
            };
            break;
        case "file":
            items = {
                deleteFile: {
                    label: "删除文件",
                    action: function () {
                        var treeNode = $('#pdfBuckets').jstree(true).get_selected(true)[0];
                        DeleteFile(treeNode);
                    },
                    icon: 'glyphicon glyphicon-eye-open'
                }
            };
            break;
    }
    return items;
}

function uploadFile() {
    //$("#pdfBuckets").empty();
    if (node == null) {
        node = $("#pdfBuckets").jstree(true).get_selected(true)[0]
    };
    //不论node为file还是folder，把自身id和children的id传出去，删除文件或整个文件夹
    var FileID = node.children.concat(node.id);
    $.post({
        url: "/design-filemanager/tree/deletefile",
        contentType: "application/json",
        data: JSON.stringify({
            "FileID": FileID
        }),
        success: function (res) {
            //两秒后自动刷新构件树
            setTimeout(() => {
                $("#pdfBuckets").jstree(true).refresh();
            }, 200);
            //$("#pdfBuckets").html("已经执行删除文件夹操作，并已刷新构件树，请重新选择需要查看的文件。");
        },
    })
}

function DeleteFile(node) {
    //$("#pdfBuckets").empty(); 清空是个SB行为，导致后面jstree无法识别祖先
    if (node == null) {
        node = $("#pdfBuckets").jstree(true).get_selected(true)[0]
    };
    //不论node为file还是folder，把自身id和children的id传出去，删除文件或整个文件夹
    var FileID = node.children.concat(node.id);
    $.post({
        url: "/design-filemanager/tree/deletefile",
        contentType: "application/json",
        data: JSON.stringify({
            "FileID": FileID
        }),
        success: function (res) {
            //200ms后自动刷新构件树
            setTimeout(() => {
                $("#pdfBuckets").jstree(true).refresh();
                $('#pdfBuckets').jstree('open_all');
            }, 200);
        },
    })
}

function originalPdf(node) {
    //逻辑判断，返回bool值
    var IsRestore = true;
    $.post({
        url: "/design-filemanager/tree/restorefile",
        contentType: "application/json",
        data: JSON.stringify({
            "IsRestore": IsRestore
        }),
        success: function (res) {
            //两秒后自动刷新构件树
            setTimeout(() => {
                $("#pdfBuckets").jstree(true).refresh();
            }, 500);
            //$("#pdfBuckets").html("已经执行删除文件夹操作，并已刷新构件树，请重新选择需要查看的文件。");
        },
    })
}