const express = require('express');
const router = express();
const college = require('../controllers/Colleges');


router.route('/getColleges').get(college.getColleges);
router.route('/addCollege').post(college.addCollege);

module.exports = router;