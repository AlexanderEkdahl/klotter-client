import * as React from "react";
import Messages from "./Messages";
import * as moment from "moment";
import * as update from "immutability-helper";

const logo = require<string>("./logo.png");

const enum LocationStatus {
    Initializing,
    Watching,
    Unavailable,
    Failed,
}

export const enum Navigation {
    Map,
    NewMessage,
    List,
    Message,
}

export interface Message {
    id: number;
    content: string;
    createdAt: moment.Moment;
    latitude: number;
    longitude: number;
    comments: Comment[];
}

export interface Comment {
    id: number;
    content: string;
    createdAt: moment.Moment;
}

interface AppState {
    locationStatus: LocationStatus;
    position: Position | null;
    messages: Message[];
    navigation: Navigation;
    singleMessageId: number | null;
}

export default class App extends React.Component<{}, AppState> {
    watchID: number;

    constructor() {
        super();

        this.state = {
            locationStatus: LocationStatus.Initializing,
            position: null,
            messages: [],
            navigation: Navigation.List,
            singleMessageId: null,
        };
    }

    componentDidMount() {
        if ("geolocation" in navigator) {
            this.watchID = navigator.geolocation.watchPosition((position) => {
                this.fetchMessages(position).then((messages) => {
                    this.setState({
                        locationStatus: LocationStatus.Watching,
                        position: position,
                        messages: messages,
                        navigation: this.state.navigation,
                        singleMessageId: this.state.singleMessageId,
                    });
                });
            }, () => {
                this.setState({
                    locationStatus: LocationStatus.Failed,
                    position: null,
                    messages: [],
                    navigation: this.state.navigation,
                    singleMessageId: this.state.singleMessageId,
                });
            });
        } else {
            this.setState({
                locationStatus: LocationStatus.Unavailable,
                position: null,
                messages: [],
                navigation: this.state.navigation,
                singleMessageId: this.state.singleMessageId,
            });
        }
    }

    fetchMessages(position: Position): Promise<Message[]> {
        const url = `https://klottr.ekdahl.io/get?x=${position.coords.longitude}&y=${position.coords.latitude}`;

        return new Promise<Message[]>((resolve, reject) => {
            fetch(url).then((response) => {
                return response.json();
            }).then((json: any) => {
                const messages = json.map((message) => {
                    return {
                        id: message.id,
                        content: message.message,
                        createdAt: moment(message.created_at),
                        latitude: message.y,
                        longitude: message.x,
                        comments: message.Comments.map((comment) => {
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

    switchView() {
        let newLocation: Navigation;

        if (this.state.navigation === Navigation.Map) {
            newLocation = Navigation.List;
        } else {
            newLocation = Navigation.Map;
        }

        this.setState({
            locationStatus: this.state.locationStatus,
            position: this.state.position,
            messages: this.state.messages,
            navigation: newLocation,
            singleMessageId: null,
        });
    }

    newMessageView() {
        this.setState({
            locationStatus: this.state.locationStatus,
            position: this.state.position,
            messages: this.state.messages,
            navigation: Navigation.NewMessage,
            singleMessageId: null,
        });
    }

    onMessageSubmit(value) {
        const url = `https://klottr.ekdahl.io/post`;
        const data = {
            "message": value,
            "x": this.state.position!.coords.longitude,
            "y": this.state.position!.coords.latitude
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
            const newMessages = this.state.messages.concat([message]);

            this.setState({
                locationStatus: this.state.locationStatus,
                position: this.state.position,
                messages: newMessages,
                navigation: Navigation.Message,
                singleMessageId: message.id,
            });
        });
    }

    onCommentSubmit(value: string, messageId: number) {
        const url = `https://klottr.ekdahl.io/post_comment`;
        const data = {
            "content": value,
            "message_id": messageId,
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
            const command = {};
            command[messageIndex] = { comments: { $set: newComments } };
            const newMessages = update(this.state.messages, command);
            this.setState({
                locationStatus: this.state.locationStatus,
                position: this.state.position,
                messages: newMessages,
                navigation: this.state.navigation,
                singleMessageId: this.state.singleMessageId,
            });
        });
    }

    messageView(message: Message) {
        this.setState({
            locationStatus: this.state.locationStatus,
            position: this.state.position,
            messages: this.state.messages,
            navigation: Navigation.Message,
            singleMessageId: message.id,
        });
    }

    render() {
        if (this.state.locationStatus === LocationStatus.Watching) {
            return (
                <Messages
                    switchView={this.switchView.bind(this)}
                    newMessageView={this.newMessageView.bind(this)}
                    messageView={this.messageView.bind(this)}
                    onMessageSubmit={this.onMessageSubmit.bind(this)}
                    onCommentSubmit={this.onCommentSubmit.bind(this)}
                    navigation={this.state.navigation}
                    messages={this.state.messages}
                    singleMessageId={this.state.singleMessageId}
                    longitude={this.state.position!.coords.longitude}
                    latitude={this.state.position!.coords.latitude} />
            );
        }

        let message: string;
        if (this.state.locationStatus === LocationStatus.Initializing) {
            message = "Loading...";
        } else {
            message = "Could not retrieve location";
        }

        return (
            <div style={styles.splash}>
                <div>
                    <img src={logo} style={styles.img}/>
                    <span style={styles.message}>{message}</span>
                </div>
            </div>
        );
    }
}

const center: "center" = "center"; // dumb hack to satisfy Typescript
const styles = {
    splash: {
        height: "100%",
        background: "linear-gradient(to bottom right, #f33, #c09)",
        display: "flex",
        justifyContent: center,
        alignItems: "center",
    },

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