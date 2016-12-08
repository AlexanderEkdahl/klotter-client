import { Message, Comment } from "./models";
import * as moment from "moment";

export function fetchMessages(position: Position): Promise<Message[]> {
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

export function fetchUserMessages(user_id: string): Promise<Message[]> {
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

export function postMessage(content: string, longitude: number, latitude: number, userId: string): Promise<Message> {
  const url = `https://klotter.ekdahl.io/post`;
  const data = {
    message: content,
    x: longitude,
    y: latitude,
    user_id: userId,
  };

  return new Promise<Message>((resolve, reject) => {
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

      resolve(message);
    });
  });
}

export function postComment(content: string, messageId: number, userId: string): Promise<Comment> {
  const url = `https://klotter.ekdahl.io/post_comment`;
  const data = {
    content: content,
    message_id: messageId,
    user_id: userId,
  };

  return new Promise<Comment>((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data)
    }).then(function (response) {
      return response.json();
    }, function (error) {
      console.log(error.message);
    }).then((json: any) => {
      const comment: Comment = {
        id: json.id,
        content: json.content,
        createdAt: moment(json.created_at),
      };

      resolve(comment);
    });
  });
}