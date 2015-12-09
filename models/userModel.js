var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// 定义用户表，用户对象模型
var userSchema = new Schema({
		
	email: {			//注册邮箱，唯一
		type:String,
		trim:true
	},
	password: {			//密码段
		type:String,
		trim:true
	},
	nickn: {			//昵称
		type:String,
		trim:true
	},
	image: String,		//用户头像
	selfintro: {		//自我介绍
		type: String,
		default: '闲来无事不从容'
	},  
	mood: {				//近期心情
		type: String,
		default: '平静'
	},
	autograph: {		//用户签名
		type: String,
		default: '暂时沉默中'
	},
	postArticles: {		//保存日记
		type: Schema.Types.ObjectId,
		ref: 'posts'
	},
	follower: {			//被关注，粉丝数
		type: Number,
		default: 0
	},	
	follow: {			//关注数
		type: Number,
		default: 0
	},	
	location: {			//所在地
		type: String,
		default: 'CN'
	},
	last_login: {			
		type: Date,
		default: Date.now
	},
	create_at: {			
		type: Date,
		default: Date.now
	},
	updated_at: {			
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('user', userSchema);//创造model模型
