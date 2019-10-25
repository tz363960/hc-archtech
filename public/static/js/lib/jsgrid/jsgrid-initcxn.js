$(function () {      //$(function(){})表示等页面加载完毕后发生此函数内容
    $("#jsGrid").jsGrid({	// 标签得是jsGrid
        height: "100%",
        width: "100%",
        filtering: false,   //启动查找
        editing: false,      //启动编辑
        inserting: false,    //启动插入
        sorting: false,
        paging: true,       //启动分页
        autoload: true,
        pageSize: 6,
        pageButtonCount: 5,
        pagePrevText: "前一页",
        pageNextText: "后一页",
        pageFirstText: "第一页",
        pageLastText: "末页",
        deleteConfirm: "Do you really want to delete the client?",  //删除确认的文本
        controller: forgedb,
        fields: [
            { name: "Title", title: "任务", type: "textarea", width: 120, align: "center" },
            { name: "Type", title: "类型", type: "textarea", width: 50, align: "center" },
            { name: "CreatedBy", title: "由谁创建", type: "textarea", width: 100, align: "center" },
            { name: "ModifiedBy", title: "上传时间", type: "textarea", align: "center" },
            { name: "AssignedTo", type: "textarea", title: "分配给", items: forgedb.engineers, valueField: "Id", textField: "Title", align: "center" },
            { name: "Priority", title: "优先级", type: "textarea", width: 80, align: "center" },
            { name: "Status", title: "状态", type: "textarea", width: 50, align: "center" },
            { name: "Major", title: "专业", type: "textarea", width: 120, align: "center" },
            { type: "control" }
        ]
    });

    let divLength = 0;
    document.onclick = function () {    //有点击事件，如果表格内容发生变化，则执行以下语句
        if ($("#jsGrid")[0].innerHTML.length != divLength) {
            var tables = document.getElementsByClassName("jsgrid-cell");
            for (var i = 0; i < tables.length; i++) {   // 改变字体颜色
                switch (tables[i].innerHTML) {
                    case "紧急":
                        tables[i].style.color = "red";
                        break;
                    case "次要":
                        tables[i].style.color = "#5394b2";
                        break;
                    case "正常":
                        tables[i].style.color = "#759c75";
                        break;
                    case "主要":
                        tables[i].style.color = "#ef9311";
                        break;
                }
            }

            fName = $(".jsgrid-row");
            for (var i = 0; i < fName.length; i++) {
                fName[i].firstElementChild.innerHTML = "<a class='issue-detail-link' href='javascript:void(0)'>" + fName[i].firstElementChild.innerText + " </a>"
                fName[i].firstElementChild.onclick = function () {
                    var trNode = this.parentNode;   //this获取到点击的对象本身
                    showTaskFloat(trNode);
                }
            }

            fName = $(".jsgrid-alt-row");
            for (var i = 0; i < fName.length; i++) {
                fName[i].firstElementChild.innerHTML = "<a class='issue-detail-link' href='javascript:void(0)'>" + fName[i].firstElementChild.innerText + " </a>"
                fName[i].firstElementChild.onclick = function () {
                    var trNode = this.parentNode;
                    showTaskFloat(trNode);  //点击便会产生这个事件
                }
            }
            divLength = $("#jsGrid")[0].innerHTML.length;
        }
    }

    //弹出用户设计变更资料窗口
    function showTaskFloat(tempData) {
        var myfloat = ($.ajax({     //同步方法得到temp-float-window.html的值
            url: "/temp-float-window.html",
            async: false
        })).responseText;
        $("#my-float-window").html(myfloat);
        myfloat = $("#cc-modal-mask")[0];
        myfloat.getElementsByClassName("issue-rulename")[0].innerText = "专业：" + tempData.childNodes[7].innerText;
        var h3Name = myfloat.getElementsByTagName("h3"); //只要把getElementsByTagName这个函数放到延时里面，点击便会改变内容
        h3Name[0].innerText = "#160 " + tempData.childNodes[0].innerText;
        var floatNum = myfloat.getElementsByTagName("td")    //找到所有td标签中的数据，这个是根据自己的页面处理
        for (var i = 0; i < floatNum.length; i = i + 2) {
            switch (floatNum[i].innerHTML) {
                case "状态":
                    floatNum[i + 1].innerText = tempData.childNodes[6].innerText;
                    break;
                case "优先级:":
                    floatNum[i + 1].innerText = tempData.childNodes[5].innerText;
                    break;
                case "到期时间:":
                    floatNum[i + 1].innerText = tempData.childNodes[3].innerText;
                    break;
                case "类型:":
                    floatNum[i + 1].innerText = tempData.childNodes[1].innerText;
                    break;
                case "发起人:":
                    floatNum[i + 1].innerText = tempData.childNodes[0].innerText;
                    break;
                case "创建时间:":
                    floatNum[i + 1].innerText = tempData.childNodes[3].innerText;
                    break;
                case "分配给:":
                    floatNum[i + 1].innerText = tempData.childNodes[2].innerText;;
                    break;
            }
        }
        $("#close-modal").on('click', function () {
            $("#cc-modal-mask").remove();   // 此命令是删除，删掉浮动窗口
        });
    }

    // 加载协同设计录入页面
    $("#CoDesign").on("click", function () {
        $("#co-design-window").load("temp-user-profile.html", function (data) {
            $("#close-modal").on('click', function () {
                $("#cc-modal-mask").remove();   // 此命令是删除，删掉浮动窗口
            });
        });
    })
});
//
var forgeTableHead = new Vue({
    el: '#vueHeader',
    data: {
        userChineseName: decodeURI(decodeURI(document.cookie.match(/username=(\S*);/)[1]))  // js截取两个字符串之间的内容
    }
})
