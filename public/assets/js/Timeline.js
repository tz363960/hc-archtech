//接收groups数据
$(document).ready(function () {
    $.ajax({
        async: false,
        url: '/construction-progress/data1',
        type: "GET",
        dataType: "json",
        success: function (data) {
            showAllGroups(data);
        },
        error: function(data){
            alert("Groups数据异常！"+ data)
        }
    });
});
//接收dataset数据
$(document).ready(function () {
    $.ajax({
        url: '/construction-progress/data',
        type: "GET",
        async: false,
        dataType: "json",
        // jsonpCallback:"flightHandler",  
        success: function (data) {
            console.table(data);
            createDataset(data);
        },
        error: function(data){
            alert("dataset数据异常！"+ data)
        }
    });
});

//针对ajax异步问题，将其get的数据使用全部放在本函数中进行，
//在ajax请求success调用本函数
function showAllGroups(_dataGroups) {
    //vis格式数据
    groups = new vis.DataSet(_dataGroups);
    //初始设为全部可见
    groups.forEach(function (group) {
        groups.update({
            id: group.id,
            visible: true
        });
    })
    timeline.setGroups(groups);
};

//同上。针对Dataset的数据传递。
function createDataset(_dataset){
    items = new vis.DataSet(_dataset);
    timeline.setItems(items);
}


// create visualization
var container = document.getElementById('visualization');
var options = {
    groupOrder: function (a, b) {
        return a.value - b.value;
    },
    groupOrderSwap: function (a, b, groups) {
        var v = a.value;
        a.value = b.value;
        b.value = v;
    },
    groupTemplate: function (group) {
        var container = document.createElement('div');
        var label = document.createElement('span');
        label.innerHTML = group.content + ' ';
        container.insertAdjacentElement('afterBegin', label);
        var hide = document.createElement('button');
        hide.innerHTML = 'hide';
        hide.style.fontSize = 'small';
        hide.addEventListener('click', function () {
            groups.update({
                id: group.id,
                visible: false
            });
        });
        container.insertAdjacentElement('beforeEnd', hide);
        return container;
    },
    orientation: 'both',
    editable: true,
    groupEditable: true,
    "start": new Date(2017, 1, 1),
    "end": new Date(2019, 1, 1)
};

var timeline = new vis.Timeline(container);
timeline.setOptions(options);
