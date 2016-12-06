import * as React from "react";
import MapComponent from "./Map";
import MessageList from "./MessageList";
import UserMessages from "./UserMessages";
import Header from "./Header";
import NewMessage from "./NewMessage";
import SingleMessageWithComments from "./SingleMessageWithComments";
import { Message } from "../models";
import { Navigation } from "../routes";

interface MainProps {
  height: number;
  latitude: number;
  longitude: number;
  messages: Message[];
  userMessages: Message[];
  navigation: Navigation;
  prevNavigation: Navigation | null;
  navigateTo: (newNavigation: Navigation) => void;
  onMessageSubmit: (value: string) => void;
  onCommentSubmit: (value: string, messageId: number) => void;
}

export default class Main extends React.Component<MainProps, {}> {
  renderMain(): JSX.Element {
    const navigation = this.props.navigation;
    const props = {
      longitude: this.props.longitude,
      latitude: this.props.latitude,
    };

    switch (navigation.id) {
      case "map":
        return (
          <MapComponent messageView={(messageId) => { this.props.navigateTo({ id: "message", prev: this.props.navigation, messageId: messageId }); } } messages={this.props.messages} {...props} />
        );
      case "list":
        return (
          <MessageList messageView={(messageId) => { this.props.navigateTo({ id: "message", prev: this.props.navigation, messageId: messageId }); } } messages={this.props.messages} {...props} />
        );
      case "message":
        const message = this.props.messages.find((x) => x.id === navigation.messageId);

        return (
          <SingleMessageWithComments message={message!} {...props} />
        );
      case "user":
        return (
          <UserMessages messageView={(messageId) => { this.props.navigateTo({ id: "message", prev: this.props.navigation, messageId: messageId }); } } messages={this.props.userMessages} {...props} />
        );
    }
  }

  renderFooter(): JSX.Element {
    const navigation = this.props.navigation;

    switch (navigation.id) {
            case "message":
                return (
                    <NewMessage onSubmit={(value) => { this.props.onCommentSubmit(value, navigation.messageId); } } placeholder="Add comment" />
                );
            case "map":
            case "user":
            case "list":
                return (
                    <NewMessage onSubmit={(value) => { this.props.onMessageSubmit(value); } } placeholder="New Message" />
                );
        }
  }

  render() {
    return (
      <div>
        <Header navigateTo={this.props.navigateTo} navigation={this.props.navigation} prevNavigation={this.props.prevNavigation}></Header>
        <div style={{height: this.props.height - 90, overflow: "scroll"}}>
          {this.renderMain()}
        </div>
        <div style={{height: 40}}>
          {this.renderFooter()}
        </div>
      </div>
    );
  }
}