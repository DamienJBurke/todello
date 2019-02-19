module.exports = (sequelize,type) => {
    const Task = sequelize.define('task', {
        id: {
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        content: type.STRING,
        is_complete: type.BOOLEAN,
    });

    Task.createTask = (cont,listId) => {
        return Task.create({
            content: cont,
            is_complete: 0,
            tasklistid: listId,
        });
    };

    Task.changeTaskState = (taskId) => {
        return Task.findOne({
            where: {
                id: taskId
            }
        }).then(task => {
                console.log(task.is_complete)
                if (task.is_complete === false) {
                    Task.update({
                        is_complete: 1
                    }, {
                        where: {
                            id: taskId
                        }
                    });
                } else {
                    Task.update({
                        is_complete: 0
                    }, {
                        where: {
                            id: taskId
                        }
                    });
                }
    });
    };

    Task.updateTaskContent = (cont,taskId) => {
        return Task.update({
            content: cont
        }, {
            where: {
                id: taskId
            }
        });
    };

    Task.deleteTask = (taskId) => {
        return Task.destroy({
            where: {
                id: taskId
            }
        });
    };


    return Task;
};