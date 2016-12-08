import * as React from "react";
import { IMessage } from "../models";
import { Routes } from "../routes";
import Header from "./Header";
import MapComponent from "./Map";
import MessageList from "./MessageList";
import NewMessage from "./NewMessage";
import SingleMessageWithComments from "./SingleMessageWithComments";
import UserMessages from "./UserMessages";

interface IMainProps {
  height: number;
  latitude: number;
  longitude: number;
  messages: IMessage[];
  userMessages: IMessage[];
  route: Routes;
  navigateTo: (newRoute: Routes) => void;
  onMessageSubmit: (value: string) => void;
  onCommentSubmit: (value: string, messageId: number) => void;
}

export default class Main extends React.Component<IMainProps, {}> {
  renderMain(): JSX.Element {
    const route = this.props.route;
    const props = {
      longitude: this.props.longitude,
      latitude: this.props.latitude,
    };

    switch (route.id) {
      case "map":
        return (
          <MapComponent messageView={(messageId) => { this.props.navigateTo({ id: "message", prev: this.props.route, messageId: messageId }); } } messages={this.props.messages} {...props} />
        );
      case "list":
        return (
          <MessageList messageView={(messageId) => { this.props.navigateTo({ id: "message", prev: this.props.route, messageId: messageId }); } } messages={this.props.messages} {...props} />
        );
      case "message":
        const message = this.props.messages.find((x) => x.id === route.messageId);

        return (
          <SingleMessageWithComments message={message!} {...props} />
        );
      case "user":
        return (
          <UserMessages messageView={(messageId) => { this.props.navigateTo({ id: "message", prev: this.props.route, messageId: messageId }); } } messages={this.props.userMessages} {...props} />
        );
    }
  }

  renderFooter(): JSX.Element {
    const route = this.props.route;

    switch (route.id) {
            case "message":
                return (
                    <NewMessage onSubmit={(value) => { this.props.onCommentSubmit(value, route.messageId); } } placeholder="Add comment" />
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
        <Header navigateTo={this.props.navigateTo} route={this.props.route} />
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
