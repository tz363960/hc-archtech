'use strict';

(function($){

  $(function() {

    var datascource = {
      'name': '业主',
      'title': 'Zemen Bank',
      'children': [
        { 'name': '监理', 'title': 'JDAW' },
        { 'name': '总包', 'title': 'China Wuyi',
          'children': [
            { 'name': '项目经理', 'title': '林魏' ,
              'children': [
                { 'name': '施工经理', 'title': '林毅' },
                { 'name': 'HSE负责人', 'title': '陈建华',
                'children':[
                  {'name':'土建施工队长','title':'黄绍斌'},
                  {'name': '土建施工技术员','title':'赵光耀'},
                ]
              },
                { 'name': '项目总工程师', 'title': '黄跃明' }
              ]
            }
          ]
        },
      ]
    };

    $('#chart-container').orgchart({
      'data' : datascource,
      'nodeContent': 'title',
      'pan': true,
      'zoom': true,
      'exportButton': true,
      'exportFilename':'MyOrgChart'
    });

  });

})(jQuery);