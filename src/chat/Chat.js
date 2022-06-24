import React from "react";
import { ChannelList } from "./ChannelList";
import "./chat.scss";
import { MessagesPanel } from "./MessagesPanel";
import socketClient from "socket.io-client";
const SERVER = "http://localhost:3001";
export class Chat extends React.Component {
  state = {
    channels: null,
    socket: null,
    channel: null,
    name: "",
  };
  socket;
  componentDidMount() {
    this.loadChannels();
    this.configureSocket();
  }

  configureSocket = () => {
    var socket = socketClient(SERVER);
    socket.on("connection", () => {
      if (this.state.channel) {
        this.handleChannelSelect(this.state.channel.id);
      }
    });
    socket.on("channel", (channel) => {
      let channels = this.state.channels;
      channels.forEach((c) => {
        if (c.id === channel.id) {
          c.participants = channel.participants;
        }
      });
      this.setState({ channels });
    });
    socket.on("message", (message) => {
      let channels = this.state.channels;
      channels.forEach((c) => {
        if (c.id === message.channel_id) {
          if (!c.messages) {
            c.messages = [message];
          } else {
            c.messages.push(message);
          }
        }
      });
      this.setState({ channels });
    });
    this.socket = socket;
  };

  loadChannels = async () => {
    fetch("http://localhost:3001/getChannels").then(async (response) => {
      let data = await response.json();
      this.setState({ channels: data.channels });
    });
  };

  updateProfile = async () => {
    fetch("http://localhost:3001/profile").then(async (response) => {
      let data = await response.json();
      this.setState({ channels: data.channels });
    });
  };

  handleChannelSelect = (id) => {
    let channel = this.state.channels.find((c) => {
      return c.id === id;
    });
    this.setState({ channel });
    this.socket.emit("channel-join", id, (ack) => {});
  };

  handleSendMessage = (channel_id, text) => {
    if (text.startsWith("http")) {
      this.socket.emit("send-message", {
        channel_id,
        text: "",
        senderName: this.socket.id,
        id: Date.now(),
        image: text,
      });
    } else {
      this.socket.emit("send-message", {
        channel_id,
        text,
        senderName: this.socket.id,
        id: Date.now(),
      });
    }
  };

  handleUpdateProfile = (name) => {
    console.log("handleUpdateProfile", this.socket.id);
    console.log("handleUpdateProfile", name);
    fetch("http://localhost:3001/profile", {
      method: "post",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        id: this.socket.id,
        name: name,
      }),
    }).then(async (response) => {
      this.setState({
        name: name,
      });
    });
  };

  render() {
    return (
      <div className="chat-app">
        <ChannelList
          onUpdateProfile={this.handleUpdateProfile}
          channels={this.state.channels}
          onSelectChannel={this.handleChannelSelect}
        />

        <MessagesPanel
          onSendMessage={this.handleSendMessage}
          channel={this.state.channel}
        />
      </div>
    );
  }
}
