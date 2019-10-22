// 加载数据库模块
var mysql = require('mysql');
var _this;
var pingInterval = null;
var db_config = {
    host: "localhost",  //主机地址
    user: "hctech", //数据库用户名
    password: "hc123", //数据库用户密码
    database: "zemenbank"  //数据库名
}
class DB{
    constructor(){
        _this = this;
        this.connection = null;
    }
    handleDisconnect(){
        this.connection = mysql.createConnection(db_config);
        //数据库连接 
        this.connection.connect(function(err) { 
            console.log("Successful connection!");             
            if(err) {                                    
            //   console.log('error when connecting to db:', err);
              setTimeout(_this.handleDisconnect, 2000);
            }                                    
        });                                  
        this.connection.on('error', function(err) {
            if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
                _this.handleDisconnect();                         
            } else {                                     
                throw err;                                 
            }
        });
        // 每个小时ping一次数据库，保持数据库连接状态
        clearInterval(pingInterval);
        pingInterval = setInterval(() => {
            _this.connection.ping((err) => {
                if (err) {
                    console.log('ping error: ' + JSON.stringify(err));
                }
            });
        }, 3600000*3);
        return this.connection;
    }
}

module.exports = DB;