import $ from 'jquery';
$(document).ready(
    function () {





        var jsload_all = {
            nprogress: true,
            cookie: true
        }
        if (jsload_all.nprogress) {
            $.getScript("../assets/img/nprogress.js", function () {
                jsload_all.nprogress = false
                console.log("加载nprogress完成");
            });
        };
        if (jsload_all.cookie) {
            $.getScript("../assets/img/cookie.js", function () {
                jsload_all.cookie = false
                console.log("加载cookie完成");
                main1();
            });

            return;
        }
        // 调用接口
        function main1() {
            // function _getRandomString(len) {
            //     len = len || 32;
            //     var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
            //     var maxPos = $chars.length;
            //     var pwd = '';
            //     for (i = 0; i < len; i++) {
            //         pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            //     }
            //     return pwd;
            // }
            // _getRandomString(len);
            var api_list = {
                get_doc_meta: "http://192.168.60.175:666/certificate/data/user_data",
                get_doc_data: "http://192.168.60.175:666/certificate/data/download_certificate",
                get_one_doc: "http://192.168.60.175:666/certificate/data/get_one_doc",
            }
            // js加载列表项
            var jsload_list = {
                doc_data: true,
                doc_meta: true,
                jspdf: true,
                saveSvgAsPng: true,
                fontsource: true,
                svg: true,
            };
            // 元信息
            var doc_meta;
            // 模板信息
            var doc_data;
            var docid;
            if ($.cookie("user_token")) {

                $.ajax({
                    type: 'POST',
                    url: "http://192.168.60.175:666/certificate/data/user_data",
                    datType: 'json',
                    data: {
                        token: $.cookie("user_token"),
                    },
                    async: false,
                    success: function (event) {

                        if (event.error == 0) {
                            // doc_data = event;
                            if (event.code == 2001) {
                                $(".Book_module").removeClass("none");
                                $("#info_name").html(event.data.data.name);
                                $("#info_tel").html(event.data.data.tel);
                                $("#train_starttime").html(event.data.doc_data[0].train_starttime);
                                $("#train_endtime").html(event.data.doc_data[0].train_endtime);
                                $("#info_id").html(event.data.data.identity);
                                // $("#info_mail").html(event.data.doc_data[0].email);
                                $("#cert_name").html(event.data.doc_data[0].cert_category);
                                book_token = event.data.doc_data[0].doc_token;
                            }

                        } else {
                            // console.log(event.msg);
                            // doc_data = doc_mate_temp1;
                            // return false;
                            return false;
                        }
                        return;
                    },
                    error: function () {
                        return false;
                        // console.log("ajax_requst fail id:" + id);
                        // jsload_list.doc_data = false;
                        // doc_data = doc_mate_temp1;
                    }
                });
            }

            // 临时模板数据
            // 循环输出模板
            // var doc_meta_temp = {
            //     doc_name: "中软培训证书",
            //     // 请求svg数据 url
            //     doc_bg_svg_uri: "../assets/img/csst_cert.svg",
            //     data_templete: [
            //         { valuename: "docid", postiton: { x: 55, y: 40 }, size: 15, sub: "证书编号:" },
            //         { valuename: "name", postiton: { x: 200, y: 750 }, size: 60 },
            //         { valuename: "starttime", postiton: { x: 240, y: 840 }, size: 30 },
            //         { valuename: "endtime", postiton: { x: 690, y: 840 }, size: 30 },
            //         { valuename: "course", postiton: { x: 350, y: 1095 }, size: 30 },
            //         { valuename: "teacher", postiton: { x: 340, y: 1240 }, size: 30 },
            //     ]
            // };
            // var doc_meta_temp2 = {
            //     doc_name: "集成项目经理证书",
            //     // 请求svg数据 url
            //     doc_bg_svg_uri: "../assets/img/npm_cert.svg",
            //     data_templete: [
            //         { valuename: "name", postiton: { x: 550, y: 710 }, size: 60 },
            //         { valuename: "unicode", postiton: { x: 390, y: 969 }, size: 20 },
            //         { valuename: "type", postiton: { x: 390, y: 998 }, size: 20 },
            //         { valuename: "corporate_name", postiton: { x: 390, y: 1028 }, size: 20 },
            //         { valuename: "start_date", postiton: { x: 390, y: 1058 }, size: 20 },
            //         { valuename: "certificate_period", postiton: { x: 390, y: 1086 }, size: 20 },
            //     ]
            // };
            // function arr_out(arr) {
            //     for (var index in arr) {
            //         return arr[index]++;
            //     };
            // };

            // 返回值本地临时数据
            // var doc_data_request_temp = {
            //     "doctype": "doc1",
            //     "docid": "1",
            //     "token": "agweogjweo",
            //     "identity": '372924198011293016'
            // };

            var doc_mate_temp1 = {
                "name": "尧哥",
                "unicode": "45454",
                "type": "达瓦大的范德萨",
                "corporate_name": "哦哦哦哦哦哦",
                "start_date": '120000000',
                "certificate_period": "21442",
            }
            // 发送的数据
            // var doc_data_temp = {
            //     docid: "1",
            //     name: "张三",
            //     starttime: "2018年1月1日",
            //     endtime: "2018年1月2日",
            //     course: "项目管理",
            // }
            var book_token;


            $(".down_pdf").click(function (e) {
                NProgress.start();
                jsload_list.item = 0;

                docid = $(this).data("downloadpdf");
                createpdf(docid);
            });
            function createpdf(id) {
                if (jsload_list.doc_data) {
                    $.ajax({
                        type: 'POST',
                        url: api_list.get_doc_data,
                        datType: 'json',
                        data: {

                            token: $.cookie("user_token"),
                            doc_token: book_token
                        },
                        async: false,
                        success: function (event) {
                            // console.log("ajax_requst success id:" + id);
                            jsload_list.doc_data = false;
                            if (event.error == 0) {
                                doc_data = event.data[0];
                                console.log(doc_data);
                            } else {
                                // console.log(event.msg);
                                // doc_data = doc_mate_temp1;
                                // return false;

                                return false;
                            }
                            return;
                        },
                        error: function () {
                            return false;
                            // console.log("ajax_requst fail id:" + id);
                            // jsload_list.doc_data = false;
                            // doc_data = doc_mate_temp1;
                        }
                    });
                }

                if (jsload_list.doc_meta) {
                    $.ajax({
                        type: 'POST',
                        url: api_list.get_one_doc,
                        datType: 'json',
                        data: {
                            doc_token: book_token
                        },
                        async: false,
                        success: function (event) {
                            jsload_list.doc_meta = false;
                            if (event.error == 0) {
                                doc_meta = event.data;
                                console.log(doc_meta);
                            } else {
                                // console.log(event.msg);
                                // doc_meta = doc_meta_temp2;
                                return false;
                            }
                            return;
                        },
                        error: function () {
                            // jsload_list.doc_meta = false;
                            // doc_meta = doc_meta_temp2;
                            return false;
                        }
                    });
                }

                if (jsload_list.jspdf) {
                    $.getScript("../assets/img/jspdf.min.js", function () {
                        jsload_list.jspdf = false
                        console.log("加载pdf完成");
                        NProgress.set(0.4);
                        createpdf();
                    });
                    return;
                };

                if (jsload_list.saveSvgAsPng) {
                    $.getScript("../assets/img/saveSvgAsPng.js", function () {
                        jsload_list.saveSvgAsPng = false
                        console.log("加载saveSvgAsPng完成");
                        NProgress.set(0.2);
                        createpdf();
                    });
                    return;
                };

                if (jsload_list.svg) {
                    $('.load-target').load(doc_meta.doc_bg_svg_uri, function () {
                        jsload_list.svg = false
                        console.log("加载svg完成");
                        NProgress.set(0.1);
                        createpdf();
                    });
                    return;
                }

                if (jsload_list.fontsource) {
                    $.getScript("../assets/img/SIMYOU-normal.js", function () {
                        jsload_list.fontsource = false
                        console.log("加载字体完成");
                        NProgress.inc(0.2);
                        createpdf();
                    });
                    return;
                }

                var $svg = $('.load-target svg')[0];
                svgAsPngUri($svg, { scale: 1 / (window.devicePixelRatio || 1) }, (uri, width, height) => {
                    //开始生成pdf
                    var doc = new jsPDF('p', 'pt', [width, height]);
                    // 根据json数据添加文字到pdf
                    var imageData = "" + uri + "";
                    // 转png
                    doc.addImage(imageData, 'PNG', 0, 0, width, height);
                    //加载字体包 判断是否添加
                    doc.addFont('SIMYOU-normal.ttf', 'SIMYOU', 'normal');
                    doc.setFont('SIMYOU');
                    // 循环 doc_meta.data_templete
                    doc_meta.data_templete.forEach(element => {
                        doc.setFontSize(element.size || 30);
                        doc.text(element.postiton.x, element.postiton.y, (element.sub || '') + (doc_data[element.valuename] || ' '));
                    });
                    doc.save(doc_meta.doc_name + '.pdf');
                    // 生成成功
                    // 导出pdf
                    NProgress.done();
                    // 进度条结束
                });
            }
        }
    })





