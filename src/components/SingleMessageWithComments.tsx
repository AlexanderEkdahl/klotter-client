import * as React from "react";
import { Message } from "./Application";
import * as moment from "moment";
import haversine from "../haversine";
import SingleMessage from "./SingleMessage";

interface SingleMessageWithCommentsProps {
    latitude: number;
    longitude: number;
    message: Message;
    onCommentSubmit: (value: string, messageId: number) => void;
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

    handleSubmit(event) {
        this.props.onCommentSubmit(this.state.value, this.props.message.id);
        this.setState({
            value: "",
        });
        event.preventDefault();
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
                <form onSubmit={this.handleSubmit.bind(this)} style={styles.form}>
                    <textarea onChange={this.handleChange.bind(this)} style={styles.input} value={this.state.value} />
                    <input type="submit" value="Comment" style={styles.submit} />
                </form>
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

    form: {
        alignItems: "stretch",
        display: "flex",
    },

    input: {
        fontSize: 16,
        outline: "none",
        flexGrow: 1,
        padding: 12,
    },

    submit: {
        fontSize: 20,
        backgroundColor: "#FF00000",
        border: "none",
        color: "white",
        outline: "none",
    },
};