(function () {  // (function () {}())表示立即执行函数

    var forgedb = {     // 声明一个forgedb对象

        loadData: function (filter) {
            return $.grep(this.clients, function (client) {  //grep使用指定的函数过滤数组中的元素，并返回过滤后的数组
                return (!filter.Title || client.Title.indexOf(filter.Title) > -1)   //indexOf()方法可返回某个指定的字符串值在字符串中首次出现的位置
                    && (filter.Type === undefined || client.Type === filter.Type)   //如果类型不同，就[不相等] 如果两个都是数值，并且是同一个值，那么[相等]；
                    && (!filter.CreatedBy || client.CreatedBy.indexOf(filter.CreatedBy) > -1)
                    && (!filter.ModifiedBy || client.ModifiedBy === filter.ModifiedBy)
                    && (filter.AssignedTo === undefined || client.AssignedTo === filter.AssignedTo)
                    && (filter.Priority === undefined || client.Priority === filter.Priority)
                    && (filter.Status === undefined || client.Status === filter.Status)
                    && (filter.Major === undefined || client.Major === filter.Major);
            });
        },

        insertItem: function (insertingClient) {
            this.clients.push(insertingClient);
        },

        updateItem: function (updatingClient) { },

        deleteItem: function (deletingClient) {
            var clientIndex = $.inArray(deletingClient, this.clients);
            this.clients.splice(clientIndex, 1);
        }

    };

    window.forgedb = forgedb;


    forgedb.engineers = [   //数组，都以[开头
        { Title: "", Id: 0 },
        { Title: "建筑", Id: 1 },
        { Title: "结构", Id: 2 },
        { Title: "暖通", Id: 3 },
        { Title: "给排水", Id: 4 },
        { Title: "电气", Id: 5 },
        { Title: "消防", Id: 6 },
        { Title: "施工", Id: 7 }
    ];

    forgedb.priorities = [
        { Title: "", Id: 0 },
        { Title: "紧急", Id: 1 },
        { Title: "一般", Id: 2 },
        { Title: "正常", Id: 3 },
        { Title: "主要", Id: 4 },
        { Title: "微小", Id: 5 }
    ];

    // var myJson0=$.getJSON('fgdata.json');
    // var myJson1=myJson0.responseJSON;
    // var myJson2=JSON.stringify(myJson1);
    // forgedb.clients = myJson2;
    forgedb.clients = [{ "ID": 1, "Title": "墙保温图层修改", "Type": "错误", "CreatedBy": "张正会", "ModifiedBy": "2015-05-06 00:00:00", "AssignedTo": "秦正根", "Priority": "紧急", "Status": "未完成", "Major": "结构" }, { "ID": 2, "Title": "墙保温图层修改", "Type": "评论", "CreatedBy": "周建华", "ModifiedBy": "2019-05-27 14:25:08", "AssignedTo": "秦正根", "Priority": "正常", "Status": "未完成", "Major": "结构" }, { "ID": 3, "Title": "钢筋配筋修改", "Type": "事务", "CreatedBy": "秦正根", "ModifiedBy": "2019-05-27 14:26:13", "AssignedTo": "秦正根", "Priority": "主要", "Status": "未完成", "Major": "建筑" }, { "ID": 4, "Title": "墙保温图层修改", "Type": "评论", "CreatedBy": "周建华", "ModifiedBy": "2019-05-27 14:26:20", "AssignedTo": "秦正根", "Priority": "紧急", "Status": "未完成", "Major": "暖通" }, { "ID": 5, "Title": "钢筋配筋修改", "Type": "电脑", "CreatedBy": "周建华", "ModifiedBy": "2019-05-27 14:26:28", "AssignedTo": "秦正根", "Priority": "紧急", "Status": "未完成", "Major": "暖通" }, { "ID": 7, "Title": "墙保温图层修改", "Type": "评论", "CreatedBy": "周建华", "ModifiedBy": "2019-05-27 14:28:01", "AssignedTo": "秦正根", "Priority": "紧急", "Status": "未完成", "Major": "建筑" }, { "ID": 9, "Title": "厨房设备", "Type": "热水壶", "CreatedBy": "左何开", "ModifiedBy": "2019-05-27 14:29:19", "AssignedTo": "秦正根", "Priority": "次要", "Status": "未完成", "Major": "结构" }, { "ID": 10, "Title": "钢筋配筋修改", "Type": "办公桌", "CreatedBy": "64", "ModifiedBy": "2019-05-27 14:29:19", "AssignedTo": "秦正根", "Priority": "紧急", "Status": "未完成", "Major": "结构" }, { "ID": 11, "Title": "钢筋配筋修改", "Type": "电脑", "CreatedBy": "周建华", "ModifiedBy": "2019-05-27 14:26:28", "AssignedTo": "秦正根", "Priority": "紧急", "Status": "未完成", "Major": "建筑" }, { "ID": 12, "Title": "墙保温图层修改", "Type": "评论", "CreatedBy": "周建华", "ModifiedBy": "2019-05-27 14:28:01", "AssignedTo": "秦正根", "Priority": "正常", "Status": "未完成", "Major": "暖通" }, { "ID": 13, "Title": "墙保温图层修改", "Type": "错误", "CreatedBy": "周建华", "ModifiedBy": "2019-05-27 14:28:01", "AssignedTo": "秦正根", "Priority": "主要", "Status": "未完成", "Major": "结构" }, { "ID": 14, "Title": "厨房设备", "Type": "热水壶", "CreatedBy": "左何开", "ModifiedBy": "2019-05-27 14:29:19", "AssignedTo": "秦正根", "Priority": "紧急", "Status": "未完成", "Major": "结构" }, { "ID": 15, "Title": "钢筋配筋修改", "Type": "办公桌", "CreatedBy": "64", "ModifiedBy": "2019-05-27 14:29:19", "AssignedTo": "秦正根", "Priority": "紧急", "Status": "未完成", "Major": "结构" }, { "ID": 16, "Title": "墙保温图层修改", "Type": "评论", "CreatedBy": "周建华", "ModifiedBy": "2019-05-27 14:29:19", "AssignedTo": "秦正根", "Priority": "紧急", "Status": "未完成", "Major": "结构" }, { "ID": 17, "Title": "墙保温图层修改", "Type": "评论", "CreatedBy": "周建华", "ModifiedBy": "2019-05-27 14:29:19", "AssignedTo": "秦正根", "Priority": "次要", "Status": "未完成", "Major": "结构" }, { "ID": 18, "Title": "墙保温图层修改", "Type": "评论", "CreatedBy": "周建华", "ModifiedBy": "2019-05-27 14:29:19", "AssignedTo": "秦正根", "Priority": "紧急", "Status": "未完成", "Major": "结构" }, { "ID": 19, "Title": "钢筋配筋修改", "Type": "电脑", "CreatedBy": "76", "ModifiedBy": "2016-06-08 00:00:00", "AssignedTo": "秦正根", "Priority": "紧急", "Status": "未完成", "Major": "结构" }, { "ID": 20, "Title": "墙保温图层修改", "Type": "评论", "CreatedBy": "周建华", "ModifiedBy": "2019-05-28 18:02:05", "AssignedTo": "周建华", "Priority": "紧急", "Status": "已完成", "Major": "结构ER" }, { "ID": 21, "Title": "钢筋配筋修改", "Type": "电脑", "CreatedBy": "76", "ModifiedBy": "2016-06-08 00:00:00", "AssignedTo": "秦正根", "Priority": "紧急", "Status": "未完成", "Major": "结构" }];
}());