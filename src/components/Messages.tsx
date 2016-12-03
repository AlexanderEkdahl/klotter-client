import * as React from "react";
import MapComponent from "./Map";
import MessageList from "./MessageList";
import NewMessage from "./NewMessage";
import SingleMessageWithComments from "./SingleMessageWithComments";
import { Message, Navigation } from "./Application";

interface MessagesProps {
    latitude: number;
    longitude: number;
    messages: Message[];
    singleMessageId: number | null;
    navigation: Navigation;
    switchView: () => void;
    newMessageView: () => void;
    messageView: (messageId: number) => void;
    onMessageSubmit: (value: string) => void;
    onCommentSubmit: (value: string, messageId: number) => void;
}

export default class Messages extends React.Component<MessagesProps, {}> {
    render() {
        let main;

        if (this.props.navigation === Navigation.Map) {
            main = <MapComponent messageView={this.props.messageView} messages={this.props.messages} longitude={this.props.longitude} latitude={this.props.latitude} />;
        } else if (this.props.navigation === Navigation.List) {
            main = <MessageList messageView={this.props.messageView} messages={this.props.messages} longitude={this.props.longitude} latitude={this.props.latitude} />;
        } else if (this.props.navigation === Navigation.NewMessage) {
            main = <NewMessage onSubmit={(value) => { this.props.onMessageSubmit(value); }} />;
        } else if (this.props.navigation === Navigation.Message) {
            const message = this.props.messages.find((x) => {
                return x.id === this.props.singleMessageId;
            });

            main = <SingleMessageWithComments onCommentSubmit={this.props.onCommentSubmit} message={message!} longitude={this.props.longitude} latitude={this.props.latitude} />;
        }

        let viewButton: string;
        if (this.props.navigation === Navigation.Map) {
            viewButton = "Show list";
        } else {
            viewButton = "Show map";
        }

        return (
            <div style={styles.container}>
                <div style={styles.nav}>
                    <div onClick={this.props.switchView}>{viewButton}</div>
                    <div onClick={this.props.newMessageView}>New Message</div>
                </div>
                <div style={styles.main}>
                    {main}
                </div>
            </div>
        );
    }
}

const spaceBetween: "space-between" = "space-between"; // TypeScript bug
const styles = {
    container: {
        display: "flex",
        height: "100%",
        flexDirection: "column",
    },

    nav: {
        flexShrink: 0,
        display: "flex",
        justifyContent: spaceBetween,
        alignItems: "center",
        color: "#FF0000",
        fontSize: 20,
        padding: 12,
        cursor: "pointer",
        textShadow: "1px 1px 0px rgba(0, 0, 0, 0.2)"
    },

    main: {
        flex: 1,
        height: "100%",
    }
};