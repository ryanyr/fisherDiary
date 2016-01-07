/*
 *frontend javascript
 *by RyanYu
 **/

var cm = {};

$(function() {

	var concatCon = function() {
		var cons = $(".postCondetail");
		cons.each(function() {
			var con = $(this).text().toString();
			if (con.length > 100) {
				con = con.substring(0, 100) + '...';
				$(this).html('<p>' + con + '</p>');
			}
		});
	}
	concatCon();

	$("#deletePost").on('click', function() {
		if (confirm("确定要删除吗?")) {
			var postid = $(this).attr('postid');
			console.log(postid);
			$.ajax({
                url : '/delete/' + postid,
                dateType : 'json',
                type : 'DELETE'
            }).done(function (data) {
                console.log(data);
                if(data){
                    alert("删除成功");
                    window.location.href = '/userPage';
                }
            });
		} else {

		}


	});

	$("#changeinfo").on('click', function() {
		$("#usercenterform").removeClass('hidden');
	});

$("#updateuserinfo").click(function(){
	var nickn = $("#nickn").val();
	var mood = $("#mood").val();
	var autograph = $("#autograph").val();
	var selfintro = $("#selfintro").val();
	var upic = $("#upic").val();
	var data = {
		nickn : nickn,
		mood : mood,
		autograph : autograph,
		selfintro : selfintro,
		upic : upic
	};
	$.ajax({
           type: "POST",
           url: "/user/updateUserinfo",
           data: data,
           beforeSend: function(){
           },
           success: function(data){
            alert('上传成功！');
            window.location.reload();
           }
        });
	});

})