const express  = require('express');
const router = express.Router();

router.post('/signup', handleUserSignUp);

router.post('/login', handleUserLogin);

module.exports = router;