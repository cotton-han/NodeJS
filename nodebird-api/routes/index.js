const express = require('express');
const uuidv4 = require('uuid/v4');
const { User, Domain } = require('../models');

const router = express.Router();

router.get('/', (req, res, next) => {
    User.findOne({
        where: { id: req.user && req.user.id || null },
        include: { model: Domain },
    })
        .then((user) => {
            res.render('login', {
                user,
                loginError: req.flash('loginError'),
                domains: user && user.domains,
            });
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/domain', (req, res, next) => {
    Domain.create({
        userId: req.user.id,
        host: req.body.host,
        type: req.body.type,
        // 범용 고유 식별자 : 고유한 문자열을 사용하기 위함
        clientSecret: uuidv4(),
    })
        .then(() => {
            res.redirect('/');
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;