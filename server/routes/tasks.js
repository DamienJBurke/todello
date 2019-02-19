var express = require('express');
var router = express.Router();
var TaskController = require('../controllers/taskcontroller')

/* GET home page. */
router.get('/', TaskController.lists);

router.put('/deleteList',TaskController.delete_list)

router.put('/deleteTask',TaskController.delete_task)

router.post('/addList',TaskController.create_list)

router.post('/addTask',TaskController.create_task)

router.put('/updateListName',TaskController.update_list_name)

router.post('/updateTaskState',TaskController.toggle_state_task)

router.post('/updateTaskName',TaskController.update_task_name)

router.post('/updateTaskListLabels',TaskController.update_labels)

module.exports = router;
