const { Task, TaskList, Label } = require("../sequelize");

//const async = require('async');

exports.tasks = (req, res) => {
  res.send("Hello");
};

exports.test = async (req, res) => {
  TaskList.findOne({
    where: { id: 1 }
  }).then(list => {
    Label.findOne({
      where: { id: 3 }
    }).then(label => {
      list.addLabel(label);
    });
  });
  //await TaskList.addLabel({id:3},{listId:1});
  await TaskList.findAll({
    include: [
      {
        model: Label,
        as: "labels",
        attributes: ["title"],
        required: false,
        through: {
          attributes: []
        }
      }
    ]
  }).then(tasklists => res.json(tasklists));
};

exports.lists = (req, res) => {
  TaskList.findAll({
    include: [
      {
        model: Label,
        as: "labels",
        attributes: ["id", "title"],
        required: false,
        through: {
          attributes: []
        }
      }
    ],
    where: {
      is_archived: 0
    }
  }).then(tasklists => {
    Task.findAll().then(tasks => {
      const mydata = tasklists.map(listEl => ({
        listId: listEl.id,
        listTitle: listEl.name,
        isArchived: listEl.is_archived,
        createdAt: listEl.createdAt,
        updatedAt: listEl.updatedAt,
        tasks: tasks
          .map(taskEl => {
            if (taskEl.tasklistid === listEl.id) {
              return {
                taskTitle: taskEl.content,
                taskId: taskEl.id,
                taskIsComplete: taskEl.is_complete
              };
            }
          })
          .filter(Element => Element != null),
        labels: listEl.labels
      }));
      //console.log(mydata[0].tasks)
      res.json(mydata);
      // res.render('task', {
      //     title: 'Organize My life',
      //     data: mydata
      // });
    });
  });
};

exports.archived_lists = (req, res) => {
  TaskList.findAll({
    where: {
      is_archived: 1
    }
  }).then(tasklists => {
    Task.findAll().then(tasks => {
      const mydata = tasklists.map(listEl => [
        listEl.id,
        listEl.name,
        listEl.is_archived,
        tasks
          .map(taskEl => {
            if (taskEl.tasklistid === listEl.id) {
              return [taskEl.content, taskEl.id, taskEl.is_complete];
            }
          })
          .filter(Element => Element != null)
      ]);

      console.log(mydata);
      res.render("task", {
        title: "Organize My life",
        data: mydata
      });
    });
  });
};

exports.create_task = async (req, res) => {
  await Task.createTask(req.body.title, req.body.listId);
  await this.lists(req, res);
};

exports.create_list = async (req, res) => {
  await TaskList.createList();
  await this.lists(req, res);
};

exports.toggle_state_task = async (req, res) => {
  await Task.changeTaskState(req.body.taskId);
  await this.lists(req, res);
};

exports.toggle_state_list = async (req, res) => {
  await TaskList.changeListState(req.body.listId);
  await this.lists(req, res);
};

exports.update_task_name = async (req, res) => {
  await Task.updateTaskContent(req.body.title, req.body.taskId);
  await this.lists(req, res);
};

exports.update_list_name = async (req, res) => {
  await TaskList.updateName(req.body.title, req.body.listId);
  await this.lists(req, res);
};

exports.update_labels = async (req, res) => {
  const list = await TaskList.findOne({ where: { id: req.body.listId } });
  const label = await Label.findOne({ where: { id: req.body.labelId } });
  if(await list.hasLabel(label)){
    await list.removeLabel(label)
  }
  else {
    await list.addLabel(label);
  }
  await this.lists(req, res);
};

exports.delete_task = async (req, res) => {
  await Task.deleteTask(req.body.id);
  await this.lists(req, res);
};

exports.delete_list = async (req, res) => {
  await TaskList.deleteList(req.body.id);
  await this.lists(req, res);
};
