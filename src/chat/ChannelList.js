import React from "react";
import { Channel } from "./Channel";
import "./chat.scss";

export class ChannelList extends React.Component {
  state = { input_value: "" };

  handleClick = (id) => {
    this.props.onSelectChannel(id);
  };

  send = () => {
    if (this.state.input_value && this.state.input_value != "") {
      this.props.onUpdateProfile(this.state.input_value);
      // this.setState({ input_value: "" });
    }
  };

  handleInput = (e) => {
    this.setState({ input_value: e.target.value });
  };

  render() {
    let list = (
      <div className="no-content-message">There is no channels to show</div>
    );
    if (this.props.channels && this.props.channels.map) {
      list = this.props.channels.map((c) => (
        <Channel
          key={c.id}
          id={c.id}
          name={c.name}
          participants={c.participants}
          onClick={this.handleClick}
        />
      ));
    }
    return (
      <div className="channel-list">
        {list}
        <div className="messages-input">
          <input
            type="text"
            onChange={this.handleInput}
            value={this.state.input_value}
          />
          <br></br>
          <button onClick={this.send}>Update profile</button>
        </div>
      </div>
    );
  }
}
