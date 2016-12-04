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
export interface NewMessage {
	id: "new_message";
	prev: Navigation;
}

export type Navigation = Map | List | Message | NewMessage;