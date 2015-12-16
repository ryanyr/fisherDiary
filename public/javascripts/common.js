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
                url : '/admin/content/' + id,
                dateType : 'json',
                type : 'DELETE'
            }).done(function (data) {
                console.log(data);
                if(data){
                    $self.closest('li').remove();
                }
            });
		} else {

		}


	});

	$("#changeinfo").on('click', function() {
		$("#usercenterform").removeClass('hidden');
	});
})