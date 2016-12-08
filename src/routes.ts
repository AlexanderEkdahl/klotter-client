export interface IMap {
  id: "map";
}

export interface IList {
  id: "list";
}

export interface IMessage {
  id: "message";
  messageId: number;
  prev: Routes;
}

export interface IUser {
  id: "user";
}

export interface INotFound {
  id: "404";
}

export type Routes = IList | IMap | IMessage | IUser;

export function route(url: string): Routes | INotFound {
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

export function url(route: Routes): string {
  switch (route.id) {
    case "list":
      return "/";
    case "map":
      return "/map";
    case "message":
      return `/message/${route.messageId}`;
    case "user":
      return "/user";
  }
}
