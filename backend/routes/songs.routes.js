const express = require('express');
const controller = require('../controller/songs.controller');
const router = express.Router();

router.get('/', controller.getSongs);

module.exports = router;