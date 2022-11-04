export enum TypeWebSocketMessageActions {
	Connected = "handshake", //must match server
	Clients = "clients", //must match server
	ReadyToPlay = "readyToPlay",
	Snapshot = "snapshot",
	Start = "start",
	End = "end",
}

export interface TypeWebSocketMessage {
	action: TypeWebSocketMessageActions;
	[key: string]: any;
}
