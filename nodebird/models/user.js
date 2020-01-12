module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        email: {
            type: DataTypes.STRING(40),
            allowNull: true,
            unique: true,
        },
        nick: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        provider: { // 카카오로그인 or 로컬로그인
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
        snsId: { // SNS 로그인 했을 경우
            type: DataTypes.STRING(30),
            allowNull: true,
        },
    }, {
        timestamps: true, // createdAt, updatedAt
        paranoid: true,  // deleteAt
    })
);