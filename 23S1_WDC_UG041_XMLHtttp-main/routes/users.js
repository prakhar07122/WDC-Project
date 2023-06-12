var express = require('express');
var router = express.Router();
const sanitizeHtml = require('sanitize-html');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.use('/', function (req, res, next) {
  if (!('user' in req.session)) {
    res.sendStatus(403);
  } else {
    next();
  }
});

module.exports = router;
