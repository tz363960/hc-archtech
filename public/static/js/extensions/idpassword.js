Validator = {
    userName: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,16}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#.$]{6,16}$/,  // 必须包含数字加字母，可以有特殊符号
    phones: /^\d{11}$/,
    ErrorMessage: [],
    ErrorNull: '',
    Validate: function (theForm) {  // 用Validator.Validate()时,this指向Validator。
        var obj = theForm || event.srcElement;  // 没指定对象则是当前元素
        var userName = $('#userName').val();
        var password = $('#password').val();
        var phones = $('#phones').val();
        if (userName == '' || userName == 'undefined') {
            this.ErrorNull = this.ErrorNull + $('#userName')[0].getAttribute("placeholder") + '不能为空' + '\n';
        }
        if (password == '' || password == 'undefined') {
            this.ErrorNull = this.ErrorNull + $('#password')[0].getAttribute("placeholder") + '不能为空' + '\n';
        }
        if (phones == '' || phones == 'undefined') {
            this.ErrorNull = this.ErrorNull + $('#phones')[0].getAttribute("placeholder") + '不能为空' + '\n';
        }
        if (!this['userName'].test(userName)) {
            //获取表单项的msg属性值，并把它作为错误信息源
            this.ErrorMessage.push($('#userName')[0].getAttribute("msg"));
        }
        if (!this['password'].test(password)) {
            this.ErrorMessage.push($('#password')[0].getAttribute("msg"));
        }
        if (!this['phones'].test(phones)) {
            this.ErrorMessage.push($('#phones')[0].getAttribute("msg"));
        }

        var alertMessage = '';
        if (!this.ErrorNull.length) {
            if (this.ErrorMessage.length > 0) {
                for (var i = 0; i < this.ErrorMessage.length; i++) {
                    alertMessage += this.ErrorMessage[i] + '\n';
                }
                alert(alertMessage);
                this.ErrorMessage = [];
                return false;
            }
            else { return true; }
        }
        else {
            alert(this.ErrorNull);
            this.ErrorNull = '';
            return false;
        }
    },

    loginHc: function (theForm) {
        var obj = theForm || event.srcElement;  // 没指定对象则是当前元素
        var count = obj.childElementCount;
        var userName = $('#userName').val();
        var password = $('#password').val();

        var formData = new FormData();
        formData.append('userName', userName);
        formData.append('password', password);

        $.ajax({
            url: '/Account/Hclogin',
            data: formData,
            processData: false, //要记得设置这两个
            contentType: false,
            type: 'POST',
            dataType: "json",
            success: function (data) {
                if (data) {
                    console.log(data);
                    if (data.state == "match") {    //判断返回值，这里根据的业务内容可做调整
                        console.log(document.cookie);
                        window.location.href = '/forge-table.html';   //指向登录的页面地址
                    } else {
                        alert(data.message); //显示登录失败的原因
                        return false;
                    }
                }
            },
            error: function (data) {
                alert('发生错误');
            }
        })
    },

    registerHc: function (theForm) {
        var obj = theForm || event.srcElement;  // 没指定对象则是当前元素
        var userName = $('#userName').val();
        var password = $('#password').val();
        var phones = $('#phones').val();
        var name = $('#name').val();
        var formData = new FormData();
        formData.append('userName', userName);
        formData.append('phones', phones);
        formData.append('name', name);
        formData.append('password', password);
        
        $.ajax({
            url: '/Account/Hcregister',
            data: formData,
            processData: false, //要记得设置这两个
            contentType: false,
            type: 'POST',
            success: function (data) {
                if (data) {
                    console.log(data);  //??????????????不运行？？？？？？？？？？
                    if (data.state == "yes") {    //判断返回值，这里根据的业务内容可做调整
                        alert(data.message);
                        location.reload();        //这个管用
                    } else if (data.state == "exist") {
                        alert(data.message); //显示登录失败的原因
                        return false;
                    }
                    else { alert('网络阻塞'); }
                }
            },
            error: function (data) {
                alert('网络阻塞');
            }
        })
    }
}

$(function () {
    $(document).on('click', '#registerhcbt', function () {
        var registerHTML = '<div class="unix-login" id="hcregist"><div class="container-fluid"><div class="row justify-content-center"><div class="col-lg-6"><div class="login-content"><div class="login-logo"><a href="/index"><span>恒城科技</span></a></div><div class="login-form"><h4>用户注册</h4><div id="registerform"><div class="form-group"><label>账号</label><input id="userName" class="form-control" placeholder="账号" msg="账号必须为3-16位的字母加数字"></div><div class="form-group"><label>密码</label><input type="password"  id="password" class="form-control" placeholder="密码" msg="密码必须为6-16位的字母加数字"></div><div class="form-group"><label>手机号</label><input id="phones" class="form-control" placeholder="手机号" msg="手机号格式需为11位数字"></div><div class="form-group"><label>姓名</label><input id="name" class="form-control" placeholder="姓名" msg="与身份证不匹配"></div><div class="social-button"><button id="registerButton" class="btn btn-primary m-b-30 m-t-30">注册</button></div><div class="register-link m-t-15 text-center"><p>已有账号？<a id="returnlogin" href="javascript:;"> 返回登录界面</a></p></div></div></div></div></div></div></div></div>';
        $('.bg-primary1')[0].innerHTML = registerHTML;
    })

    $(document).on('click', '#returnlogin', function () {
        var loginHTML = '<html><head></head><body><div class="unix-login" id="hclogin"><div class="container-fluid"><div class="row justify-content-center"><div class="col-lg-6"><div class="login-content"><div class="login-logo"><a href="/index"><span>恒城科技</span></a></div><div class="login-form"><h4>用户登录</h4><div id="loginform"><div class="form-group"><label>账号</label><input id="userName" class="form-control" placeholder="账号" msg="账号必须为3-16位的字母加数字" /></div><div class="form-group"><label>密码</label><input type="password" id="password" class="form-control" placeholder="密码" msg="密码必须为6-16位的字母加数字" /></div><div class="checkbox"><label><input type="checkbox" /> 记住</label><label class="pull-right"><a href="#">忘记密码?</a></label></div><button id="loginButton" class="btn btn-primary btn-flat m-b-30 m-t-30">登录</button><div class="register-link m-t-15 text-center"><p>没有账号 ?<a id="registerhcbt" href="javascript:;"> 在此注册</a></p></div></div></div></div></div></div></div></div></body></html>';
        $('.bg-primary1')[0].innerHTML = loginHTML;
    })

    $(document).on('click', '#registerButton', function () {    //#registerButton这个button自带submit。
        var ifregister = window.Validator.Validate($('#registerform')[0]);  // 丢给window的全局变量
        if (!ifregister) return false;   // 在这里return，实现表单验证
        else {
            window.Validator.registerHc($('#registerform')[0]);
        }
    })

    $(document).on('click', '#loginButton', function () {   // 使用jQuery的on实现动态元素赋值，父元素是document
        window.Validator.loginHc($('#loginform')[0]);
    })
})

document.onkeydown = function (e) {
    if ((e.keyCode || e.which) == 13) {
        window.Validator.loginHc($('#loginform')[0]);   // 提交按钮触发的方法
    }
}
