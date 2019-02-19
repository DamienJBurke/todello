import React, { Component } from "react";
import PropTypes from "prop-types";
import DeleteImage from "../images/noun_cancel_2035020.png"

export default class TasklistItems extends Component {
  state = {
    taskTitle:this.props.task.taskTitle
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault(); 
    this.props.updateTaskName(this.props.task.taskId, this.state.taskTitle);
    this.setState({ taskTitle:this.props.task.taskTitle });
  };

  isChecked = () => {
    if (this.props.task.taskIsComplete) {
    }
  };
  /*
   * -------------- Render -------------------------
   */
  render() {
    return (
      <div style={this.getStyle()}>
        <div style={this.getFormStyle()}>
          <input
            type="checkbox"
            onChange={this.props.markComplete.bind(
              this,
              this.props.task.taskId
            )}
            checked={this.props.task.taskIsComplete ? true : false}
          />
        </div>

        <div style={this.getTextStyle()}>
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              name="taskTitle"
              value={this.state.taskTitle}
              onChange={this.onChange}
              style={this.getCreateStyle()}
              autoComplete="off"
            />
          </form>
        </div>

        <div style={this.getFormStyle()}>
            <input 
              type="image"
              alt="test"
              src={DeleteImage}
              onClick={this.props.deleteTask.bind(this, this.props.task.taskId)}
              style = {this.getDeleteBtnStyle()}
            >
            </input>
          {/* <button
            type="image"
            src="../../public/images/noun_cancel_2035020.png"
            onClick={this.props.deleteTask.bind(this, this.props.task.taskId)}
          >
            (x)
          </button> */}
        </div>
      </div>
    );
  }
  /*
   * -------------- Styles -------------------------
   */
  getStyle = () => {
    return {
      overflow: "hidden"
    };
  };

  getCreateStyle = () => {
    return {
      border: "none",
      borderBottom: "1px solid black",
      width: "80%",
      marginBottom: "10px",
      textDecoration: this.props.task.taskIsComplete ? "line-through" : "none",
      color: this.props.task.taskIsComplete ? "#a1a1a1" : "#000"
    };
  };

  getDeleteBtnStyle = () => {
    return {
    width:"30px",
    height: "30px"
    }
  }

  getFormStyle = () => {
    return {
      position: "relative",
      float: "left"
    };
  };

  getTextStyle = () => {
    return {
      float: "left",
      width: "50%",
      marginLeft: "10px",
      position: "relative",
      textDecoration: this.props.task.taskIsComplete ? "line-through" : "none",
      color: this.props.task.taskIsComplete ? "#a1a1a1" : "#000"
    };
  };
}
TasklistItems.propTypes = {
  task: PropTypes.object.isRequired
};
