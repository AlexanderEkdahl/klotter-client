import * as React from "react";
import { Message } from "../models";
import haversine from "../haversine";
import SingleMessage from "./SingleMessage";

interface UserMessagesProps {
    latitude: number;
    longitude: number;
    messages: Message[];
    messageView: (messageId: number) => void;
}

export default class UserMessages extends React.Component<UserMessagesProps, {}> {
    render() {
        const messagesMarkup = this.props.messages.map((message, i) => {
            const distance = haversine(this.props.latitude, this.props.longitude, message.latitude, message.longitude);

            return (
                <div key={i} onClick={() => { this.props.messageView(message.id); } }>
                    <SingleMessage message={message} distance={distance} />
                </div>
            );
        });

        return (
            <div>
                {messagesMarkup}
            </div>
        );
    }
}