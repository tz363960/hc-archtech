const path = require('path');
const express = require('express');
var fs = require('fs'); //文件模块

var router = express.Router();

const PORT = process.env.PORT || 5000;
const config = require('./config');
if (config.credentials.client_id == null || config.credentials.client_secret == null) {
    console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
    return;
}

let app = express();
app.use('/', require('./routes/cxnLoRe'));   //注册登录页面要放到前面，中间件的放置顺序很重要，等同于执行顺序
app.use(express.static(path.join(__dirname, 'public'))); //public文件夹下面的网页,作为静态资源，直接加载
app.use(express.json({
    limit: '200mb'
}));

app.use('/api/forge/oauth', require('./routes/oauth'));
app.use('/api/forge/oss', require('./routes/oss'));
app.use('/api/forge/modelderivative', require('./routes/modelderivative'));
app.use('/', require('./mysql/database_route'));
app.use('/', require('./routes/cxn'));   //use之后，cxn里面的当前路径相当于start的路径


//如果404，则重定向
app.get('*', function (req, res) {
    res.sendfile('./public/forge-table.html');
});




app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});