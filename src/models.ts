import * as moment from "moment";

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
