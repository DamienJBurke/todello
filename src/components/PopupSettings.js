import React, { Component } from 'react'
import TimeInput from 'react-time-input';

export default class PopupSettings extends Component {
  state = {
    onSchedule:this.props.label[0].onSchedule,
    startTime:this.props.label[0].scheduleStart,
    endTime:this.props.label[0].scheduleEnd
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.updateLabelSettings(this.props.label[0].id,this.state.onSchedule,this.state.startTime,this.state.endTime);

    this.props.toggleSettingsPopup(0)

  }
  onCheckbox = e => e.target.checked ? this.setState({ [e.target.name]: true }) : this.setState({ [e.target.name]: false });
  
  onStartTimeChange = value => { this.setState({startTime:value})};
  onEndTimeChange = value => { this.setState({endTime:value})};

  render() {
    return (
      <div style={this.popupStyle()}>

        <form onSubmit={this.onSubmit}>
        <input
            type="checkbox"
            name="onSchedule"
            onChange={this.onCheckbox}
            checked={this.state.onSchedule}
            
          />
          <TimeInput
            name='startTime'
            initTime={this.state.startTime}
            ref="TimeInputWrapper"
            mountFocus='true'
            onTimeChange={this.onStartTimeChange}
            />
          <TimeInput
            name='endTime'
            initTime={this.state.endTime}
            ref="TimeInputWrapper"
            mountFocus='true'
            onTimeChange={this.onEndTimeChange}
            />
          <button
          >
            SUBMIT
          </button>
        </form>
      </div>
    )
  }

  popupStyle = () => {
      return {
        position: 'fixed',
        width: '100%',
        height: '100%',
        margin: 'auto',
        backgroundColor: '#fff',
      }
  }
}
