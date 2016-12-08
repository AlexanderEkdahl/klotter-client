import * as React from "react";
import Main from "./Main";
import * as moment from "moment";
import * as update from "immutability-helper";
import { Navigation, NotFound } from "../routes";
import { Message, Comment } from "../models";
import Router from "./Router";
import watchPosition from "../watchPosition";

const logo = require<string>("./logo.png");

const enum LocationStatus {
  Initializing,
  Watching,
  Unavailable,
  Failed,
}

interface ApplicationProps {
  navigation: Navigation | NotFound;
  navigateTo: (navigation: Navigation) => void;
}

interface ApplicationState {
  locationStatus: LocationStatus;
  position: Position | null;
  messages: Message[];
  userMessages: Message[];
  userId: string;
}

function userId(): string {
  let id = localStorage.getItem("user_id");

  if (id == null) {
    id = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 20; i++)
      id += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  localStorage.setItem("user_id", id);

  return id;
}

class Application extends React.Component<ApplicationProps, ApplicationState> {
  watchID: number;

  constructor() {
    super();

    this.state = {
      locationStatus: LocationStatus.Initializing,
      position: null,
      messages: [],
      userMessages: [],
      userId: userId(),
    };
  }

  componentDidMount() {
    if ("geolocation" in navigator) {
      this.watchID = watchPosition((position) => {
        Promise.all([this.fetchMessages(position), this.fetchUserMessages(this.state.userId)]).then((messages) => {
          this.setState({
            locationStatus: LocationStatus.Watching,
            position: position,
            messages: messages[0],
            userMessages: messages[1],
          });
        });
      }, () => {
        this.setState({
          locationStatus: LocationStatus.Failed,
          position: null,
        });
      });
    } else {
      this.setState({
        locationStatus: LocationStatus.Unavailable,
        position: null,
        messages: [],
      });
    }
  }

  fetchMessages(position: Position): Promise<Message[]> {
    const url = `https://klotter.ekdahl.io/get?x=${position.coords.longitude}&y=${position.coords.latitude}`;

    return new Promise<Message[]>((resolve, reject) => {
      fetch(url).then((response) => {
        return response.json();
      }).then((json: any) => {
        const messages = json.map((message: any) => {
          return {
            id: message.id,
            content: message.message,
            createdAt: moment(message.created_at),
            latitude: message.y,
            longitude: message.x,
            comments: message.Comments.map((comment: any) => {
              return {
                id: comment.id,
                content: comment.content,
                createdAt: moment(comment.created_at),
              };
            })
          };
        });

        resolve(messages);
      });
    });
  }

  fetchUserMessages(user_id: string): Promise<Message[]> {
    const url = `https://klotter.ekdahl.io/get_user?user_id=${user_id}`;

    return new Promise<Message[]>((resolve, reject) => {
      fetch(url).then((response) => {
        return response.json();
      }).then((json: any) => {
        const messages = json.map((message: any) => {
          return {
            id: message.id,
            content: message.message,
            createdAt: moment(message.created_at),
            latitude: message.y,
            longitude: message.x,
            comments: message.Comments.map((comment: any) => {
              return {
                id: comment.id,
                content: comment.content,
                createdAt: moment(comment.created_at),
              };
            })
          };
        });

        resolve(messages);
      });
    });
  }

  onMessageSubmit(value: string) {
    const url = `https://klotter.ekdahl.io/post`;
    const data = {
      message: value,
      x: this.state.position!.coords.longitude,
      y: this.state.position!.coords.latitude,
      user_id: this.state.userId,
    };

    fetch(url, {
      method: "POST",
      body: JSON.stringify(data)
    }).then(function (response) {
      // TODO: Error handling
      return response.json();
    }, function (error) {
      console.log(error.message);
    }).then((json: any) => {
      const message: Message = {
        id: json.id,
        content: json.message,
        createdAt: moment(json.created_at),
        latitude: json.y,
        longitude: json.x,
        comments: [],
      };
      const newMessages = [message].concat(this.state.messages);
      const newUserMessages = [message].concat(this.state.userMessages);

      this.setState({
        messages: newMessages,
        userMessages: newUserMessages,
      });

      this.props.navigateTo({ id: "list" });
    });
  }

  onCommentSubmit(value: string, messageId: number) {
    const url = `https://klotter.ekdahl.io/post_comment`;
    const data = {
      content: value,
      message_id: messageId,
      user_id: this.state.userId,
    };

    fetch(url, {
      method: "POST",
      body: JSON.stringify(data)
    }).then(function (response) {
      return response.json();
    }, function (error) {
      console.log(error.message);
    }).then((json: any) => {
      const messageIndex = this.state.messages.findIndex((x) => {
        return x.id === messageId;
      });
      const comment: Comment = {
        id: json.id,
        content: json.content,
        createdAt: moment(json.created_at),
      };
      const newComments = this.state.messages[messageIndex].comments.concat([comment]);
      const command: any = {};
      command[messageIndex] = { comments: { $set: newComments } };
      const newMessages = update(this.state.messages, command);

      // TODO: This works but the server returns duplicates
      let newUserMessages = this.state.userMessages;
      if (typeof this.state.userMessages.find((x) => x.id === this.state.messages[messageIndex].id) === "undefined") {
        newUserMessages = [this.state.messages[messageIndex]].concat(this.state.userMessages);
      }

      this.setState({
        messages: newMessages,
        userMessages: newUserMessages,
      });
    });
  }

  errorMessage(): string {
    if (this.state.locationStatus === LocationStatus.Initializing) {
      return "Loading...";
    }

    return "Could not retrieve location";
  }

  render() {
    if (this.props.navigation.id === "404") {
      return <span>404: Not found</span>;
    } else if (this.state.locationStatus === LocationStatus.Watching) {
      return (
        <Main
          height={window.innerHeight}
          navigateTo={this.props.navigateTo}
          onMessageSubmit={this.onMessageSubmit.bind(this)}
          onCommentSubmit={this.onCommentSubmit.bind(this)}
          navigation={this.props.navigation}
          messages={this.state.messages}
          userMessages={this.state.userMessages}
          longitude={this.state.position!.coords.longitude}
          latitude={this.state.position!.coords.latitude} />
      );
    }

    return (
      <div style={styles.splash}>
        <div>
          <img src={logo} style={styles.img} />
          <span style={styles.message}>{this.errorMessage()}</span>
        </div>
      </div>
    );
  }
}

export default Router(Application);

const styles = {
  splash: {
    height: "100%",
    background: "linear-gradient(to bottom right, #f33, #c09)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  } as React.CSSProperties,

  img: {
    display: "block",
  },

  message: {
    display: "block",
    color: "white",
    fontSize: 24,
    marginTop: 24,
    textAlign: "center",
    textShadow: "1px 1px 1px rgba(0, 0, 0, 0.4)",
  }
};