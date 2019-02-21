import React, { Component } from "react";
import PropTypes from "prop-types";
import DeleteImage from "../images/noun_cancel_2035020-white.png";
import AddImage from "../images/noun_add_2034915.png";
import settingsImage from "../images/noun_Settings_355459.png";
export default class Sidebar extends Component {
  state = {
    label: ""
  };

  onSubmitLabel = e => {
    e.preventDefault();
    this.props.addLabel(this.state.label);
    this.setState({ label: "" });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <div >
        <div style={this.titleStyle()}>Todello</div>
        <input
                type="image"
                alt="test"
                src={AddImage}
                onClick={this.props.addTaskList}
                style={this.newCardBtnStyle()}
        />
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
          {this.props.labels.map((label, index) => (
            <div key={"mykey" + index} style={this.labelsListSytle()}>
              <div style={this.labelTextStyle(label.id)} onClick={() => {
                    this.props.getLabelTasklist(label.id);
                  }}>
                  {label.title}
              </div>
              <input
                type="image"
                alt="test"
                src={DeleteImage}
                onClick={() => {
                  this.props.deleteLabel(label.id);
                }}
                style={this.labelBtnStyle()}
              />

              <input
                type="image"
                alt="test"
                src={settingsImage}
                onClick={() => {this.props.toggleSettingsPopup(label.id)}}
                style={this.labelBtnStyle()}
              />
            </div>
          ))}
          <div style={this.labelsListSytle()}>
            <div style={this.labelTextStyle(0)} onClick={() => {
                  this.props.getLabelTasklist(0);
                }}>
                All Lists
            </div>
          </div>
          <div style={this.labelsListSytle()}>
            <div style={this.labelTextStyle(null)} onClick={() => {
                  this.props.getLabelTasklist(null);
                }}>
                Scheduled
            </div>
          </div>
        </div>
      </div>
    );
  }
  titleStyle = () => {
    return{
    color: "white",
    textAlign: "center",
    margin:'16px auto',
    display:"block",
    fontWeight:"bold",
    fontSize:"22px"

    }
  }

  newCardBtnStyle = () => {
    return {
      display: "block",
      width: "80px",
      height: "80px",
      margin: "16px auto"
    };
  };

  newLabelStyle = () => {
    return {
      width: "80%",
      display: "block",
      margin: "10px auto",
      backgroundColor: "#282c34",
      color: "white",
      border: "none",
      borderBottom: "1px solid gray"
    };
  };
  labelsListSytle = () => {
    return {
      display: "block",
      width: "128px",
      margin: "5px auto"
    };
  };
  labelTextStyle = (id) => {
    const weight = this.props.selectedLabelId === id ? 'bold' : 'normal'
    return {
      width: "80px",
      display: "inline-flex",
      color: "white",
      border: "none",
      cursor:"pointer",
      fontWeight:weight
    };
  };
  labelBtnStyle = () => {
    return {
      width: "22px",
      height: "22px",
      display: "inline-flex",
      verticalAlign:'bottom'
    };
  };
}
Sidebar.propTypes = {
  addTaskList: PropTypes.func.isRequired
};
