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

export interface NotFound {
  id: "404";
}

export type Navigation = List | Map | Message | User;

export function navigation(url: string): Navigation | NotFound {
  let match: RegExpMatchArray | null;

  if (url === "/") {
    return { id: "list" };
  } else if (url === "/map") {
    return { id: "map" };
  } else if (match = url.match(/\/message\/(\d+)$/)) {
    return { id: "message", messageId: parseInt(match[1]), prev: { id: "list" } };
  } else if (url === "/user") {
    return { id: "user" };
  }

  return { id: "404" };
}

export function url(navigation: Navigation): string {
  switch (navigation.id) {
    case "list":
      return "/";
    case "map":
      return "/map";
    case "message":
      return `/message/${navigation.messageId}`;
    case "user":
      return "/user";
  }
}
