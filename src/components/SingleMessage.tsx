import * as React from "react";
import { IMessage } from "../models";

interface ISingleMessageProps {
  message: IMessage;
  distance: number;
  styles?: React.CSSProperties;
}

const messageColors = ["#ff6666", "#6d72c4", "#a37aa2", "#73886e", "#ef9820"];

function messageColor(id: number): string {
  return messageColors[id % messageColors.length];
}

export default class SingleMessage extends React.Component<ISingleMessageProps, {}> {
  render() {
    const message = this.props.message;
    const style = { ...styles.message, ...this.props.styles, backgroundColor: messageColor(message.id) };

    return (
      <div style={style}>
        <span style={styles.content}>{message.content}</span>
        <div style={styles.footer}>
          <span>{message.createdAt.fromNow()}</span>
          <span>{this.props.distance.toFixed(0)}m away</span>
        </div>
      </div>
    );
  }
}

export const styles = {
  message: {
    color: "white",
    padding: 8,
    borderRadius: 3,
    margin: 4,
  },

  content: {
    fontSize: 18,
  },

  footer: {
    justifyContent: "space-between",
    fontSize: 14,
    display: "flex",
    marginTop: 8,
  } as React.CSSProperties,
};
