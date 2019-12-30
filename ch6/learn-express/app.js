const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//test
// app.use(function (req, res, next) {
//   console.log(req.url, '저도 미들웨어입니다');
//   next();
// });

//NOTE: 요청에 대한 정보 콘솔 기록 --> 개발 시 : short, dev | 배포 시 : common, combined
app.use(logger('dev'));

//NOTE: 정적인 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

//NOTE: 요청의 본문 해석 --> body-parser는 express에 포함. 그러나 Raw, Text 형식의 본문을 해석하기 위해서는 별도로 body-parser 설치 필요
app.use(express.json()); // json 형식
app.use(express.urlencoded({ extended: false })); // 주소 형식 (쿼리 스트링 해석)
                                                  // extended 가 true 면 qs 모듈(querystring 모듈 확장) 이용, false 면 querystring 모듈 이용
//app.use(bodyParser.raw()); // raw 형식
//app.use(bodyParser.text()); // text 형식

//NOTE: 요청에 동봉된 쿠키 해석 --> req.cookies 객체애 들어감.
app.use(cookieParser());
//app.use(cookieParser('secret code')); // 서명된(암호화된) 쿠키가 있는 경우, 제공한 문자열을 키로 삼아 복호화할 수 있음.

//NOTE: 세션 관리용 미들웨어 ---> 로그인 등의 이유로 세션 구현할 때 유용. req.session 객체 생성.
//NOTE: req.session.destroy() - 세션 한번에 삭제. | req.sessionID - 세션 ID 확인
app.use(session({
  resave: false, // 요청이 왔을 때, 수정사항이 생기지 않더라도 세션을 다시 저장할지에 대한 설정
  saveUninitialized: false, // 세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 설정
  secret: 'secret code', // cookie-parser 의 비밀키 역할 (cookie-parser 의 secret 과 같게 설정)
  cookie: {
    httpOnly: true, // 클라이언트에서 쿠키를 확인하지 못하게 함.
    secure: false // https 가 아닌 환경에서도 사용 가능. 배포 시에는 true 로 설정하는 것이 좋음.
  },
  //store 옵션 : 현재는 메모리에 세션 저장(서버 재시작하면 초기화되는 단점) --> 데이터베이스 연결해 세션 유지. 보통 Redis 가 자주 쓰임.
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
