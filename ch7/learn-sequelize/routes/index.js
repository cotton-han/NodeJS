var express = require('express');
var User = require('../models').User;

var router = express.Router();

/* GET home page. */
//NOTE: 프로미스
router.get('/', function(req, res, next) {
  User.findAll()
      .then((users) => {
        res.render('sequelize', {users});
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
});

// //NOTE: async/await 문법
// router.get('/', async (req, res, next) => {
//   try{
//     const users = await User.findAll();
//     res.render('sequelize', {users});
//   }
//   catch (err) {
//     console.error(err);
//     next(err);
//   }
// });

module.exports = router;
