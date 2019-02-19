import React, { Component } from "react";
import PropTypes from "prop-types";
import Tasklists from "./Tasklists";
export default class Cards extends Component {
  /*
   * -------------- Render -------------------------
   */
  render() {
    return this.props.tasklists.map((list,index) => (
      <div style={this.getCardStyle()} key={"mykey"+index} draggable="true" >
        <Tasklists
          tasklist={list}
          labels={this.props.labels}
          toggleLabelSelection={this.props.toggleLabelSelection}
          markComplete={this.props.markComplete}
          addTask={this.props.addTask}
          deleteTask={this.props.deleteTask}
          deleteTaskList={this.props.deleteTaskList}
          updateTaskListName={this.props.updateTaskListName}
          updateTaskName={this.props.updateTaskName}
        />
      </div>
    ));
  }

  /*
   * -------------- Styles -------------------------
   */
  getCardStyle = () => {
    return {
      background: "#fff",
      width: "30%",
      left: "25%",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      margin: "10px",
      float: "left",
      resize: "both"
    };
  };
}
Cards.propTypes = {
  tasklists: PropTypes.array.isRequired,
  markComplete: PropTypes.func.isRequired
};
