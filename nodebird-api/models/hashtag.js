module.exports = (sequelize, DataTypes) => (
    sequelize.define('hashtag', {
        title: { // 태그 이름
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true,
        },
    }, {
        timestamps: true,
        paranoid: true,
    })
);