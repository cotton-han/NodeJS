module.exports = (sequelize, DataTypes) => (
    sequelize.define('domain', {
        host: {
            type: DataTypes.STRING(80),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        clientSecret: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
    }, {
        validate: { // NOTE: 데이터를 추가로 검증하는 속성
          unknownType() { // 검증기 : 어기면 에러 발생
              console.log(this.type, this.type !== 'free', this.type !== 'premium');
              if(this.type !== 'free' && this.type !== 'premium') {
                  throw new Error('type 컬럼은 free나 preminum이어야 합니다.');
              }
          },
        },
        timestamps: true, // createdAt, updatedAt
        paranoid: true,  // deleteAt
    })
);