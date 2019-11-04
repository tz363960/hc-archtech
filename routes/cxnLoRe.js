const path = require('path');
const express = require('express');
const fs = require('fs'); //文件模块
const exec = require('child_process').exec;
const multiparty = require('multiparty');
const cookieParse = require('cookie-parser');
const mysql = require('mysql');
const md5 = require('md5');
const config = require('../config');

let app = express();
app.use(cookieParse());

//登录拦截器,这个一定要放在express.static前面防止静态的favicon.ico影响程序运行
var cookieLogin = { //储存在服务器端的token
    tokens: [],
    times: []
};
app.use(function (req, res, next) { //登录拦截器,这个一定要放在express.static前面防止静态的favicon.ico影响程序运行
    var url = req.path; //获取浏览器中当前访问的nodejs路由地址；
    var userCookies = req.cookies.ift; //获取客户端存取的cookie,userCookies为cookie的名称

    if (url == '/forge-table.html') {
        var limitN = cookieLogin.tokens.length;
        if (limitN) {
            for (var i = 0; i < limitN; i++) {
                if (new Date().getTime() - cookieLogin.times[i] > 6000000) { // 大于100分钟的token就删除
                    cookieLogin.times.splice(i, 1);
                    cookieLogin.tokens.splice(i, 1);
                    if (i != 0) { i--; }
                }
            }
        }
        if (userCookies == undefined) {
            return res.redirect('/page-login.html');
        }
        else {
            if (!cookieLogin.tokens.includes(userCookies)) { //通过判断控制用户登录后不能访问登录页面；
                return res.redirect('/page-login.html');
            }
        }
    }
    next(); // 调用的话,继续向下传递.. 不调用就终止
});


// 注册界面操作
app.post('/Account/Hcregister', function (req, res) {
    var form = new multiparty.Form({ uploadDir: './uploads' });
    var sqlconnection = mysql.createConnection(config.sqlconnection);
    sqlconnection.connect();

    // 读取数据
    function sqlRead() {
        var p = new Promise(function (resolve, reject) {    // 用promise的resolve把数据传到then后面的函数中
            var sql = 'SELECT * FROM uidpswd';              // reject把数据传到catch后面的函数中
            //查
            sqlconnection.query(sql, (err, result) => {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }
                resolve(result);
            })
        });
        return p;
    }

    form.parse(req, function (err, fields) {
        sqlRead().then((data) => {
            replyDate = {
                message: '',
                state: ''
            };
            if (err) {
                res.send('网络存在问题');
            } else {
                var toDoJson = data;
                var n = 0;
                if (fields.userName[0].indexOf("'") >= 0 || fields.userName[0].indexOf('"') >= 0 || fields.password[0].indexOf("'") >= 0 || fields.password[0].indexOf('"') >= 0) {
                    res.send('存在非法字符');
                }
                else {
                    for (var i = 0; i < toDoJson.length; i++) {
                        if (toDoJson[i].userName == fields.userName[0]) {   //这个是文件夹本身
                            n++;
                        }
                    }
                    if (n > 0) {
                        replyDate.message = '账号已存在';
                        replyDate.state = 'exist';
                        res.send(replyDate);
                    }
                    else {
                        // toDoJson.push({ userName: fields.userName[0], phones: fields.phones[0], name: fields.name[0], password: md5(fields.password[0]) });
                        // fs.writeFileSync('public/datas/useridpswd.json', JSON.stringify(toDoJson), function (err) {
                        // });

                        var addsql = 'insert into uidpswd(userName,phones,name,password) values(?,?,?,?)';
                        var addsqlparam = [fields.userName[0], fields.phones[0], fields.name[0], md5('cxnha' + fields.password[0])];
                        sqlconnection.query(addsql, addsqlparam, function (err, result) {
                            if (err) {
                                console.log('[INSERT ERROR] - ', err.message);
                                return;
                            }
                            console.log('New register:', addsqlparam);
                        });

                        replyDate.message = '注册成功';
                        replyDate.state = 'yes';
                        res.send(replyDate);
                        n = 0;
                    }
                }
            }
            sqlconnection.end();
        }).catch(TypeError, function (e) {
            console.log(e);
        })
    })

})


// 登录界面操作
app.post('/Account/Hclogin', function (req, res) {
    var form = new multiparty.Form({ uploadDir: './uploads' });
    var clientIP = req.ip;
    var clientHost = req.hostname;
    var clientUrl = req.headers.origin;
    //格式化输出登录时间
    Date.prototype.Format = function(fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    var datetime = (new Date()).Format("yyyy-MM-dd hh:mm:ss");

    var sqlconnection = mysql.createConnection(config.sqlconnection);
    sqlconnection.connect();

    // 读取数据
    function sqlRead() {
        var p = new Promise(function (resolve, reject) {    // 用promise的resolve把数据传到then后面的函数中
            var sql = 'SELECT * FROM uidpswd';
            var addSql_stat = 'INSERT INTO `users-stats`(`login-ip`,`login-time`, `login-address`,`login-url`) VALUES(?,?,?,?)';
            var addSqlParams_stat = [clientIP,datetime,clientHost,clientUrl];
            //查
            sqlconnection.query(sql, function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }
                resolve(result);
            })
            sqlconnection.query(addSql_stat,addSqlParams_stat,function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }
                resolve(result);
            })

        });
        return p;
    }

    form.parse(req, function (err, fields) {
        if (fields.userName[0].indexOf("'") >= 0 || fields.userName[0].indexOf('"') >= 0 || fields.password[0].indexOf("'") >= 0 || fields.password[0].indexOf('"') >= 0) {
            res.send('存在非法字符');
        }
        else {
            sqlRead().then(function (data) {
                replyDate = {
                    message: '',
                    state: '',
                    userName: '',
                    name: '',
                    Html: ''
                };
                if (err) {
                    res.send('网络存在问题');
                } else {
                    var toDoJson = data;
                    var n = 0;
                    for (var i = 0; i < toDoJson.length; i++) {
                        if (toDoJson[i].userName == fields.userName[0] && toDoJson[i].password == md5('cxnha' + fields.password[0])) {
                            replyDate.message = '登录成功';
                            replyDate.state = 'match';
                            replyDate.userName = toDoJson[i].userName;
                            replyDate.name = toDoJson[i].name;
                            var token = new Date().getTime() + toDoJson[i].userName;
                            res.cookie('ift', md5(token), { maxAge: 6000000 });
                            res.cookie('username', encodeURI(toDoJson[i].name), { maxAge: 6000000 });
                            res.cookie('separateName', toDoJson[i].userName,{ maxAge: 6000000 });
                            cookieLogin.tokens.push(md5(token));
                            cookieLogin.times.push(new Date().getTime());
                            res.json(replyDate);
                            n++;
                        }
                    }
                    if (n == 0) {
                        replyDate.message = '无此账号或账号密码不匹配';
                        replyDate.state = 'no';
                        res.send(replyDate);
                    }
                }
                sqlconnection.end();
            })
        }
    })
});

module.exports = app;

// 测试使用类
class CommonMysql {
    constructor() {
        this.sqlconnection = mysql.createConnection(config.sqlconnection);
    }
    get area() { // 原型方法
        return this.a * this.b;
    }

    ff() {
        return this.sqlconnection;
    }
}