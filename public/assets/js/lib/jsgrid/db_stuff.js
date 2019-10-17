(function() {

    var db = {

        loadData: function(filter) {
            return $.grep(this.clients, function(client) {
                return (!filter.Name || client.Name.indexOf(filter.Name) > -1)
                    && (filter.Age === undefined || client.Age === filter.Age)
                    && (!filter.Address || client.Address.indexOf(filter.Address) > -1)
                    && (!filter.Country || client.Country === filter.Country)
                    && (filter.Married === undefined || client.Married === filter.Married);
            });
        },

        insertItem: function(insertingClient) {
            this.clients.push(insertingClient);
        },

        updateItem: function(updatingClient) { },

        deleteItem: function(deletingClient) {
            var clientIndex = $.inArray(deletingClient, this.clients);
            this.clients.splice(clientIndex, 1);
        }

    };

    window.db = db;

//countries 实为部门
    db.countries = [
        { Name: "", Id: 0 },
        { Name: "设计部", Id: 1 },
        { Name: "经营部", Id: 2 },
        { Name: "工程部", Id: 3 },
        { Name: "安全部", Id: 4 },
        { Name: "审计部", Id: 5 },
        { Name: "财务部", Id: 6 },
        { Name: "运维部", Id: 7 }
    ];

    db.clients = [
        {
            "姓名": "张杰",
            "单位": "福建建工",
            "部门": 4,
            "联系电话": '1856252562',
            "账号": "zj@hc.com",
            "是否为管理员": false
        },
        {
            "姓名": "胡伟化",
            "单位": "中国武夷",
            "部门": 6,
            "联系电话": '1856252562',
            "账号": "hwh@hc.com",
            "Married": false
        },
        {
            "姓名": "叶剑",
            "单位": "福建建工",
            "部门": 7,
            "联系电话": '1856252562',
            "账号": "jy1@hc.com",
            "Married": false
        },
        {
            "姓名": "叶宝生",
            "单位": "中国武夷",
            "部门": 3,
            "联系电话": '1856252562',
            "账号": "ybs@hc.com",
            "Married": false
        },
        {
            "姓名": "谢海建",
            "单位": "福建建工",
            "部门": 2,
            "联系电话": '1856252562',
            "账号": "xhj@hc.com",
            "Married": false
        },
        {
            "姓名": "李世明",
            "单位": "中国武夷",
            "部门": 2,
            "联系电话": '1856252562',
            "账号": "lsm@hc.com",
            "Married": false
        },
        {
            "姓名": "张九林",
            "单位": "福建建工",
            "部门": 4,
            "联系电话": '1856252562',
            "账号": "zjl@hc.com",
            "Married": false
        },
        {
            "姓名": "叶官保",
            "单位": "福建建工",
            "部门": 7,
            "联系电话": '1856252562',
            "账号": "ygb@hc.com",
            "Married": false
        },
        {
            "姓名": "上官铃木",
            "单位": "中国武夷",
            "部门": 5,
            "联系电话": '1856252562',
            "账号": "sglm@hc.com",
            "Married": false
        },
        {
            "姓名": "Bruce",
            "单位": "中国武夷",
            "部门": 6,
            "联系电话": '1856252562',
            "账号": "bruce@hc.com",
            "Married": false
        },
        {
            "姓名": "薛佳音",
            "单位": "中国武夷",
            "部门": 3,
            "联系电话": '1856252562',
            "账号": "xjy@hc.com",
            "Married": false
        },
        {
            "姓名": "刘伟",
            "单位": "福建建工",
            "部门": 3,
            "联系电话": '1856252562',
            "账号": "lw@hc.com",
            "Married": false
        },
        {
            "姓名": "张久生",
            "单位": "福建建工",
            "部门": 6,
            "联系电话": '1856252562',
            "账号": "zjs@hc.com",
            "Married": false
        },
        {
            "姓名": "吴可嘉",
            "单位": "福建建工",
            "部门": 6,
            "联系电话": '1856252562',
            "账号": "wkj@hc.com",
            "Married": false
        },
        {
            "姓名": "周恩月",
            "单位": "福建建工",
            "部门": 3,
            "联系电话": '1856252562',
            "账号": "zey@hc.com",
            "Married": true
        },
        {
            "姓名": "叶佳应",
            "单位": "福建建工",
            "部门": 6,
            "联系电话": '1856252562',
            "账号": "huih1@hc.com",
            "Married": false
        },
        {
            "姓名": "陈世家",
            "单位": "福建建工",
            "部门": 6,
            "联系电话": '1856252562',
            "账号": "csj@hc.com",
            "Married": false
        },
        {
            "姓名": "海月",
            "电话": 1824254262,
            "部门": 5,
            "账号": "hy@hc.com",
            "Married": true
        },
        {
            "姓名": "李月明",
            "电话": 1856252562,
            "部门": 6,
            "账号": "huih1@hc.com",
            "Married": false
        },
        {
            "姓名": "李秋佳",
            "电话": 1856354262,
            "部门": 3,
            "账号": "huih2@hc.com",
            "Married": true
        },
        {
            "姓名": "吴海印",
            "电话": 1825254262,
            "部门": 7,
            "账号": "huih3@hc.com",
            "Married": false
        },
        {
            "姓名": "张悦",
            "电话": 1856554262,
            "部门": 6,
            "账号": "huih9@hc.com",
            "Married": true
        },
        {
            "姓名": "吴世来",
            "电话": 1824254262,
            "部门": 5,
            "账号": "huih4@hc.com",
            "Married": true
        },
        {
            "姓名": "周建明",
            "电话": 1856252562,
            "部门": 6,
            "账号": "huih1@hc.com",
            "Married": false
        },
        {
            "姓名": "诸葛璋",
            "电话": 1856354262,
            "部门": 3,
            "账号": "huih2@hc.com",
            "Married": true
        },
        {
            "姓名": "潘婷",
            "电话": 1825254262,
            "部门": 7,
            "账号": "huih3@hc.com",
            "Married": false
        },
        {
            "姓名": "蔡一银",
            "电话": 1856554262,
            "部门": 6,
            "账号": "huih9@hc.com",
            "Married": true
        },
        {
            "姓名": "岳世来",
            "电话": 1824254262,
            "部门": 5,
            "账号": "huih4@hc.com",
            "Married": true
        },
        {
            "姓名": "张一",
            "电话": 1856252562,
            "部门": 6,
            "账号": "huih1@hc.com",
            "Married": false
        },
        {
            "姓名": "张二",
            "电话": 1856354262,
            "部门": 3,
            "账号": "huih2@hc.com",
            "Married": true
        },
        {
            "姓名": "张三",
            "电话": 1825254262,
            "部门": 7,
            "账号": "huih3@hc.com",
            "Married": false
        },
        {
            "姓名": "张四",
            "电话": 1856554262,
            "部门": 6,
            "账号": "huih9@hc.com",
            "Married": true
        },
        {
            "姓名": "张五",
            "电话": 1824254262,
            "部门": 5,
            "账号": "huih4@hc.com",
            "Married": true
        },
        {
            "姓名": "张九",
            "电话": 1856244262,
            "部门": 1,
            "账号": "huih8@hc.com",
            "Married": false
        }
     ];
}());