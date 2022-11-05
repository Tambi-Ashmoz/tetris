import { useEffect, useState } from "react";

export interface TypeWebSocketSend {
	(message: {}): void;
}

export interface TypeWebSocketMessage {
	[key: string]: any;
}

export const useWebSocket = <TypeWebSocketMessageCustom,>(url: string) => {
	const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

	const [webSocketOpen, setWebSocketOpen] = useState();
	const [webSocketClose, setWebSocketClose] = useState();
	const [webSocketError, setWebSocketError] = useState();
	const [webSocketMessage, setWebSockMessage] = useState<TypeWebSocketMessage | TypeWebSocketMessageCustom>({});

	const webSocketSend: TypeWebSocketSend = (message: {}) => {
		webSocket?.send(JSON.stringify(message));
	};

	useEffect(() => {
		const ws = new WebSocket(url, ["soap", "wamp"]);

		ws.onopen = () => {
			setWebSocketOpen(undefined);
		};

		ws.onclose = (e) => {
			setWebSocketClose(undefined);
		};

		ws.onerror = (e) => {
			setWebSocketError(undefined);
		};

		ws.onmessage = (e) => {
			let data: any = null;

			try {
				data = JSON.parse(e.data);
			} catch (error) {
				data = { error: error };
			}

			setWebSockMessage(data);
		};

		setWebSocket(ws);

		return () => {
			ws.close();
		};
	}, []);

	return {
		webSocketOpen,
		webSocketClose,
		webSocketError,
		webSocketMessage,
		webSocketSend,
	};
};
