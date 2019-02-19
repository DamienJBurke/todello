module.exports = (sequelize,type) => {
    const TaskList=  sequelize.define('tasklist', {
        id: {
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name: type.STRING,
        is_archived: type.BOOLEAN,
    });


    TaskList.createList = () => {
        return TaskList.create({
            name:'',
            is_archived: 0
        });
    };

    TaskList.changeListState = (listId) => {
        return TaskList.findOne({
            where: {
                id: listId
            }
        }).then(list => {
                if (list.is_archived === false) {
                    TaskList.update({
                        is_archived: 1
                    }, {
                        where: {
                            id: listId
                        }
                    });
                } else {
                    TaskList.update({
                        is_archived: 0
                    }, {
                        where: {
                            id: listId
                        }
                    });
                }
            });
    };

    TaskList.updateName = (newName,listId) => {
        return TaskList.update({
            name: newName
        }, {
            where: {
                id: listId
            }
        });
    };


    TaskList.deleteList = (listId) => {
        return TaskList.destroy({
            where: {
                id: listId
            }
        });
    };
    return TaskList;
};