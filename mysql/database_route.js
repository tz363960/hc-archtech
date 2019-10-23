const express = require('express');
const multer = require('multer');
const http = require('http');
const url = require('url');
const sqlconnection = require('../config');

let router = express.Router();

var mysql = require('mysql');

//建立连接 ZemenBank201908
var connection = mysql.createConnection(sqlconnection.sqlconnection);
//连接状态测试
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

pingInterval = setInterval(() =>{
    connection.ping((err) => {
        console.log(success);
        if (err) {
            console.log('ping err: ' + JSON.stringify(err));
        }
    });
}, 3600000*3);

clearInterval(pingInterval);
//查询数据
router.get('/construction-progress/data12', function (req, res) {
    connection.query('SELECT * FROM ProgressDataSet', function (error, results) {
        //查询错误，返回错误信息
        if (error) {
            results = {
                "status": "500",
                "message": "服务器错误"
            }
        } else {
            results = {
                "status": "200",
                "message": "Success",
                "data": results
            }
            console.log(Object.prototype.toString.call(results.data));
            console.log(results.data);
            res.end(JSON.stringify(results.data));
        }
    });
})

router.get('/construction-progress/data', function (req, res) {
    connection.query('SELECT * FROM ProgressDataSet', function (error, results) {
        //查询错误，返回错误信息
        if (error) {
            results = {
                "status": "500",
                "message": "服务器错误"
            }
        } else {
            results = {
                "status": "200",
                "message": "Success",
                "data": results
            }
            // console.log(results.data);
            res.send(JSON.stringify(results.data));
        }
    });
})

router.get('/construction-progress/data1', function (req, res) {
    connection.query('SELECT * FROM ProgressGroups', function (error, results) {
        //查询错误，返回错误信息
        if (error) {
            results = {
                "status": "500",
                "message": "服务器错误"
            }
        } else {
            results = {
                "status": "200",
                "message": "Success",
                "data": results
            }
            // console.log(Object.prototype.toString.call(results.data));
            // console.log(results.data);
            res.send(JSON.stringify(results.data));
        }
    });
})

router.get('/weekly-report/tree', function (req, res) {
    connection.query('select id, text, parent, type FROM WeeklyReportTree where DeleteOrNot = 1;', function (error, results) {
        //查询错误，返回错误信息
        if (error) {
            results = {
                "status": "500",
                "message": "服务器错误"
            }
        } else {
            results = {
                "status": "200",
                "message": "Success",
                "data": results
            }
            // console.log(Object.prototype.toString.call(results.data));
            console.log(results.data);
            res.send(JSON.stringify(results.data));
        }
    });
})

router.post('/weekly-report/tree/deletefile', (req) => {
    var idDelele = req.body.FileID.toString();
    console.log(idDelele);
    var mysql = 'update WeeklyReportTree set DeleteOrNot = 0 where id in(' + idDelele + ');';
    connection.query(mysql, function (error, results) {
        //查询错误，返回错误信息
        if (error) {
            results = {
                "status": "500",
                "message": "服务器错误"
            }
        } else {
            results = {
                "status": "200",
                "message": "Success",
            }
            // console.log(Object.prototype.toString.call(results.data));
            console.log(results);
        }
    });
})

router.post('/weekly-report/tree/restorefile', (req) => {
    var isRestore = req.body.IsRestore.toString();
    console.log(isRestore);
    if (isRestore == "true") {
        var mysql = 'update WeeklyReportTree set DeleteOrNot = 1;';
    }

    connection.query(mysql, function (error, results) {
        //查询错误，返回错误信息
        if (error) {
            results = {
                "status": "500",
                "message": "服务器错误"
            }
        } else {
            results = {
                "status": "200",
                "message": "Success",
            }
            // console.log(Object.prototype.toString.call(results.data));
            console.log(results);
        }
    });
})

module.exports = router;