const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/flash', function (req, res) {
  req.session.message = '세션 메시지';
  req.flash('message', 'flash 메시지');
  res.redirect('/users/flash/result');
});

router.get('/flash/result', function (req, res) {
  res.send(`${req.session.message} ${req.flash('message')}`); // ${req.flash('message')} --> 처음에는 보이나 창을 새로고침하면 사라짐.(일회성)
});

module.exports = router;
