import * as React from "react";
import { Message } from "./App";
import * as moment from "moment";

interface SingleMessageProps {
    message: Message;
    distance: number;
}

const messageColors = ["#ff6666", "#6d72c4", "#a37aa2", "#73886e", "#ef9820"];

function messageColor(id) {
    return {
        backgroundColor: messageColors[id % messageColors.length]
    };
}

export default class SingleMessage extends React.Component<SingleMessageProps, {}> {
    render() {
        const message = this.props.message;
        const style = Object.assign({}, styles.message, messageColor(message.id));

        return (
            <div style={style}>
                <span style={styles.content}>{message.content}</span>
                <div style={styles.footer}>
                    <span>{message.createdAt.fromNow()}</span>
                    <span>{this.props.distance.toFixed(0)} m away</span>
                </div>
            </div>
        );
    }
}

const spaceBetween: "space-between" = "space-between"; // TypeScript bug
export const styles = {
    message: {
        color: "white",
        padding: 8,
        borderRadius: 3,
        margin: 4,
        cursor: "pointer",
    },

    content: {
        fontSize: 18,
    },

    footer: {
        justifyContent: spaceBetween,
        fontSize: 14,
        display: "flex",
        marginTop: 8,
    },
};