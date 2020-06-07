var now = new Date();
var hour = now.getHours();
var ss = document.styleSheets[0];
if (hour >= 6 && hour < 12){
    ss.addRule('#bg:after', 'background-image: url("../../images/bg1.jpg")')
}
if (hour >= 12 && hour < 15){
    ss.addRule('#bg:after', 'background-image: url("../../images/bg2.jpg")')
}
if (hour >= 15 && hour < 18){
    ss.addRule('#bg:after', 'background-image: url("../../images/bg3.jpg")')
}
if (hour >= 18 && hour < 20){
    ss.addRule('#bg:after', 'background-image: url("../../images/bg4.jpg")')
}
if (hour >= 20 || hour < 6){
    ss.addRule('#bg:after', 'background-image: url("../../images/bg5.jpg")')
}


var text = document.title;  //定义文章的title
var timerID;    //定义时间变量
function init() {    //定义函数
    clearTimeout(timerID);  //清除定时器
    document.title = text.substring(1, text.length) + text.substring(0, 1); //substring()方法用于提取字符创中介于两个指定下标之间的字符
    text = document.title.substring(0, text.length);
    timerID = setTimeout("init()", 300)
}

setFocus();

// 设置获取焦点
function Focus() {
    document.getElementById('name').focus()
    document.getElementById('name_r').focus()
}

function setFocus() {
    setTimeout("Focus()", 500)
}

// 设置密码获取焦点（注册成功）
function pFocus() {
    document.getElementById("password").focus()
    document.getElementById("password_r").focus()
    document.getElementById("password_p").focus()
}

function setPFocus() {
    setTimeout("pFocus()", 500)
}

// 设置邮箱获取焦点
function eFocus() {
    document.getElementById("email_r").focus()
}

function setEFocus() {
    setTimeout("eFocus()", 500)
}

// 清空 输入框input
function clearAll() {
    document.getElementById('name').value = ""
    document.getElementById('password').value = ""
    document.getElementById('name_r').value = ""
    document.getElementById('email_r').value = ""
    document.getElementById('password_r').value = ""
    document.getElementById('password2').value = ""
    document.getElementById('password_p').value = ""
    document.getElementById('password2_p').value = ""
}

// 登录
function login() {
    var post_data = {
        // 登录
        "status": 0,
        "name": document.getElementById("name").value,
        "pswd": document.getElementById("password").value
    };

    $.ajax({
        url: "/",
        type: "POST",
        data: post_data,
        success: function(e) {
            if(e == "1") {
                clearAll();
                location.replace("/");
            } else {
                swal({   
                    title: "登录失败！",   
                    text: '<span style="text-decoration:underline; text-decoration-skip: ink;">姓名</span> 或 <span style="text-decoration:underline; text-decoration-skip: ink;">密码</span> 错误<br/>（2秒后自动关闭）',   
                    type: "error",
                    html: true,
                    timer: 2000,   
                    showConfirmButton: false
                });
                setFocus();
            }
        }
    });
    return false;
}

// 退出登录
function logout() {
    var post_data = {
        // 退出
        "status": -1,
    };

    $.ajax({
        url: "/",
        type: "POST",
        data: post_data,
        success: function(e) {
            if(e == "1") {
                window.location.href='/'
            } else {
                //
            }
        }
    });
}

// 注册
function register() {
    var post_data = {
        // 注册
        "status": 1,
        "name": document.getElementById("name_r").value,
        "email": document.getElementById("email_r").value,
        "pswd": document.getElementById("password_r").value,
        "pswd2": document.getElementById("password2").value
    };

    $.ajax({
        url: "/",
        type: "POST",
        data: post_data,
        success: function(data) {
            data = JSON.parse(data);
            if(data["status"] == "-1") {
                // 用户已存在
                setTimeout('setFocus()', 2000);
                swal({   
                    title: "注册失败！",   
                    text: '<span style="text-decoration:underline; text-decoration-skip: ink;">用户名</span> 已存在！<br/>（2秒后自动关闭）',   
                    type: "error",
                    html: true,
                    timer: 2000,   
                    showConfirmButton: false
                });
            } else if(data["status"] == "-2") {
                // 邮箱已存在！
                setTimeout('setEFocus()', 2000);
                swal({   
                    title: "注册失败！",   
                    text: '<span style="text-decoration:underline; text-decoration-skip: ink;">邮箱</span> 已存在！<br/>（2秒后自动关闭）',   
                    type: "error",
                    html: true,
                    timer: 2000,   
                    showConfirmButton: false
                });
            } else if(data["status"] == "-3") {
                // 密码不一致
                setTimeout('setPFocus()', 2000);
                swal({   
                    title: "注册失败！",   
                    text: '两次密码不一致，请重新输入！<br/>（2秒后自动关闭）',   
                    type: "error",
                    html: true,
                    timer: 2000,   
                    showConfirmButton: false
                });
            } else if(data["status"] == "1") {
                // 成功
                clearAll();
                swal({   
                    title: "Good!",   
                    text: '您已成功注册，马上为您跳转到登陆页面<br/>（2秒后自动关闭）',   
                    type: "success",
                    html: true,
                    timer: 2000,   
                    showConfirmButton: false
                });
                document.getElementById("name").value = data["username"];
                setTimeout(function(){location.replace("/#login");}, 2000)
                setTimeout('setPFocus()', 2000);
            }
        }
    });
    return false;
}

// 获取验证码
function get_code() {
    var post_data = {
        // 获取验证码
        "status": 2,
        "email": document.getElementById("email_p").value
    };

    $.ajax({
        url: "/",
        type: "POST",
        data: post_data,
        success: function(e) {
            if(e == "1") {
                // 成功
                swal({   
                    title: "Good!",   
                    text: '已将验证码发送至为邮箱 <span style="text-decoration:underline; text-decoration-skip: ink;">'+document.getElementById("email_p").value+'</span>.<br/>（2秒后自动关闭）',   
                    type: "success",
                    html: true,
                    timer: 2000,   
                    showConfirmButton: false
                });
            } else {
                // 失败
                swal({   
                    title: "Error!",   
                    text: '邮箱不存在，请输入正确的邮箱.<br/>（2秒后自动关闭）',   
                    type: "error",
                    html: true,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        }
    });
}

// 找回密码——验证
function verify() {
    var post_data = {
        "status": 3,
        "code": document.getElementById("rcode").value,
        "email": document.getElementById("email_p").value
    };

    $.ajax({
        url: "/",
        type: "POST",
        data: post_data,
        success: function(e) {
            if(e == "1") {
                // 成功
                document.getElementById("email_p").disabled = "disabled"
                document.getElementById("rcode").disabled = "disabled"
                document.getElementById("gc").disabled = "disabled"
                document.getElementById("password_p").disabled = ""
                document.getElementById("password2_p").disabled = ""
                document.getElementById("vbtn").disabled = ""
                var vi = document.getElementById("verify_input")
                vi.value = "✔"
                vi.disabled = "disabled"

                swal({   
                    title: "验证通过!",   
                    text: '（2秒后自动关闭）',   
                    type: "success",
                    timer: 2000,   
                    showConfirmButton: false
                });
            } else if(e == "0") {
                swal({   
                    title: "验证失败!",   
                    text: '（2秒后自动关闭）',   
                    type: "error",
                    timer: 2000,   
                    showConfirmButton: false
                });
            } else {
                swal({   
                    title: "请稍后...",   
                    text: '（2秒后自动关闭）',   
                    type: "info",
                    timer: 2000,   
                    showConfirmButton: false
                });
            }
        }
    });
}

// 找回密码——确定
function done() {
    var post_data = {
        "status": 4,
        "email": document.getElementById("email_p").value,
        "pswd": document.getElementById("password_p").value,
        "pswd2": document.getElementById("password2_p").value
    };

    $.ajax({
        url: "/",
        type: "POST",
        data: post_data,
        success: function(e) {
            if(e == "1") {
                swal({   
                    title: "成功!",   
                    text: '（2秒后自动关闭）',   
                    type: "success",
                    timer: 2000,   
                    showConfirmButton: false
                });
                setTimeout(function(){location.replace("/#login");}, 2000)
                setTimeout('setFocus()', 2000);
            } else if(e == "0") {
                // 密码不一致
                swal({   
                    title: "失败!",   
                    text: '两次密码不一致，请重新输入！<br>（2秒后自动关闭）',
                    type: "error",
                    html: true,
                    timer: 2000,   
                    showConfirmButton: false
                });
                setTimeout('setPFocus()', 2000);
            } else if(e == "-1") {
                // 密码不一致
                swal({   
                    title: "失败!",   
                    text: '请先 / 重新认证邮箱！<br>（2秒后自动关闭）',
                    type: "error",
                    html: true,
                    timer: 2000,   
                    showConfirmButton: false
                });
                setTimeout('setPFocus()', 2000);
            }
        }
    });
    return false;
}

// 问题反馈
function feedback() {
    var post_data = {
        "status": 5,
        "name": document.getElementById("name_fb").value,
        "email": document.getElementById("email_fb").value,
        "content": document.getElementById("message").value
    };

    $.ajax({
        url: "/",
        type: "POST",
        data: post_data,
        success: function(e) {
            if(e == "1") {
                swal({   
                    title: "提交成功!",   
                    text: '感谢您的反馈，我们会做的更好！<br>（3秒后自动关闭）',   
                    html: true,
                    type: "success",
                    timer: 3000,   
                    showConfirmButton: false
                });
            }
        }
    });
    return false;
}

// 任务一提交
function task1(bol) {
    var post_data = {
        "status": 11,
        "bol": bol
    };

    $.ajax({
        url: "/",
        type: "POST",
        data: post_data,
        success: function(e) {
            if(e == "1") {
                location.reload(true);
            }
            else if(e == "0") {
                swal({   
                    title: "请先登录!",   
                    text: '（2秒后自动关闭）',
                    type: "error",
                    html: true,
                    timer: 2000,   
                    showConfirmButton: false
                });
                location.replace('/#login');
            }
        }
    });
}

// 任务二提交
function task2(bol) {
    var post_data = {
        "status": 12,
        "bol": bol
    };

    $.ajax({
        url: "/",
        type: "POST",
        data: post_data,
        success: function(e) {
            if(e == "1") {
                location.reload(true);
            }
            else if(e == "0") {
                swal({   
                    title: "请先登录!",   
                    text: '（2秒后自动关闭）',
                    type: "error",
                    html: true,
                    timer: 2000,   
                    showConfirmButton: false
                });
                location.replace('/#login');
            }
        }
    });
}