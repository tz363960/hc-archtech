
  
$(document).ready(function () {
  $.ajax({
      url: '/weekly-report/tree',
      async: false,
      type: "GET",
      dataType: "json",
      success: function (data) {
          $(function () {
              $('#pdfBuckets').jstree({
                  //数据结构需要优化，对leaf和parent用不同的icon显示，并加入增删改查功能
                  'core': {
                      'data': data
                  },
                  'types': {
                      'default': {
                          'icon': 'glyphicon glyphicon-asterisk'
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
                  "plugins" : [ "types" ]
              });
              console.table(data);
              $('#pdfBuckets').on("changed.jstree", function (e, data) {
                  node = data.selected;
                  var tree = data.instance;
                  if (tree.is_leaf(node)) {
                      console.log("The selected nodes are:");
                      console.log(data.selected);
                      PDFObject.embed("assets/pdf/pdf.pdf", "#pdfViewer");
                  } else {
                      console.log('此节点有下级节点');
                  }
              });
          });
          
      },
      error: function(data){
          alert("WeeklyRoportTree数据异常！"+ data)
      }
  });
});


// $(document).ready(function () {
//     prepareReportsTree();
// });

function prepareReportsTree() {
    $('#pdfBuckets').jstree({
        "core": {
          "themes": { "icons": true },
          'data': {
            'url': '/weekly-report/tree',
            'type':'GET',
            'async':false,
            'dataType': 'json',
            'data': function (node) {
              console.log(node);
              console.log(node.id);
              return { 'id': node.id };
            }
          }
        },
        "types": {
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
        "plugins": ["types", "contextmenu"],
        contextmenu: { items: reportsCustomMenu }
      })
    //   .on('loaded.jstree', function () {
    //     $('#pdfBuckets').jstree('open_all');
    // }).bind("activate_node.jstree", function (evt, data) {
    //     if (data != null && data.node != null && data.node.type == 'file') {
    //         $("#forgeViewer").empty();
    //     };
    //         node = data.selected;
    //         var tree = data.instance;
    //         if (tree.is_leaf(node)) {
    //             console.log("The selected nodes are:");
    //             console.log(data.selected);
    //             PDFObject.embed("assets/pdf/pdf.pdf", "#pdfViewer");
    //         } else {
    //             console.log('此节点有下级节点');
    //         }
    // });
}

function reportsCustomMenu(ReportsNodes) {
    var items = [];
    switch (ReportsNodes.type) {
        case "folder":
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
        case "file":
            items = {
                translateFile: {
                    label: "Translate",
                    action: function () {
                        var treeNode = $('#pdfBuckets').jstree(true).get_selected(true)[0];
                        translateObject(treeNode);
                    },
                    icon: 'glyphicon glyphicon-eye-open'
                }
            };
            break;
    }

    return items;
}

// $(document).ready(function () {
//     $.ajax({
//         url: '/weekly-report/tree',
//         async: false,
//         type: "GET",
//         dataType: "json",
//         success: function (data) {
//             $(function () {
//                 $('#pdfBuckets').jstree({
//                     //数据结构需要优化，对leaf和parent用不同的icon显示，并加入增删改查功能
//                     'core': {
//                         'data': data,
//                         'check_callback': true
//                     },
//                     'types': {
//                         'default': {
//                             'icon': 'glyphicon glyphicon-asterisk'
//                         },
//                         '#': {
//                             'icon': 'glyphicon glyphicon-cloud'
//                         },
//                         'folder': {
//                             'icon': 'glyphicon glyphicon-folder-open'
//                         },
//                         'file': {
//                             'icon': 'glyphicon glyphicon-file'
//                         }
//                     },
//                     "plugins" : ["types"]
//                 });

//                 $('#pdfBuckets').on("changed.jstree", function (e, data) {
//                     node = data.selected;
//                     var tree = data.instance;
//                     if (tree.is_leaf(node)) {
//                         console.log("The selected nodes are:");
//                         console.log(data.selected);
//                         PDFObject.embed("assets/pdf/pdf.pdf", "#pdfViewer");
//                     } else {
//                         console.log('此节点有下级节点');
//                     }
//                 });
//             });
//             console.log(data);
//         },
//         error: function(data){
//             alert("WeeklyRoportTree数据异常！"+ data)
//         }
//     });
// });