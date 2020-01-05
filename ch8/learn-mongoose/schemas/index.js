const mongoose = require('mongoose');

module.exports = () => {
    const connect = () => {
        if(process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        // mongodb://이름:비밀번호@localhost:27017/admin
        mongoose.connect('mongodb://localhost:27017/admin', {
            dbName: 'nodejs',
        }, (error) => {
            if(error){
                console.log('몽고디비 연결 에러', error);
            }
            else{
                console.log('몽고디비 연결 성공');
            }
        });
    };
    connect();
    mongoose.connection.on('error', (error) => {
        console.error('몽고디비 연결 에러');
    });
    mongoose.connection.on('disconnection', () => {
        console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
        connect();
    });
    require('./user');
    require('./comment');
};