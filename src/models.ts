import * as moment from "moment";

export interface IMessage {
  id: number;
  content: string;
  createdAt: moment.Moment;
  latitude: number;
  longitude: number;
  comments: IComment[];
}

export interface IComment {
  id: number;
  content: string;
  createdAt: moment.Moment;
}
