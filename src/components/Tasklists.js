import React, { Component } from "react";
import PropTypes from "prop-types";
import TasklistItems from "./TasklistItems";

import DeleteImage from "../images/noun_cancel_2035020-white.png";
import Dropdowns from "./Dropdowns"
import "./Dropdown.css"
export default class Tasklists extends Component {
  state = {
    title: "",
    listTitle: this.props.tasklist.listTitle,
    label:""
  };

  /*
   * -------------- Functions -------------------------
   */
  onSubmit = e => {
    e.preventDefault();
    this.props.addTask(this.props.tasklist.listId, this.state.title);
    this.setState({ title: "" });
  };

  onSubmitListTitle = e => {
    e.preventDefault();
    this.props.updateTaskListName(
      this.props.tasklist.listId,
      this.state.listTitle
    );
    this.setState({ listTitle: this.props.tasklist.listTitle });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  testDropDown = (selected="Please select") => {
    this.setState({label: selected})
  };
  /*
   * -------------- Functions -------------------------
   */
  render() {
    return (
      <React.Fragment>
        {/* 
          Title and Delete  
        */}
        
        <div style={this.getCardTitleStyle()}>
        
          {/* 
          Form to allow edit of title name 
          */}
          <form onSubmit={this.onSubmitListTitle} style={this.titleDivStyle()}>
            <input
              type="text"
              name="listTitle"
              value={this.state.listTitle}
              placeholder="Tasklist name..."
              onChange={this.onChange}
              style={this.getTitleStyle()}
              autoComplete="off"
            />
          </form>
            <Dropdowns 
              title="Select label"
              tasklistId={this.props.tasklist.listId}
              tasklistLabels={this.props.tasklist.labels}
              list ={this.props.labels}
              toggleLabelSelection={this.props.toggleLabelSelection}
            />
          {/* 
          Delete tasklist button  
          */}
          <input
            type="image"
            alt="test"
            src={DeleteImage}
            onClick={this.props.deleteTaskList.bind(
              this,
              this.props.tasklist.listId
            )}
            style={this.getDeleteBtnStyle()}
          />

          

        </div>
        {/* 
          Create and List tasks 
        */}
        <div style={this.listStyle()}>
          {/* 
          Create task form
          */}
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              name="title"
              placeholder="New task..."
              value={this.state.title}
              onChange={this.onChange}
              style={this.getCreateStyle()}
              autoComplete="off"
            />
          </form>

          {/* 
          List the tasks in tasklist 
          */}
          <div style={this.taskListStyle()}>
            {this.props.tasklist.tasks.map(task => (
              <TasklistItems
                key={task.taskId}
                task={task}
                markComplete={this.props.markComplete}
                updateTaskName={this.props.updateTaskName}
                deleteTask={this.props.deleteTask}
                style={this.taskListStyle()}
              />
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }

  /*
   * -------------- Styles -------------------------
   */
  getCreateStyle = () => {
    return {
      border: "none",
      borderBottom: "1px solid black",
      width: "80%",
      marginBottom: "10px"
    };
  };
  getCardTitleStyle = () => {
    return {
      background: "#282c34",
      padding: "10px",
    };
  };

  getDeleteBtnStyle = () => {
    return {
      width: "30px",
      height: "30px",
      float:"right"
    };
  };

  getTitleStyle = () => {
    return {
      background: "#282c34",
      border: "none",
      width: "100%",
      fontSize: "20px",
      textAlign: "center",
      color: "white"
    };
  };

  listStyle = () => {
    return {
      textAlign: "left",
      padding: "10px"
    };
  };
  taskListStyle = () => {
    return {
      width: "100%",

      position: "relative"
    };
  };
  titleDivStyle = () => {
    return {
      width: "100%"
    };
  };
}

Tasklists.propTypes = {
  tasklist: PropTypes.object.isRequired,
  markComplete: PropTypes.func.isRequired
};
