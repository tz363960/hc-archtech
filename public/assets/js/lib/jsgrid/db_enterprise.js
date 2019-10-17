(function() {

    var db_enterprise = {

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

    window.db_enterprise = db_enterprise;

    db_enterprise.clients = [
        {
            "单位名称": "埃塞俄比亚做泽门银行",
            "单位资质": '业主',
            "联系人": "Bruce Vor Doppler",
            "联系人电话": "00251-16442563",
        },
        {
            "单位名称": "福建建工集团",
            "单位资质": '总承包',
            "联系人": "王志成",
            "联系人电话": "18562972345",
        },
        {
            "单位名称": "福建建工设计院",
            "单位资质": '设计单位',
            "联系人": "李世超",
            "联系人电话": "18458967237",
        },
        {
            "单位名称": "福建建工集团",
            "单位资质": '施工方',
            "联系人": "林南中",
            "联系人电话": "18963242375",
        }
     ];
}());