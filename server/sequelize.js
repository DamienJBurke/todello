const Sequelize = require('sequelize');
const TaskModel = require('./models/task');
const TaskListModel = require('./models/tasklist');
const LabelModel = require('./models/label');


const sequelize = new Sequelize('todo','root','John1994',{
    host: 'localhost',
    dialect: 'mysql',
    pool:{
        max:10,
        min:0,
        acquire:30000,
        idle:10000
    }
});
const Label = LabelModel(sequelize,Sequelize);
const Task = TaskModel(sequelize,Sequelize);
const TaskList = TaskListModel(sequelize,Sequelize);


TaskList.hasMany(Task, {foreignKey: 'tasklistid',sourceKey:'id'});
Task.belongsTo(TaskList, {foreignKey: 'tasklistid',sourceKey:'id'});

TaskList.belongsToMany( Label, {
    as: 'labels',
    through: 'tasklist_labels',//this can be string or a model,
    foreignKey: 'tasklistid'
});

Label.belongsToMany(TaskList, {
    as: 'tasklists',
    through: 'tasklist_labels',
    foreignKey: 'labelid'
});


// Label.associate = (models) => {
//     Label.belongsToMany(models.TaskList, 
//         {through: 'LabelTaskLists',
//          as : 'tasklists',
//          foreignKey:'labelid'});
// }



sequelize.sync(/*{force:true}*/).then(() =>{
    console.log(`Database & tables created!`);
});
 
module.exports = {
    Task,TaskList,Label
};
