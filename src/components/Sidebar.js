import React, { Component } from "react";
import PropTypes from "prop-types";
import DeleteImage from "../images/noun_cancel_2035020-white.png";
export default class Sidebar extends Component {
  state = {
    label: ""
  };

  onSubmitLabel = e => {
    e.preventDefault();
    this.props.addLabel(this.state.label);
    this.setState({ label: "" });
  };

  onSubmitDeleteLabel = e => {
    e.preventDefault();
    this.props.deleteLabel(1);
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <div style={this.sideNavStyle()}>
        <button onClick={this.props.addTaskList} style={this.newCardStyle()}>
          (+)
        </button>
        <form onSubmit={this.onSubmitLabel}>
          <input
            type="text"
            name="label"
            value={this.state.label}
            onChange={this.onChange}
            placeholder="New Label ..."
            style={this.newLabelStyle()}
            autoComplete="off"
          />
        </form>
        <div>
          {this.props.labels.map((label,index) => (
            <div key={"mykey"+index} style={this.labelsListSytle()}>
              <div style={this.labelTextStyle()}>
              {label.title}
              </div>
                <input
                  type="image"
                  alt="test"
                  src={DeleteImage}
                  onClick={() => { this.props.deleteLabel(label.id)}}
                  style={this.getDeleteBtnStyle()}
                />

              
            </div>
          ))}
        </div>
      </div>
    );
  }
  sideNavStyle = () => {
    return {
      height: "100%" /* Full-height: remove this if you want "auto" height */,
      width: "160px" /* Set the width of the sidebar */,
      position: "fixed" /* Fixed Sidebar (stay in place on scroll) */,
      zIndex: "1" /* Stay on top */,
      top: "10vh" /* Stay at the top */,
      left: "0",
      backgroundColor: "#282c34" /* Black */,
      overflowX: "hidden" /* Disable horizontal scroll */,
      paddingTop: "20px"
    };
  };

  newCardStyle = () => {
    return {
      padding: "10px",
      display: "block",
      margin: "0 auto"
    };
  };

  newLabelStyle = () => {
    return {
      width: "80%",
      display: "block",
      margin: "0 auto",
      marginTop: "10px",
      backgroundColor: "#282c34",
      color: "white",
      border: "none",
      borderBottom: "1px solid gray"
    };
  };
  labelsListSytle= () => {
    return {
      display: "block",
      margin: "0 auto",
      width: "128px",
      marginTop: "10px",
    }
  }
  labelTextStyle = () => {
    return {
      width:"100px",
      display:"inline-flex",
      color: "white",
      border: "none",
      borderBottom: "1px solid gray"
    };
  };
  getDeleteBtnStyle = () => {
    return {
    width:"22px",
    height: "22px",
    display:"inline-flex",
    position:"absolute"
    }
  }
}
Sidebar.propTypes = {
  addTaskList: PropTypes.func.isRequired
};
