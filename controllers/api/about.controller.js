var express = require('express');
var config = require('config');
var router = express.Router();

// routes
router.get('/', about);

module.exports = router;

async function getVersion() {
   return {
      version: config.version,
      date: config.date
   }
}

async function about(req, res) {
   let info = await getVersion();
   res.send(
      info
   );
}
