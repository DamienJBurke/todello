import React, { Component } from "react";
import uuidv4 from "uuid/v4";
import Cards from "./components/Cards";
import Sidebar from "./components/Sidebar";
import PopupSettings from "./components/PopupSettings";


class App extends Component {
  state = {
    tasklists: [],
    labels: [
      // {
      //   id: uuidv4(),
      //   title:"Work",
      // },
    ],
    selectedTasklists: [],
    showPopup: false,
    popupLabel: null,
    selectedLabelId: null
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

  fetchRequest = async (address, method, dataToUpdate, args = {}) => {
    //Create request based on arguments
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
      request = { method };
    }
    // try request
    try {
      const response = await fetch(address, request);
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      this.setState({
        [dataToUpdate]: json
      });
    } catch (err) {
      console.log("Caught it!", err);
    }
  };

  async componentDidMount() {
    try {
      await this.fetchRequest("tasks", "GET", "tasklists");
      await this.getLabelTasklist(null);
      await this.fetchRequest("labels", "GET", "labels");
    } catch (err) {
      console.log("Caught it!", err);
    }
  }

  markComplete = async id => {
    console.log(id);
    // this.setState({
    //   tasklists: this.state.tasklists.map(tasklist => {
    //     tasklist.tasks.map(task => {
    //       if (task.taskId === id) {
    //          task.taskIsComplete = task.taskIsComplete ? true : false;
    //       }
    //       return task;
    //     });
    //     return tasklist;
    //   }),

    // });
    this.setState({
      selectedTasklists: this.state.selectedTasklists.map(tasklist => {
        tasklist.tasks.map(task => {
          if (task.taskId === id) {
            //task.taskIsComplete = task.taskIsComplete === true ? console.log(task.taskIsComplete) : console.log(task.taskIsComplete);
            if (task.taskIsComplete) {
              task.taskIsComplete = false;
            } else {
              task.taskIsComplete = true;
            }
          }
          return task;
        });
        return tasklist;
      })
    });
    try {
      await this.fetchRequest("tasks/updateTaskState", "POST", "tasklists", {
        taskId: id
      });
    } catch (err) {
      console.log("Caught it!", err);
    }
  };

  addTask = async (listId, title) => {

    this.setState({
      selectedTasklists: this.state.selectedTasklists.map(tasklist => {
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
    try {
      await this.fetchRequest("tasks/addTask", "POST", "tasklists", {
        listId: listId,
        title: title
      });
      this.getLabelTasklist(this.state.selectedLabelId);
    }catch(err){

    }
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
    this.setState({
      selectedTasklists: this.state.selectedTasklists.map(tasklist => {
        if (tasklist.listId === listId) {
          tasklist.listTitle = title;
        }
        return tasklist;
      })
    });
    this.fetchRequest("tasks/updateListName", "PUT", "tasklists", {
      listId: listId,
      title: title
    });
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

    this.setState({
      selectedTasklists: this.state.selectedTasklists.map(tasklist => {
        tasklist.tasks.map(task => {
          if (task.taskId === taskId) {
            task.taskTitle = title;
          }
          return task;
        });
        return tasklist;
      })
    });
    this.fetchRequest("tasks/updateTaskName", "POST", "tasklists", {
      taskId: taskId,
      title: title
    });
  };

  deleteTask = id => {
    this.setState({
      tasklists: this.state.tasklists.map(tasklist => {
        tasklist.tasks = [...tasklist.tasks.filter(task => task.taskId !== id)];
        return tasklist;
      })
    });

    this.setState({
      selectedTasklists: this.state.selectedTasklists.map(tasklist => {
        tasklist.tasks = [...tasklist.tasks.filter(task => task.taskId !== id)];
        return tasklist;
      })
    });
    this.fetchRequest("tasks/deleteTask", "PUT", "tasklists", { id: id });
  };

  deleteTaskList = id => {
    //OPTIMISTIC UPDATES

    //UPDATE THE STATE FIRST
    this.setState({
      tasklists: [
        ...this.state.tasklists.filter(tasklist => tasklist.listId !== id)
      ],
      selectedTasklists: [
        ...this.state.selectedTasklists.filter(
          tasklist => tasklist.listId !== id
        )
      ]
    });
    //UPDATE DATABASE
    this.fetchRequest("tasks/deleteList", "PUT", "tasklists", { id: id });
  };

  addTaskList = () => {
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
      ],
      selectedTasklists: [
        ...this.state.selectedTasklists,
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
    this.fetchRequest("tasks/addList", "POST", "tasklists");
  };

  addLabel = async title => {
    this.setState({
      labels: [
        ...this.state.labels,
        {
          id: uuidv4(),
          title
        }
      ]
    });

    try{
      await this.fetchRequest("labels/addLabel", "POST", "labels", { title: title });

    }catch(err){
      console.log("Caught it!", err);
    }
  };

  deleteLabel = async id => {
    //UPDATE LABEL STATE
    this.setState({
      labels: this.state.labels.filter(label => label.id !== id)
    });

    try{
      //REMOVE LABEL FROM DATABASE AND UPDATE STATE
      await this.fetchRequest("labels/deleteLabel", "POST", "labels", { id });

      //UPDATE STATE OF TASKLISTS AS TO ENSURE ui SHOWS CORREXT LASBEL-TASKLIST ASSOCIATION.
      await this.fetchRequest("tasks", "GET", "tasklists");

      this.getLabelTasklist(this.state.selectedLabelId)

    }catch(err){
      console.log("Caught it!", err);
    }

  };

  toggleLabelSelection = async (listId, labelId, labelTitle) => {
    try{
      await this.fetchRequest("tasks/updateTaskListLabels", "POST", "tasklists", {
        listId: listId,
        labelId: labelId
      });

      this.getLabelTasklist(this.state.selectedLabelId)
    }catch(err){
      console.log("Caught it!", err);
    }    

    
  };

  getLabelTasklist = (labelId = 0) => {
    //if label is not 0 , then we want to filter
    if (labelId > 0) {
      //filter tasks based on if the labelId is in tasklist
      this.setState({
        selectedTasklists: this.state.tasklists
          .map(tasklist => {
            const labelIds = tasklist.labels.map(el => el.id);
            if (labelIds.includes(labelId)) {
              return tasklist;
            } else {
              return null;
            }
          })
          .filter(el => el != null),
          selectedLabelId:labelId

      });
    }
    // else , just return the full tasklist data
    else if (labelId === 0) {
      this.setState({
        selectedTasklists: this.state.tasklists.map(el => el),
        selectedLabelId:labelId

      });
    } else {
      //get the tasklist data according to schedule
      this.setState({
        selectedTasklists: this.state.tasklists.filter(tasklist =>
          this.displayTasklist(tasklist),
          
        ),
        selectedLabelId:labelId
      });
    }
  };

  displayTasklist(tasklist) {
    if (tasklist.labels.length === 0) {
      return false;
    }
    for (var i = 0; i < tasklist.labels.length; i++) {
      if (
        tasklist.labels[i].onSchedule &&
        this.getScheduledTasklists(
          tasklist.labels[i].scheduleStart,
          tasklist.labels[i].scheduleEnd
        )
      ) {
        return true;
      }
    }
    return false;
  }

  getScheduledTasklists(startTime, endTime) {
    // var startTime = '20:10:10';
    // var endTime = '22:30:00';
    const currentDate = new Date();

    let startDate = new Date(currentDate);
    startDate.setHours(startTime.split(":")[0]);
    startDate.setMinutes(startTime.split(":")[1]);
    startDate.setSeconds(startTime.split(":")[2]);

    let endDate = new Date(currentDate);
    endDate.setHours(endTime.split(":")[0]);
    endDate.setMinutes(endTime.split(":")[1]);
    endDate.setSeconds(endTime.split(":")[2]);

    if (endDate - startDate < 0) {
      endDate.setDate(endDate.getDate() + 1);
    }
    return startDate < currentDate && endDate > currentDate;
  }

  updateLabelSettings = async (labelId, onSch, start, end) => {
    console.log(onSch);
    if (onSch) {
      await this.fetchRequest("labels/setSchedule", "POST", "labels", {
        id: labelId,
        startTime: start,
        endTime: end
      });
    } else {
      await this.fetchRequest("labels/unsetSchedule", "POST", "labels", {
        id: labelId
      });
    }
  };

  toggleSettingsPopup = labelId => {
    this.setState({
      showPopup: !this.state.showPopup,
      popupLabel: this.state.labels.filter(label => label.id === labelId)
    });
  };

  /*
   * -------------- Render -------------------------
   */

  render() {
    return (
      <div style={this.appStyle()}>
        <div style={this.sideNavStyle()}>
        <Sidebar
          deleteLabel={this.deleteLabel}
          labels={this.state.labels}
          addTaskList={this.addTaskList}
          addLabel={this.addLabel}
          getLabelTasklist={this.getLabelTasklist}
          toggleSettingsPopup={this.toggleSettingsPopup}
          selectedLabelId={this.state.selectedLabelId}
        />
        </div>
        
        <div style={this.mainStyle()}>
          
          <React.Fragment>
            <Cards
              tasklists={this.state.selectedTasklists}
              labels={this.state.labels}
              toggleLabelSelection={this.toggleLabelSelection}
              markComplete={this.markComplete}
              addTask={this.addTask}
              deleteTask={this.deleteTask}
              deleteTaskList={this.deleteTaskList}
              updateTaskListName={this.updateTaskListName}
              updateTaskName={this.updateTaskName}
            />
            {this.state.showPopup ? (
              <PopupSettings
                toggleSettingsPopup={this.toggleSettingsPopup}
                updateLabelSettings={this.updateLabelSettings}
                label={this.state.popupLabel}
              />
            ) : null}
          </React.Fragment>
        </div>
      </div>
    );
  }

  /*
   * -------------- Styles -------------------------
   */

  appStyle = () => {
    return{
      ':hover':{
        outline:'none'
      }
    }
  } 
  mainStyle = () => {
    return {
      marginLeft: "150px",
    };
  };
  sideNavStyle = () => {
    return {
      height: "100%" /* Full-height: remove this if you want "auto" height */,
      width: "150px" /* Set the width of the sidebar */,
      position: "fixed" /* Fixed Sidebar (stay in place on scroll) */,
      zIndex: "2" /* Stay on top */,
      top: "0" /* Stay at the top */,
      left: "0",
      backgroundColor: "#282c34" /* Black */,
      overflowX: "hidden" /* Disable horizontal scroll */,
      padding:"10px",
      boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    };
  };
}

export default App;
