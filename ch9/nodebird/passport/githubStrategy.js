const GitHubStrategy = require('passport-github').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "/auth/github/callback"
        }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log("accessToken: ",accessToken);
            console.log("profile: ",profile);
            const exUser = await User.find({ where: { snsId: profile.id, provider: 'github' } });
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile.emails[0].value,
                    nick: profile.username,
                    snsId: profile.id,
                    provider: 'github',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
