const express = require('express');
const router = express();
const user = require('../controllers/Users');
router.route('/profile').get(user.profile);
router.route('/login').post(user.login);
router.route('/register').post(user.register);
router.route('/updateProfile/:id').post(user.updateProfile);
router.route('/deleteProfile').post(user.deleteProfile);
router.route('/addRole').post(user.addRole);
router.route('/getRole').get(user.getRole);

module.exports = router;