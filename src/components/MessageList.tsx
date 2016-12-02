import * as React from "react";
import { Message } from "./Application";
import * as moment from "moment";
import haversine from "../haversine";
import SingleMessage from "./SingleMessage";

interface MessageListProps {
    latitude: number;
    longitude: number;
    messages: Message[];
    messageView: (message: Message) => void;
}

export default class MessageList extends React.Component<MessageListProps, {}> {
    render() {
        const messagesMarkup = this.props.messages.map((message, i) => {
            const distance = haversine(this.props.latitude, this.props.longitude, message.latitude, message.longitude);

            if (distance < 100) {
                return (
                    <div key={i} onClick={() => { this.props.messageView(message); } }>
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