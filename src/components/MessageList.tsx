import * as React from "react";
import haversine from "../haversine";
import { IMessage } from "../models";
import SingleMessage from "./SingleMessage";

interface IMessageListProps {
  latitude: number;
  longitude: number;
  messages: IMessage[];
  messageView: (messageId: number) => void;
}

export default class MessageList extends React.Component<IMessageListProps, {}> {
  render() {
    const messagesMarkup = this.props.messages.map((message, i) => {
      const distance = haversine(this.props.latitude, this.props.longitude, message.latitude, message.longitude);

      if (distance < 100) {
        return (
          <div key={i} onClick={() => { this.props.messageView(message.id); } }>
            <SingleMessage message={message} distance={distance} />
          </div>
        );
      }
    });

    return (
      <div>
        {messagesMarkup}
      </div>
    );
  }
}
