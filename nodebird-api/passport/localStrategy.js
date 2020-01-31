const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email', // req.body.email 이름과 동일해야함
        passwordField: 'password', // req.body.password 이름과 동일해야함
    }, async (email, password, done) => { //NOTE: 실제 전략 수행
        try {
            const exUser = await User.findOne({ where: { email } });
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                    // passport.authenticate('local', (authError, user, info))
                    // null --> authError, exUser --> user 에 담김.
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                    // passport.authenticate('local', (authError, user, info))
                    // null --> authError, false --> user, {message: '비밀번호가 일치하지 않습니다.'} --> info 에 담김.
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};