/*
 *frontend javascript
 *by RyanYu
 **/

var cm = {};

cm.reg = function() {
	alert("hey");
	var regEmail = $("#regEmail");
	var regPwd = $("#regPwd");
	var regPwd2 = $("#regPwd2");
	var username = $("#username");
	var user = {
		username: username,
		password: regPwd,
		email: regEmail
	}
	$.ajax({
		type: "POST",
		url: "/reg",
		data: user,
		success: function(msg) {
			alert("Data Saved: " + msg);
		}
	});

}