const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan'); // 로깅 모듈
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport'); // passport 모듈
require('dotenv').config(); // .env 파일 참조

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // false 면 querystring || true 면 querystring 확장모듈 qs 사용
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(flash());
app.use(passport.initialize()); // NOTE: req 객체에 passport 설정 심음.
app.use(passport.session()); // NOTE: req.session 객체에 passport 정보 저장.
// NOTE: req.session 객체는 express-session 에서 생성하기 때문에 passport 미들웨어는 express-session  미들웨어보다 뒤에 연결

app.use('/', pageRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
