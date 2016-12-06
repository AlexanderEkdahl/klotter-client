export interface Map {
  id: "map";
}

export interface List {
  id: "list";
}

export interface Message {
  id: "message";
  messageId: number;
  prev: Navigation;
}

export interface User {
  id: "user";
}

export type Navigation = Map | List | Message | User;