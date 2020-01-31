const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {Post, Hashtag, User} = require('../models');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();
fs.readdir('uploads', (error) => {
   if(error) {
       console.log('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
       fs.mkdirSync('uploads');
   }
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const  ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // NOTE: 파일명에 날짜값을 붙이는 이유: 중복방지
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024}, // NOTE: 10MB
});

// NOTE: single - 하나의 이미지 업로드
// NOTE: array - 여러개 이미지 업로드(하나의 속성에 이미지 여러개)
// NOTE: fields - 여러개 이미지 업로드(여러개 속성에 이미지 여러개)
// NOTE: none - 이미지 없이 데이터만 multipart 형식으로 전송
// 이미지 업로드 처리
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file); // 이미지들은 모두 req.file 에 담김
    res.json({url: `/img/${req.file.filename}`}); // req.file.filename 은 게시글 등록할 때 이용
});

const upload2 = multer();

// 게시글 업로드 처리
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => { // 이미지가 온게 아니라 이미지 주소가 온 것 => none
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if(hashtags) {
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where: {title: tag.slice(1).toLowerCase()},
            })));
            await post.addHashtags(result.map(r => r[0])); // NOTE: ???
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/hashtag', async (req, res, next) => {
   const query = req.query.hashtag;
   if (!query) {
       return res.redirect('/');
   }
   try {
       const hashtag = await Hashtag.findOne({ where: { title: query } });
       let posts = [];
       if(hashtag) {
           posts = await hashtag.getPosts({include: [{model: User}]}); // NOTE: include = JOIN
       }
       return res.render('main', {
           title: `${query} | NodeBird`,
           user: req.user,
           twits: posts,
       });
   } catch (error) {
       console.error(error);
       return next(error);
   }
});

module.exports = router;