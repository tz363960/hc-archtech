const path = require('path');
const express = require('express');
var fs = require('fs'); //文件模块
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var multiparty = require('multiparty');
var router = express.Router();

const PORT = process.env.PORT || 5000;
const config = require('./config');
if (config.credentials.client_id == null || config.credentials.client_secret == null) {
    console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
    return;
}

let app = express();
app.use(express.static(path.join(__dirname, 'public'))); //public文件夹下面的网页,作为静态资源，直接加载
app.use(express.json({
    limit: '200mb'
}));
app.use('/api/forge/oauth', require('./routes/oauth'));
app.use('/api/forge/oss', require('./routes/oss'));
app.use('/api/forge/modelderivative', require('./routes/modelderivative'));
app.use('/', require('./mysql/database_route'));

/*..............................................................................................................*/

// 点云数据,与python进行数据交互
app.get('/test_post/nn', function (req, res) {
    // exec 执行的时候会使用一个缓冲区，stdout 或 stderr 上允许的最大字节数，默认大小是200 × 1024。
    // 如果需要的数据比较大，需定义这个缓冲区最大值。
    exec('python myIdw.py', {
        maxBuffer: 1024 * 1024
    }, function (error, stdout, stderr) {
        if (error) {
            console.info('stderr : ' + stderr);
        }
        var upDate = stdout.toString();
        res.send(upDate);
    });
});


// 施工数据管理上传数据
app.get('/constructTable', function (req, res) {
    var file = './public/datas/constructTable.json'; //文件路径，相对路径
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
            console.log('failed file');
        }
        var upDate = data.toString(); //需让data转换为string
        res.send(upDate);
    });
});

// 设计数据管理上传数据
app.get('/DesignTable', function (req, res) {
    var file = './public/datas/designTable.json'; //文件路径，相对路径
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
            console.log('failed file');
        }
        var upDate = data.toString(); //需让data转换为string
        res.send(upDate);
    });
});

// 接收创建文件夹请求
app.get('/quality-control/create-folder', function (req, res) {
    var response = {
        "data": "server get the data"
    };
    res.send(JSON.stringify(response));
    console.log(JSON.stringify(req.query)); //前台传回来的数据
    var file = path.join(__dirname, 'public/datas/test.json'); // 工艺库数据的文件
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
            res.send('网络存在问题');
        } else {
            var toDoJson = eval('(' + data + ')'); //不严格格式的json string都可以转为json对象
            toDoJson.push({
                id: req.query.timestamp,
                parent: req.query.id,
                text: req.query.text,
                type: "folder"
            });
            fs.writeFileSync('public/datas/test.json', JSON.stringify(toDoJson), function (err) {});
        }
    })
})

// 接收删除文件夹请求
app.get('/quality-control/delete-folders', function (req, res) {
    function nodes(idname, itoDoJson) { //idname表示此节点id，递归删除所有子文件夹及本身
        for (var i = 0; i < itoDoJson.length; i++) {
            if (itoDoJson[i].id == idname) { //这个是文件夹本身
                itoDoJson.splice(i, 1);
            }
            // 此时toDoJson[i]的parent是已删除的那个文件夹，说明toDoJson[i]是其子文件夹，
            // 那么他有可能是某个节点的父节点，所以把其id也递归下去
            if (i < itoDoJson.length) { // 防止删除文件夹本身语句删除的是最后一条数据,i超出界限
                if (itoDoJson[i].parent == idname) {
                    var loopname = itoDoJson[i].id;
                    itoDoJson.splice(i, 1);
                    i--; // i--的目的在于：splice会改变数组长度，删除项目后，得从上一个i开始判断一次，不然会漏掉补位的
                    nodes(loopname, itoDoJson);
                }
            }
        }
    }

    console.log(JSON.stringify(req.query)); //前台传回来的数据
    var file = path.join(__dirname, 'public/datas/test.json'); // 工艺库数据的文件
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
            res.send('网络存在问题');
        } else {
            var toDoJson = eval('(' + data + ')'); //不严格格式的json string都可以转为json对象
            var idname = req.query.id;
            nodes(idname, toDoJson);
            fs.writeFileSync('public/datas/test.json', JSON.stringify(toDoJson), function (err) {
                res.send('删除文件夹成功');
            });
        }
    })
})

// 接收创建工艺文件请求
app.post('/quality-control/create-files', function (req, res) {
    var form = new multiparty.Form({
        uploadDir: './uploads'
    });
    var sjkfile = path.join(__dirname, 'public/datas/test.json'); // 工艺库数据的文件

    form.parse(req, function (err, fields, files) { // files是上传的文件，信息在fields里面，req是没有信息的，因为用的是FormData
        var inputFile = files.gykFileToUpload[0];
        var uploadedPath = inputFile.path;
        var dstPath = './uploads/' + inputFile.originalFilename;
        fs.rename(uploadedPath, dstPath, function (err) { // fs.rename(oldPath, newPath, [callback(err)])
            if (err) {
                console.log('rename error: ' + err);
            } else {
                console.log('rename ok ' + "id:" + fields.id[0] + " text:" + fields.text[0] + " type:" + fields.type[0]);
            }
        });
        files.gykFileToUpload.path = dstPath;
        res.send('上传成功');

        fs.readFile(sjkfile, 'utf-8', function (err, data) {
            if (err) {
                res.send('网络存在问题');
            } else {
                var toDoJson = eval('(' + data + ')'); //不严格格式的json string都可以转为json对象
                toDoJson.push({
                    id: fields.id[0],
                    parent: fields.parent[0],
                    text: fields.text[0],
                    type: fields.type[0]
                });
                fs.writeFileSync('public/datas/test.json', JSON.stringify(toDoJson), function (err) {});
            }
        })
    })
})

// 接收删除文件请求
app.get('/quality-control/delete-files', function (req, res) {
    console.log(JSON.stringify(req.query)); //前台传回来的数据
    var file = path.join(__dirname, 'public/datas/test.json'); // 工艺库数据的文件
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
            res.send('网络存在问题');
        } else {
            var toDoJson = eval('(' + data + ')'); //不严格格式的json string都可以转为json对象
            var idname = req.query.id;
            for (var i = 0; i < toDoJson.length; i++) {
                if (toDoJson[i].id == idname) { //这个是文件夹本身
                    toDoJson.splice(i, 1);
                }
            }
            fs.writeFileSync('public/datas/test.json', JSON.stringify(toDoJson), function (err) {
                res.send('删除文件成功');
            });
        }
    })
})

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