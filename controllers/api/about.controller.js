var express = require('express');
var config = require('config');
var router = express.Router();

// routes
router.get('/', about);

module.exports = router;

function about(req, res) {
   res.send(
      {
         version: config.version
      }
   );
}
