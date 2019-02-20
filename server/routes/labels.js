var express = require('express');
var router = express.Router();
var LabelController = require('../controllers/labelcontroller')

/* GET home page. */
router.get('/', LabelController.getLabels);

router.post('/addLabel',LabelController.createLabel)

router.post('/deleteLabel',LabelController.deleteLabel )

router.post('/setSchedule',LabelController.setSchedule )

router.post('/unsetSchedule',LabelController.unsetSchedule )

module.exports = router;

