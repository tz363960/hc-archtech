const http = require('http'),
    https = require('https'),
    express = require('express'),
    app = express();

app.use('/', function (req, res) { //访问localhost所有的请求都会进入这里
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    let option = {
        hostname: "http://saip.market.alicloudapi.com", //上图的接口域名
        path: `/ip=${'35.241.168.98'}`, //上图的path格式 在最后附上你要查询的IP地址（我这里是获取的用户的IP）
        headers: { //设置请求头
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "9e9d655fd35c46398b7bbc6d8b1964d7",
        }
    };
    let re = https.request(option, (Res) => { //为了与外层的res区别故此处响应文件用Res
        Res.setEncoding('utf8');
        if (Res.statusCode === 200) { //若http状态码为200则请求成功
            Res.on('data', (data) => {
                res.send(data); //将接口返回的数据返回到页面上
                console.log(res.send(data));
            });
        }
    });
    re.on('error', (e) => {
        console.error(`请求遇到问题: ${e.message}`);
    });
    re.end();
});

http.createServer(app).listen(5000,'0.0.0.0');//创建服务器实例