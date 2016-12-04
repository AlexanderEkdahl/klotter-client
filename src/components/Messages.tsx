import * as React from "react";
import MapComponent from "./Map";
import MessageList from "./MessageList";
import UserMessages from "./UserMessages";
import NewMessage from "./NewMessage";
import SingleMessageWithComments from "./SingleMessageWithComments";
import { Message } from "../models";
import { Navigation } from "../routes";

interface MessagesProps {
  latitude: number;
  longitude: number;
  messages: Message[];
  userMessages: Message[];
  navigation: Navigation;
  userId: string;
  prevNavigation: Navigation | null;
  navigateTo: (newNavigation: Navigation) => void;
  onMessageSubmit: (value: string) => void;
  onCommentSubmit: (value: string, messageId: number) => void;
}

export default class Messages extends React.Component<MessagesProps, {}> {
  renderNavButton(): JSX.Element {
    const navigation = this.props.navigation;

    switch (navigation.id) {
      case "map":
        return (
          <div onClick={() => { this.props.navigateTo({ id: "list" }); } } >Show list</div>
        );
      case "new_message":
      case "message":
      case "user":
        return (
          <div onClick={() => { this.props.navigateTo(this.props.prevNavigation!); } } >Back</div>
        );
      case "list":
        return (
          <div onClick={() => { this.props.navigateTo({ id: "map" }); } } >Show map</div>
        );
    }
  }

  renderNav() {
    let style: React.CSSProperties = this.props.navigation.id === "new_message" ? styles.hidden : {};

    return (
      <div className={"nav"} style={styles.nav}>
        {this.renderNavButton()}
        <div onClick={() => { this.props.navigateTo({ id: "new_message", prev: this.props.navigation }); } } style={style}>New Message</div>
        <div onClick={() => { this.props.navigateTo({ id: "user", prev: this.props.navigation }); } } style={style}>My activity</div>
      </div>
    );
  }

  renderMain(): JSX.Element {
    const navigation = this.props.navigation;

    switch (navigation.id) {
      case "map":
        return (
          <MapComponent messageView={(messageId) => { this.props.navigateTo({ id: "message", prev: this.props.navigation, messageId: messageId }); } } messages={this.props.messages} longitude={this.props.longitude} latitude={this.props.latitude} />
        );
      case "list":
        return (
          <MessageList messageView={(messageId) => { this.props.navigateTo({ id: "message", prev: this.props.navigation, messageId: messageId }); } } messages={this.props.messages} longitude={this.props.longitude} latitude={this.props.latitude} />
        );
      case "new_message":
        return (
          <NewMessage onSubmit={(value) => { this.props.onMessageSubmit(value); } } />
        );
      case "message":
        const message = this.props.messages.find((x) => x.id === navigation.messageId);

        return (
          <SingleMessageWithComments onCommentSubmit={this.props.onCommentSubmit} message={message!} longitude={this.props.longitude} latitude={this.props.latitude} />
        );
      case "user":
        return (
          <MessageList messageView={(messageId) => { this.props.navigateTo({ id: "message", prev: this.props.navigation, messageId: messageId }); } } messages={this.props.userMessages} longitude={this.props.longitude} latitude={this.props.latitude} />
        );
    }
  }

  render() {
    let main;

    return (
      <div style={styles.container}>
        {this.renderNav()}
        <div className={"mainWrapper"} style={styles.main}>
          {this.renderMain()}
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
  },

  nav: {
    flexShrink: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#FF0000",
    fontSize: 20,
    padding: 12,
    cursor: "pointer",
    textShadow: "1px 1px 0px rgba(0, 0, 0, 0.2)"
  } as React.CSSProperties,

  main: {
    flex: 1,
    height: "100%",
  },

  hidden: {
    display: "none"
  },
};