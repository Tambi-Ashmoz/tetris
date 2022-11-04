export enum WebSocketActions {
	Connected = "handshake", //must match server
	Clients = "clients", //must match server
	ReadyToPlay = "readyToPlay",
	Snapshot = "snapshot",
	Start = "start",
	End = "end",
}
