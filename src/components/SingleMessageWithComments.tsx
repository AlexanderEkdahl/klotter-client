import * as React from "react";
import { Message } from "../models";
import * as moment from "moment";
import haversine from "../haversine";
import SingleMessage from "./SingleMessage";

interface SingleMessageWithCommentsProps {
  latitude: number;
  longitude: number;
  message: Message;
}

interface SingleMessageWithCommentsState {
  value: string;
}

export default class SingleMessageWithComments extends React.Component<SingleMessageWithCommentsProps, SingleMessageWithCommentsState> {
  constructor() {
    super();

    this.state = {
      value: "",
    };
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  render() {
    const distance = haversine(this.props.latitude, this.props.longitude, this.props.message.latitude, this.props.message.longitude);

    const comments = this.props.message.comments.map((comment, i) => {
      return (
        <div key={i} style={styles.comment}>
          <span>{comment.content}</span>
          <span style={styles.time}>{comment.createdAt.fromNow()}</span>
        </div>
      );
    });

    return (
      <div>
        <SingleMessage message={this.props.message} distance={distance} />
        <div style={styles.hr} />
        {comments}
      </div>
    );
  }
}

const styles = {
  hr: {
    marginTop: 8,
    borderTop: "1px solid #ccc",
    marginBottom: 8,
  },

  comment: {
    display: "block",
    marginBottom: 12,
    marginLeft: 8,
    marginRight: 8,
  },

  time: {
    display: "block",
    color: "rgb(125, 125, 125)",
  },
};