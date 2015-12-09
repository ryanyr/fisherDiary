var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// 定义日记表，日记对象模型
var postSchema = new Schema({
	postTitle: String,
	postMarkdown: String,
	html: String,
	pimage: String,
	authorid: Schema.Types.ObjectId,
	authorname: String, 	
	published_at: {			
		type: Date,
		default: Date.now
	},
	updated_at: {			
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('post', postSchema);//创造model模型
