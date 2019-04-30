import $ from 'jquery';
import 'what-input';
import './lib/nprogress';
import './lib/cookie';
import './lib/main';
import './qiye/qiye_all';
import { get } from 'http';
// Foundation JS relies on a global varaible. In ES6, all imports are hoisted
// to the top of the file so if we used`import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.W
window.jQuery = $;
require('foundation-sites');
// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';
$(document).foundation();




// 输入信息错误返回情况
function error_info_fuc(e_id, info_text) {
    e_id.append('<div class="large-6 medium-6 small-12 cell" id="phone_error_box"> <div data-alert class= "callout alert small "  data-closable ><h6 id="phone_login_alert">' + info_text + '</h6><button class="close-button" aria-label="Dismiss alert" type="button" data-close><span aria-hidden="true">&times;</span></button></div> ');
}
function success(s_id, s_info) {
    s_id.append('<div class="large-6 medium-6 small-12 cell" id="phone_success_box"><div class="success callout"><h6>' + s_info + '</h6><button class="close-button" aria-label="Dismiss alert" type="button" data-close><span aria-hidden="true">&times;</span></button></div></div>');
}
// 手机号验证错误信息列表
var phone_erro_info = {
    isnull0: "手机号码不能为空！",
    len_error: "手机号长度错误",
    invalid_value: "请输入有效的手机号码！"
}
// 验证码报错信息列表
var code_error_info = {
    code_none: "验证码不能为空",
    code_len_error: "验证码长度错误",

}
//  如果存在就清空
function clear_alert() {
    if ($("#phone_error_box").length > 0) {
        $("#phone_error_box").remove();
    }
    if ($("#phone_success_box").length > 0) {
        $("#phone_success_box").remove();
    }
}
$("#get_code_btn").click(function get_code_func() {
    clear_alert();
    var get_phone = $("#onload_tel").val();
    // 手机号码验证
    var phone_area = $("#code_div");
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (get_phone == '') {
        error_info_fuc(phone_area, phone_erro_info.isnull0);
    } else if (get_phone.length != 11) {
        error_info_fuc(phone_area, phone_erro_info.len_error);
    } else if (!myreg.test(get_phone)) {
        error_info_fuc(phone_area, phone_erro_info.invalid_value)
    } else {
        $.ajax({
            type: "post",
            url: "http://192.168.60.175:666/certificate/user/send_phone",
            dataType: 'json',
            data: {
                phone: get_phone
            },
            async: false,
            success: function (back_even) {
                if (back_even.code == 5005) {
                    success(phone_area, back_even.msg);
                    var time1 = 3;
                    $("#get_code_btn").html("(" + time1 + "秒)");
                    var setTime = setInterval(
                        function () {
                            if (time1 > 0) {
                                $("#get_code_btn").unbind("click", get_code_func);
                                $("#get_code_btn").attr("disabled","true");
                                time1--;
                                $("#get_code_btn").html("(" + time1 + "秒)");
                            } else {
                                clearInterval(setTime);
                                $("#get_code_btn").removeAttr("disabled");
                                $("#get_code_btn").html("重新获取");
                                $("#get_code_btn").bind("click", get_code_func);
                            }
                        }, 1000);
                }else{
                    error_info_fuc(phone_area,back_even.msg);
                }
            },
            error: function () {
                return false;
            }

        })
    }

});

// 手机号登录
$("#onload_phone_btn").click(function () {
    clear_alert();
    var phone_num_load = $("#onload_tel").val();
    var code = $("#onload_code").val();
    var load_area = $("#load_div");
    // 手机号码验证
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (phone_num_load == '') {
        error_info_fuc(load_area, phone_erro_info.isnull0);
    } else if (phone_num_load.length != 11) {
        error_info_fuc(load_area, phone_erro_info.len_error);
    } else if (!myreg.test(phone_num_load)) {
        error_info_fuc(load_area, phone_erro_info.invalid_value);
    } else if (code == '') {
        error_info_fuc(load_area, code_error_info.code_none);
    } else if (code.length != 4) {
        error_info_fuc(load_area, code_error_info.code_len_error);
    } else {
        $.ajax({
            type: "post",
            url: "http://192.168.60.175:666/certificate/user/phone_login",
            dataType: "json",
            data: {
                // token: '',
                phone: phone_num_load,
                code: code
            },
            async: false,
            success: function (load_back) {
                if (load_back.code == 3008) {
                    $.cookie("user_token", load_back.data.token, { path: "/" });
                    window.location.href = "http://localhost:8008/user_center";
                } else {
                    error_info_fuc(load_area, load_back.msg)

                }
            },
            error: function () {
                return false;
            }
        })
    }
})
// 鼠标悬浮用户小卡片logo 移入显示 移出隐藏
// $("#act_user_temp").mouseover(function () {
//     $("#info_card").slideDown(300);

// })
// $(document).mousemove(function () {
//     var e = e || window.event;
//     var ele = e.target || e.srcElement;
//     while (ele) {
//         if (ele.id && ele.id == 'info_card' || (ele.id && ele.id == 'act_user_temp')) {
//             return;
//         }
//         ele = ele.parentNode;


//     }
//     $("#info_card").slideUp(300);
// })

// 实时监控用户id和用户名输入框
// console.log("start_appjs");




