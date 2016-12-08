import * as moment from "moment";
import { IComment, IMessage } from "./models";

export const fetchMessages = (position: Position): Promise<IMessage[]> => {
  const url = `https://klotter.ekdahl.io/get?x=${position.coords.longitude}&y=${position.coords.latitude}`;

  return new Promise<IMessage[]>((resolve, reject) => {
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
          }),
        };
      });

      resolve(messages);
    });
  });
};

export const fetchUserMessages = (user_id: string): Promise<IMessage[]> => {
  const url = `https://klotter.ekdahl.io/get_user?user_id=${user_id}`;

  return new Promise<IMessage[]>((resolve, reject) => {
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
          }),
        };
      });

      resolve(messages);
    });
  });
};

export const postMessage = (content: string, longitude: number, latitude: number, userId: string): Promise<IMessage> => {
  const url = `https://klotter.ekdahl.io/post`;
  const data = {
    message: content,
    x: longitude,
    y: latitude,
    user_id: userId,
  };

  return new Promise<IMessage>((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    }).then((response) => {
      // TODO: Error handling
      return response.json();
    }, (error) => {
      console.error(error.message);
    }).then((json: any) => {
      const message: IMessage = {
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
};

export const postComment = (content: string, messageId: number, userId: string): Promise<IComment> => {
  const url = `https://klotter.ekdahl.io/post_comment`;
  const data = {
    content: content,
    message_id: messageId,
    user_id: userId,
  };

  return new Promise<IComment>((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    }).then((response) => {
      return response.json();
    }, (error) => {
      console.error(error.message);
    }).then((json: any) => {
      const comment: IComment = {
        id: json.id,
        content: json.content,
        createdAt: moment(json.created_at),
      };

      resolve(comment);
    });
  });
};
