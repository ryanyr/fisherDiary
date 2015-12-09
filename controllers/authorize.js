module.exports = function authorize(req, res){
		var logflag = true;
		if(req.session.user === undefined || req.session.user === null){
            logflag = false;
        }
        return logflag;
	}
