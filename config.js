var config = {

    cookieSecret : "fishDiary",
    database : {
        client : 'mongodb',
        connection : {
            host : 'localhost',
            port: '27017',
            database : 'fisher'
        }
    },
    dbConnectString: 'mongodb://localhost:27017/fisher' 

};

module.exports = config;