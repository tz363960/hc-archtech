$(document).ready(function () {
    prepareAppBucketTree();
    $('#refreshBuckets').click(function () {
        $('#appBuckets').jstree(true).refresh();
    });

    $('#createNewBucket').click(function () {
        createNewBucket();
    });

    $('#createBucketModal').on('shown.bs.modal', function () {
        $("#newBucketKey").focus();
    })

    $('#hiddenUploadField').change(function () {
        var node = $('#appBuckets').jstree(true).get_selected(true)[0];
        var _this = this;
        if (_this.files.length == 0) return;
        var file = _this.files[0];
        switch (node.type) {
            case 'bucket':
                var formData = new FormData();
                formData.append('fileToUpload', file);
                formData.append('bucketKey', node.id);

                $.ajax({
                    url: '/api/forge/oss/objects',
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (data) {
                        $('#appBuckets').jstree(true).refresh_node(node);
                        _this.value = '';
                    }
                });
                break;
        }
    });
});

//创建新的Bucket
function createNewBucket() {
    var bucketKey = $('#newBucketKey').val();
    var policyKey = $('#newBucketPolicyKey').val();
    jQuery.post({
        url: '/api/forge/oss/buckets',
        contentType: 'application/json',
        data: JSON.stringify({ 'bucketKey': bucketKey, 'policyKey': policyKey }),
        success: function (res) {
            $('#appBuckets').jstree(true).refresh();
            $('#createBucketModal').modal('toggle');
        },
        error: function (err) {
            if (err.status == 409)
                alert('Bucket already exists - 409: Duplicated')
            console.log(err);
        }
    });
}

function prepareAppBucketTree() {
    $('#appBuckets').jstree({
        'core': {
            'themes': { "icons": true },
            'data': {
                "url": '/api/forge/oss/buckets',
                "dataType": "json",
                'multiple': false,
                "data": function (node) {
                    return { "id": node.id };
                }
            }
        },
        'types': {
            'default': {
                'icon': 'glyphicon glyphicon-question-sign'
            },
            '#': {
                'icon': 'glyphicon glyphicon-cloud'
            },
            'bucket': {
                'icon': 'glyphicon glyphicon-folder-open'
            },
            'object': {
                'icon': 'glyphicon glyphicon-file'
            }
        },
        "plugins": ["types", "state", "sort", "contextmenu"],
        contextmenu: { items: autodeskCustomMenu }
    }).on('loaded.jstree', function () {
        $('#appBuckets').jstree('open_all');
        }).bind("activate_node.jstree", function (evt, data) {

            console.log(data.node);

        if (data != null && data.node != null && data.node.type == 'object') {
            $("#forgeViewer").empty();
            var urn = data.node.id;
            getForgeToken(function (access_token) {
                jQuery.ajax({
                    url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn + '/manifest',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    success: function (res) {
                        if (res.status === 'success') launchViewer(urn);
                        else $("#forgeViewer").html('客官，云儿还在为您转码，转码状态： ' + res.progress + '，请稍后光顾。');
                    },
                    error: function (err) {
                        var msgButton = '文件尚未转码 ' +
                            '<button class="btn btn-xs btn-info" onclick="translateObject()"><span class="glyphicon glyphicon-eye-open"></span> ' +
                            'Start translation</button>'
                        $("#forgeViewer").html(msgButton);
                    }
                });
            })
        }
    });
}

function autodeskCustomMenu(autodeskNode) {
    var items;

    switch (autodeskNode.type) {
        case "bucket":
            items = {
                uploadFile: {
                    label: "Upload file",
                    action: function () {
                        uploadFile();
                    },
                    icon: 'glyphicon glyphicon-cloud-upload'
                }
            };
            break;
        //实际文件，可为rvt,nws,pdf,dwg等70种格式 https://forge.autodesk.com/en/docs/model-derivative/v2/developers_guide/supported-translations/
        case "object":
            items = {
                translateFile: {
                    label: "Translate",
                    action: function () {
                        var treeNode = $('#appBuckets').jstree(true).get_selected(true)[0];
                        translateObject(treeNode);
                    },
                    icon: 'glyphicon glyphicon-eye-open'
                },
                deleteObject: {
                    label: "Delete",
                    action: function () {
                        var treeNode = $('#appBuckets').jstree(true).get_selected(true)[0];
                        deleteObject(treeNode);
                    },
                    icon: 'glyphicon glyphicon-trash'
                }
            };
            break;
    }
    return items;
}

function uploadFile() {
    $('#hiddenUploadField').click();
}

function deleteFile() {
    $('#hiddenDeleteField').click();
}

function translateObject(node) {
    $("#forgeViewer").empty();
    if (node == null) node = $('#appBuckets').jstree(true).get_selected(true)[0];
    var bucketKey = node.parents[0];
    var objectKey = node.id;
    console.log('translate bucketkey    ' + bucketKey);
    console.log('translate objectkey    ' + objectKey);
    jQuery.post({
        url: '/api/forge/modelderivative/jobs',
        contentType: 'application/json',
        data: JSON.stringify({ 'bucketKey': bucketKey, 'objectName': objectKey }),
        success: function (res) {
            $("#forgeViewer").html('开始转码，稍安勿躁。');
        },
    });
}

function deleteObject(node) {
    $("#forgeViewer").empty();
    if (node == null) node = $('#appBuckets').jstree(true).get_selected(true)[0];
    var bucketKey = node.parents[0];
    var objectKey = node.id;
    console.log(bucketKey);
    console.log(objectKey);

    jQuery.post({
        url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/'+'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2hocWl2czJvaWNhZGdnaHBndnhkYzBoZHpzdXFhM3gtdGVtcG9yYXJ5L3JhY19iYXNpY19zYW1wbGVfcHJvamVjdC5ydnQ'+'/manifest',
        contentType: 'application/json',
        //Authorization: 'CkaGc1RUVaIfOQhy',
        type: 'delete',
        data: JSON.stringify({ 'bucketKey': bucketKey, 'objectName': objectKey }),
        success: function (res) {
            $("#forgeViewer").html('成功删除。');
        },
    });
}