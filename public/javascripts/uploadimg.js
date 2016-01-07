var filechooser = document.getElementById("choose");
var uploadImgBox;
// 用于压缩图片的canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');
// 瓦片canvas
var tCanvas = document.createElement("canvas");
var tctx = tCanvas.getContext("2d");
var maxsize = 100 * 1024;
$("span.upload-img-box").on("click", function () {
    uploadImgBox = $(this);
    var tarImg = $(this).find('img:first');
    // 如果用户已上传图片，点击之后直接查看图片
    // 否则就是打开图片上传对话框
    if (tarImg.length > 0 && tarImg.attr('data-upload') === 'true'){
        disUploadedImg(tarImg.attr('src'));
        return;
    }
    var label = $(this).data('label');
    $(filechooser).data('label', label);
    var pathName = $(this).data('pathname');
    $(filechooser).data('pathname', pathName);

    // 清除file input控件的value属性的值，
    // 这样当用户第二次选择同样的图片时onchange事件才会触发
    filechooser.value = '';
    filechooser.click();
})
.on("touchstart", function () {
    $(this).addClass("touch");
})
.on("touchend", function () {
    $(this).removeClass("touch");
});
if (filechooser !== null){
    filechooser.onchange = function () {
        var _this = $(this);
        if (!this.files.length) return;
        var files = Array.prototype.slice.call(this.files);
        if (files.length > 1) {
            alert("一次只能上传1张图片");
            return;
        }
        files.forEach(function (file, i) {
            if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
            var reader = new FileReader();
            var div = document.createElement("div");
            $(div).addClass('img-uploading');
            // 获取图片大小
            var size = file.size/1024 > 1024 ? (~~(10*file.size/1024/1024))/10 + "MB" :  ~~(file.size/1024) + "KB";
            var progress = $('<div class="progress"><span></span></div><div class="size">'+size+'</div>'); // 进度条
            // $(div).data('title', _this.data('title'));
            $(div).data('label', _this.data('label'));
            $(div).data('pathname', _this.data('pathname'));
            $(div).append(progress);
            uploadImgBox.append($(div));
            // $(".img-list").append($(div));
            reader.onload = function () {
                var result = this.result;
                var img = new Image();
                img.src = result;
                $(div).css("background-image", "url(" + result + ")");
                //如果图片大小小于100kb，则直接上传
                if (result.length <= maxsize) {
                    img = null;
                    upload(result, file.type, $(div));
                    return;
                }
                // 图片加载完毕之后进行压缩，然后上传
                if (img.complete) {
                    callback();
                } else {
                    img.onload = callback;
                }
                function callback() {
                    var data = compress(img);
                    upload(data, file.type, $(div));
                    img = null;
                }
            };
            reader.readAsDataURL(file);
        });
    };
}
// 使用canvas对大图片进行压缩
function compress(img) {
    var initSize = img.src.length;
    var width = img.width;
    var height = img.height;
    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    var ratio;
    if ((ratio = width * height / 4000000)>1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    }else {
        ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
    // 铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //如果图片像素大于100万则使用瓦片绘制
    var count;
    if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片
        // 计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height);
    }
    //进行最小压缩
    var ndata = canvas.toDataURL('image/jpeg', 0.1);
    // console.log('压缩前：' + initSize);
    // console.log('压缩后：' + ndata.length);
    // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
}
// 图片上传，将base64的图片转成二进制对象，塞进formdata上传
function upload(basestr, type, $div) {
    var text = window.atob(basestr.split(",")[1]);
    var buffer = new Uint8Array(text.length);
    var pecent = 0 , loop = null;
    for (var i = 0; i < text.length; i++) {
        buffer[i] = text.charCodeAt(i);
    }
    var blob = getBlob(buffer, type);
    var xhr = new XMLHttpRequest();
    var formdata = new FormData();
    formdata.append('imagefile', blob);

    var pathname = ($div.data('pathname') && $div.data('pathname').length > 0) ? '?pathname=' + $div.data('pathname') : '';
    xhr.open('post', '/user/uploadimages' + pathname);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var jsonData = JSON.parse(xhr.responseText);
            clearInterval(loop);
            //当收到该消息时上传完毕
            $div.find(".progress span").animate({'width': "100%"}, pecent < 95 ? 200 : 0, function () {
                $(this).html("上传成功");
                $('#upic').val(jsonData.filePath);
                setTimeout(function(){
                    $div.remove();
                }, 500);
            });
            var label = $div.data('label');
            var tarEle = $('span.upload-img-box[data-label="' + label + '"]');
            tarEle.find('img:first').css('width', '100%').attr('src', jsonData.filePath).attr('data-upload', 'true');
            tarEle.find('img:last').show();
        }
    };
    //数据发送进度，前50%展示该进度
    xhr.upload.addEventListener('progress', function (e) {
        if (loop) return;
        pecent = ~~(100 * e.loaded / e.total) / 2;
        $div.find(".progress span").css('width', pecent + "%");
        if (pecent == 50) {
            mockProgress();
        }
    }, false);
    //数据后50%用模拟进度
    function mockProgress() {
        if (loop) return;
        loop = setInterval(function () {
            pecent++;
            $div.find(".progress span").css('width', pecent + "%");
            if (pecent == 99) {
                clearInterval(loop);
            }
        }, 100);
    }
    xhr.send(formdata);
}
// 获取blob对象的兼容性写法
function getBlob(buffer, format){
    var Builder = window.WebKitBlobBuilder || window.MozBlobBuilder;
    if(Builder){
        var builder = new Builder;
        builder.append(buffer);
        return builder.getBlob(format);
    } else {
        return new window.Blob([ buffer ], {type: format});
    }
}


// 删除已上传图片
$('span.upload-img-box>img.close-upload-img').on('click', function(event) {
    event.stopPropagation();
    $(this).prev().css('width', '').attr('src', '/images/camera.png').attr('data-upload', 'false');
    $(this).hide();
});

function ismobile(){
    var mobile = $('#mobilenum').val();
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    return myreg.test(mobile);
}
//上传用户信息
$("#uploadinfo").click(function(){
    var mobilenum = $("#mobilenum").val();
    if(($("#certipic").attr('src'))=='/images/camera.png'){
        alert('请上传行驶证照');
    }else if(!ismobile()){
        alert('请输入正确的手机号');
    }else if(checkuser()==1){
        alert('该手机已经提交信息');
    }else{
        var certipic = $("#certipic").attr('src');
        var data = {
            mobile : mobilenum,
            certipic : certipic
        };
        $.ajax({
           type: "POST",
           url: "/activity/act/GL",
           data: data,
           beforeSend: function(){
           },
           success: function(data){
            alert('上传成功！');
            localStorage.setItem("gluser",data.user);
            localStorage.setItem("gpic",data.picurl);
            window.location.reload();
           }
        });
    }
});

function checkuser() {
    var mobilenum = $("#mobilenum").val();
    var data = {
        mobile: mobilenum
    };
    var uflag;
    $.ajax({
        async: false,
        type: "POST",
        url: "/activity/act/GL/checkuser",
        data: data,
        beforeSend: function() {

        },
        success: function(data) {          
            uflag = data.flag;
        }
    });
    return uflag;
}

$('#mobilenum').change(function(){
    console.log(checkuser());
});

$(function() {
    var user = localStorage.getItem("gluser");
    var gpic = localStorage.getItem("gpic");
    if (user&&gpic) {
        $("#unloged").hide();
        $("#loged").show();
        $("#guser").text('手机号：' + user);
        $("#gpic").attr("src",gpic);
    }
})