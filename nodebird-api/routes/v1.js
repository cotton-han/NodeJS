const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken, deprecated } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

//NOTE: v1으로 접근한 모든 요청에 deprecated 응답을 보냄
//NOTE: 실제 서비스 운영 시에는 v2가 나왔다고 바로 v1을 닫아 버리기보다는 일정한 기간을 두고 옮겨가는 것이 좋음.
//NOTE: 사용자가 변경된 부분을 자신의 코드에 반영할 시간이 필요하기 때문.
router.use(deprecated);

router.post('/token', async (req, res) => {
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.findOne({
            where: { clientSecret },
            include: {
                model: User,
                attribute: ['nick', 'id'],
            },
        });
        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
            });
        }
        //NOTE: 첫번째 인자 - 토큰의 내용
        //NOTE: 두번째 인자 - 토큰의 비밀키
        //NOTE: 세번째 인자 - 토큰의 설정
        const token = jwt.sign({
            id: domain.user.id,
            nick: domain.user.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '1m', // 유효기간: 1분
            issuer: 'nodebird', // 발급자
        });
        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다',
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});

router.get('/test', verifyToken, (req, res) => {
    // req.decoded : jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    res.json(req.decoded);
});

router.get('/posts/my', verifyToken, (req, res) => {
    Post.findAll({ where: { userId: req.decoded.id } })
        .then((posts) => {
            console.log(posts);
            res.json({
                code: 200,
                payload: posts,
            });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: '서버 에러',
            });
        });
});

router.get('/posts/hashtag/:title', verifyToken, async (req, res) => {
    try {
        const hashtag = await Hashtag.find({ where: { title: req.params.title } });
        if (!hashtag) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다',
            });
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});

module.exports = router;