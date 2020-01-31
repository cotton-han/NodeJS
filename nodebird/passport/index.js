//NOTE: 로그인 과정을 어떻게 처리할지 설명하는 파일
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const github = require('./githubStrategy');

const { User } = require('../models');

//REF: 로그인 과정
//REF: 1. 로그인 요청이 들어옴
//REF: 2. passport.authenticate 메서드 호출
//REF: 3. 로그인 전략 수행
//REF: 4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출 (여기까지는 로컬로그인, SNS 계정로그인 동일)
//REF: 5. req.login 메서드가 passport.serializeUser 호출
//REF: 6. req.session 에 사용자 아이디만 저장
//REF: 7. 로그인 완료

//REF: 로그인 이후 과정
//REF: 1. 모든 요청에 passport.session() 미들웨어가 passport.deserializeUser 메서드 호출
//REF: 2. req.session 에 저장된 아이디로 데이터베이스에서 사용자 조회
//REF: 3. 조회된 사용자 정보를 req.user 에 저장
//REF: 4. 라우터에서 req.user 객체 사용 가능

//NOTE: serializeUser 는 사용자 정보 객체를 세션에 아이디로 저장
//NOTE: deserializeUser 는 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러옴.
module.exports = (passport) => {
    //NOTE: req.session 객체에 어떤 데이터를 저장할지 선택
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    //NOTE: 매 요청 시 실행 - passport.session() 미들웨어가 호출
    //NOTE: serializeUser 에서 세션에 저장했던 id 받아 사용자 정보 조회
    passport.deserializeUser((id, done) => {
        User.findOne({
            where: { id },
            include: [{
                model: User,
                attribute: ['id', 'nick'], // NOTE: 비밀번호 조회 방지
                as: 'Followers',
            }, {
                model: User,
                attribute: ['id', 'nick'],
                as: "Followings"
            }],
        })
            .then(user => done(null, user)) // req.user 에 저장
            .catch(err => done(err));
    });

    local(passport);
    kakao(passport);
    github(passport);
};