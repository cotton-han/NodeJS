const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

//NOTE: 데이터베이스 자동 생성 명령어 - sequelize db:create

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);

//NOTE: User 모델과 Post 모델은 1:N 관계 - Post 모델에 userId 컬럼 추가
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

//NOTE: Post 모델과 Hashtag 모델은 N:M 관계 - 중간에 관계 테이블 생성(PostHashtag 테이블 자동 생성...컬럼 이름은 postId, hashtagId)
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });

//NOTE: User 모델 간 N:M 관계(팔로잉 기능)
//NOTE: 같은 모델 간 N:M 관계에서는 모델 이름과 컬럼 이름을 따로 정해야 함.(UserUser(X))
db.User.belongsToMany(db.User, {
  foreignKey: 'followingId', // 컬럼 이름
  as: 'Followers', // 시퀄라이즈가 JOIN 시 사용할 이름
  through: 'Follow', // 모델 이름
});
db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings', // 시퀄라이즈가 JOIN 시 사용할 이름
  through: 'Follow', // 모델 이름
});

module.exports = db;