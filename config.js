var config = {

    cookieSecret : "fisherDiary",
    database : {
        client : 'mongodb',
        connection : {
            host : '127.0.0.1',
            port: '27017',
            database : 'fisher'
        }
    },
    dbConnectString: 'mongodb://127.0.0.1:27017/fisher' 

};

module.exports = config;