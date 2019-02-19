import React, { Component } from "react";
import uuidv4 from "uuid/v4";
import "./App.css";
import Cards from "./components/Cards";
import Sidebar from "./components/Sidebar";

class App extends Component {
  state = {
    tasklists: [],
    labels: [
      // {
      //   id: uuidv4(),
      //   title:"Work",
      // },
    ]
  };
  /*
  state = {
    tasklists: [
      {
        listId: uuidv4(),
        listTitle: "My First Task",
        isArchived: false,
        createdAt: "yesterday",
        updatedAt: "today",
        tasks: [
          {
            taskId: uuidv4(),
            taskTitle: "Do task",
            taskIsComplete: false
          },
          {
            taskId: uuidv4(),
            taskTitle: "Do task 2",
            taskIsComplete: false
          }
        ]
        labels: [
          {
            id:1,
            title:1
          }
        ]
      },
    ]
  };
  */

  /*
   * -------------- Functions -------------------------
   */

  fetchRequest = (address, method, dataToUpdate, args = {}) => {
    let request = {};
    if (method === "POST" || method === "PUT") {
      request = {
        method,
        body: JSON.stringify(args),
        headers: {
          "Content-Type": "application/json"
        }
      };
    } else if (method === "GET") {
      request = {
        method: "GET"
      };
    }
    fetch(address, request)
      .then(res => {
        if (res.status >= 400) {
          throw new Error("Bad response from server");
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          [dataToUpdate]: data
        });
      })
      .catch(err => {
        console.log("Caught it!", err);
      });
  };

  componentDidMount() {
    this.fetchRequest("tasks", "GET", "tasklists");
    this.fetchRequest("labels", "GET", "labels");
  }

  markComplete = id => {
    this.setState({
      tasklists: this.state.tasklists.map(tasklist => {
        tasklist.tasks.map(task => {
          if (task.taskId === id) {
            task.taskIsComplete = !task.taskIsComplete;
          }
          return task;
        });
        return tasklist;
      })
    });

    this.fetchRequest("tasks/updateTaskState", "POST", 'tasklists',{taskId:id});
  };

  addTask = (listId, title) => {
    this.setState({
      tasklists: this.state.tasklists.map(tasklist => {
        if (tasklist.listId === listId) {
          tasklist.tasks.push({
            taskId: uuidv4(),
            taskTitle: title,
            isComplete: false
          });
        }
        return tasklist;
      })
    });

    this.fetchRequest("tasks/addTask", "POST", 'tasklists',{ listId: listId, title: title });
  };

  updateTaskListName = (listId, title) => {
    this.setState({
      tasklists: this.state.tasklists.map(tasklist => {
        if (tasklist.listId === listId) {
          tasklist.listTitle = title;
        }
        return tasklist;
      })
    });
    this.fetchRequest("tasks/updateListName", "PUT", 'tasklists',{ listId: listId, title: title });
  };

  updateTaskName = (taskId, title) => {
    this.setState({
      tasklists: this.state.tasklists.map(tasklist => {
        tasklist.tasks.map(task => {
          if (task.taskId === taskId) {
            task.taskTitle = title;
          }
          return task;
        });
        return tasklist;
      })
    });
    this.fetchRequest("tasks/updateTaskName", "POST", 'tasklists',{ taskId: taskId, title: title });
  };

  deleteTask = id => {
    this.setState({
      tasklists: this.state.tasklists.map(tasklist => {
        tasklist.tasks = [...tasklist.tasks.filter(task => task.taskId !== id)];
        return tasklist;
      })
    });
    this.fetchRequest("tasks/deleteTask", "PUT", 'tasklists',{ id: id });
  };

  deleteTaskList = id => {
    //OPTIMISTIC UPDATES

    //UPDATE THE STATE FIRST
    this.setState({
      tasklists: [
        ...this.state.tasklists.filter(tasklist => tasklist.listId !== id)
      ]
    });
    //UPDATE DATABASE
    this.fetchRequest("tasks/deleteList", "PUT", 'tasklists',{ id: id });
  };

  addTaskList = async () => {
    //UPDATE THE STATE FIRST
    this.setState({
      tasklists: [
        ...this.state.tasklists,
        {
          listId: uuidv4(),
          listTitle: "",
          isArchived: false,
          createdAt: "",
          updatedAt: "",
          tasks: [],
          labels: []
        }
      ]
    });
    //UPDATE DATABASE
    this.fetchRequest("tasks/addList", "POST", 'tasklists');
  };

  addLabel = title => {
    this.setState({
      labels: [
        ...this.state.labels,
        {
          id: uuidv4(),
          title
        }
      ]
    });
    this.fetchRequest("labels/addLabel", "POST", 'labels',{ title: title });
  };

  deleteLabel = id => {
    //UPDATE LABEL STATE
    this.setState({
      labels: this.state.labels.filter(label => label.id !== id)
    });

    //REMOVE LABEL FROM DATABASE AND UPDATE STATE
    this.fetchRequest("labels/deleteLabel", "POST", 'labels',{ id });

    //UPDATE STATE OF TASKLISTS AS TO ENSURE ui SHOWS CORREXT LASBEL-TASKLIST ASSOCIATION.
    this.fetchRequest("tasks", "GET", 'tasklists');
  };

  toggleLabelSelection = (listId, labelId, labelTitle) => {
    this.setState({
      tasklists: this.state.tasklists.map(tasklist => {
        if (tasklist.listId === listId) {
          //Check if labelId is already tasklist labels
          const labelIds = tasklist.labels.map(el => el.id);

          //if true, remvoe from list in tasklist
          if (labelIds.includes(labelId)) {
            tasklist.labels = tasklist.labels.filter(item => {
              return item.id !== labelId;
            });
          }
          // add to list
          else {
            tasklist.labels.push({
              id: labelId,
              title: labelTitle
            });
          }
        }
        return tasklist;
      })
    });

    this.fetchRequest("tasks/updateTaskListLabels", "POST", 'tasklists',{ listId: listId, labelId: labelId });
  };

  /*
   * -------------- Render -------------------------
   */

  render() {
    return (
      <div>
        <header className="App-header">
          <div>Todello</div>
        </header>
        <Sidebar
          deleteLabel={this.deleteLabel}
          labels={this.state.labels}
          addTaskList={this.addTaskList}
          addLabel={this.addLabel}
        />
        <div style={this.mainStyle()}>
          <React.Fragment>
            <Cards
              tasklists={this.state.tasklists}
              labels={this.state.labels}
              toggleLabelSelection={this.toggleLabelSelection}
              markComplete={this.markComplete}
              addTask={this.addTask}
              deleteTask={this.deleteTask}
              deleteTaskList={this.deleteTaskList}
              updateTaskListName={this.updateTaskListName}
              updateTaskName={this.updateTaskName}
            />
          </React.Fragment>
        </div>
      </div>
    );
  }

  /*
   * -------------- Styles -------------------------
   */

  mainStyle = () => {
    return {
      marginLeft: "160px"
    };
  };
}

export default App;
