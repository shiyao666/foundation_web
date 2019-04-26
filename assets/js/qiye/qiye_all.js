import $ from 'jquery';

$(document).ready(
    function () {
        // 接口列表
        var onload_api_list = {
            get_code: "http://192.168.60.175:666/certificate/user/send_phone",
            get_account_data: "http://192.168.60.175:666/certificate/user/account_login",
            get_phone_data: "http://192.168.60.175:666/certificate/user/phone_login"
        }
        
        // 获取验证码
        $(document).bind('input propertychange', function () {
            $("#phone_error_box").addClass("none");
        });

        // 账号密码登录
        $("#onload_account_btn").click(function () {
            var account_num = $("#onload_account").val();
            var account_pwd = $("#onload_pwd").val();
            $.ajax({
                type: "post",
                url: onload_api_list.get_account_data,
                dataType: "json",
                data: {
                    login_account: account_num,
                    password: account_pwd
                },
                async: false,
                success: function (load_back) {

                },
                error: function () {

                }
            })
        });

        // 登录方式切换
        $("#login_style_account").click(function () {
            $("#phone_part").addClass("none");
            $("#account_part").removeClass("none");
        });
        $("#login_style_phone").click(function () {
            $("#account_part").addClass("none");
            $("#phone_part").removeClass("none");
        });
    });