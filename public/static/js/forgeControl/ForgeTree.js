/*
*
*数据传递给modelderivative
*功能包括：
*1.文件夹创建、查看、删除
*2.文件创建、转码、查看、删除
*3.构件树变更提醒、自动刷新
*
*/

$(document).ready(function () {
    prepareAppBucketTree();
    $("#refreshBuckets").click(function () {
        $("#appBuckets").jstree(true).refresh()
    });
    $("#createNewBucket").click(function () {
        createNewBucket()
    });
    $("#createBucketModal").on("shown.bs.modal", function () {
        $("#newBucketKey").focus()
    });
    $("#hiddenUploadField").change(function () {
        var node = $("#appBuckets").jstree(true).get_selected(true)[0];
        var _this = this;
        if (_this.files.length == 0) {
            return
        }
        var file = _this.files[0];
        switch (node.type) {
            case "bucket":
                var formData = new FormData();
                formData.append("fileToUpload", file);
                formData.append("bucketKey", node.id);
                $.ajax({
                    url: "/api/forge/oss/objects",
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: "POST",
                    success: function (data) {
                        $("#appBuckets").jstree(true).refresh_node(node);
                        _this.value = ""
                    }
                });
                break
        }
    })
});

function createNewBucket() {
    var bucketKey = $("#newBucketKey").val();
    var policyKey = $("#newBucketPolicyKey").val();
    $.post({
        url: "/api/forge/oss/buckets",
        contentType: "application/json",
        data: JSON.stringify({
            "bucketKey": bucketKey,
            "policyKey": policyKey
        }),
        success: function (res) {
            $("#appBuckets").jstree(true).refresh();
            $("#createBucketModal").modal("toggle")
        },
        error: function (err) {
            if (err.status == 409) {
                alert("Bucket已存在 - 409: Duplicated")
            }
            console.log(err)
        }
    })
}

function prepareAppBucketTree() {
    $("#appBuckets").jstree({
        "core": {
            "themes": {
                "icons": true
            },
            "data": {
                "url": "/api/forge/oss/buckets",
                "dataType": "json",
                "multiple": false,
                "data": function (node) {
                    return {
                        "id": node.id
                    }
                }
            }
        },
        "types": {
            "default": {
                "icon": "glyphicon glyphicon-question-sign"
            },
            "#": {
                "icon": "glyphicon glyphicon-cloud"
            },
            "bucket": {
                "icon": "glyphicon glyphicon-folder-open"
            },
            "object": {
                "icon": "glyphicon glyphicon-file"
            }
        },
        "plugins": ["types", "state", "sort", "contextmenu"],
        contextmenu: {
            items: autodeskCustomMenu
        }
    }).on("loaded.jstree", function () {    // 这一步载入数据
        $("#appBuckets").jstree("open_all")
    }).bind("activate_node.jstree", function (evt, data) {
        if (data != null && data.node != null && data.node.type == "object") {
            $("#MyViewerDiv").empty();
            var urn = data.node.id;
            getForgeToken(function (access_token) {
                $.ajax({
                    url: "https://developer.api.autodesk.com/modelderivative/v2/designdata/" + urn + "/manifest",
                    headers: {
                        "Authorization": "Bearer " + access_token
                    },
                    success: function (res) {
                        if (res.status === "success") {
                            launchViewer(urn)
                        } else {
                            $("#MyViewerDiv").html("" + res.progress + "")
                        }
                    },
                    error: function (err) {
                        var msgButton = "This file is not translated yet! " + '<button class="btn btn-xs btn-info" onclick="translateObject()"><span class="glyphicon glyphicon-eye-open"></span> ' + "Start translation</button>";
                        $("#MyViewerDiv").html(msgButton)
                    }
                })
            })
        }
    })
}

function autodeskCustomMenu(autodeskNode) {
    var items;
    switch (autodeskNode.type) {
        case "bucket":
            items = {
                uploadFile: {
                    label: "上传文件",
                    action: function () {
                        $("#hiddenUploadField").click()
                    },
                    icon: "glyphicon glyphicon-cloud-upload"
                },
                deleteBucket: {
                    label: "删除文件夹",
                    action: function () {
                        //删除确认
                        if (confirm("删除不可恢复，确定删除吗？")) {
                            var treeNode = $("#appBuckets").jstree(true).get_selected(true)[0];
                            deleteBucket(treeNode);
                        }
                    },
                    icon: 'glyphicon glyphicon-trash'
                }
            };
            break;
        case "object":
            items = {
                translateFile: {
                    label: "文件转码",
                    action: function () {
                        var treeNode = $("#appBuckets").jstree(true).get_selected(true)[0];
                        translateObject(treeNode)
                    },
                    icon: "glyphicon glyphicon-eye-open"
                },
                deleteFile: {
                    label: "删除文件",
                    action: function () {
                        if (confirm("删除不可恢复，确定删除吗？")) {
                            var treeNode = $("#appBuckets").jstree(true).get_selected(true)[0];
                            deleteButton(treeNode);
                        }
                    },
                    icon: 'glyphicon glyphicon-trash'
                }
            };
            break
    }
    return items
}

// ...........................................................................................................................//
//删除Bucket：如Bucket内有object，则可以一并删除
//后端调用格式：bucketsApi.deleteBucket(bucketKey, oauth2client, credentials)，故仅需bucketKey
function deleteBucket(node) {
    $("#MyViewerDiv").empty();
    if (node == null) {
        node = $("#appBuckets").jstree(true).get_selected(true)[0]
    }
    //bucketKey形式为：FORGE_CLIENT_ID-folderName，如shhqivs2oicadgghpgvxdc0hdzsuqa3x-deletetest
    var bucketKey = node.id;
    $.post({
        url: "/api/forge/modelderivative/jobs/deletebucket",
        contentType: "application/json",
        data: JSON.stringify({
            "bucketKey": bucketKey
        }),
        success: function (res) {
            //两秒后自动刷新构件树
            setTimeout(() => {
                $("#appBuckets").jstree(true).refresh();
            }, 2000);
            $("#MyViewerDiv").html("已经执行删除文件夹操作，并已刷新构件树，请重新选择需要查看的文件。");
        },
    })
}
// ...........................................................................................................................//
//删除object
//后端调用格式为：objectsApi.deleteObject(bucketKey,fileName,oAuth2TwoLegged, oAuth2TwoLegged.getCredentials())
function deleteButton(node) {
    $("#MyViewerDiv").empty();
    if (node == null) {
        node = $("#appBuckets").jstree(true).get_selected(true)[0]
    }
    //bucketKey形式为：FORGE_CLIENT_ID-folderName，如:shhqivs2oicadgghpgvxdc0hdzsuqa3x-deletetest
    //RealName形式为：实际文件名，如:Zemen—整合模型.rvt
    var bucketKey = node.parents[0];
    var RealName = node.text;
    $.post({
        url: "/api/forge/modelderivative/jobs/deleteobject",
        contentType: "application/json",
        data: JSON.stringify({
            "bucketKey": bucketKey,
            "fileRealName": RealName
        }),
        success: function (res) {
            setTimeout(() => {
                $("#appBuckets").jstree(true).refresh();
            }, 2000);
            $("#MyViewerDiv").html("已经执行删除文件操作，并已刷新构件树，请重新选择需要查看的文件。");
        },
    })
}

// ...........................................................................................................................//
//文件转码
function translateObject(node) {
    $("#MyViewerDiv").empty();
    if (node == null) {
        node = $("#appBuckets").jstree(true).get_selected(true)[0]
    }
    var bucketKey = node.parents[0];
    var objectKey = node.id;
    $.post({
        url: "/api/forge/modelderivative/jobs",
        contentType: "application/json",
        data: JSON.stringify({
            "bucketKey": bucketKey,
            "objectName": objectKey
        }),
        success: function (res) {
            $("#MyViewerDiv").html("开始转码! 稍等片刻。")
        },
    })
};

