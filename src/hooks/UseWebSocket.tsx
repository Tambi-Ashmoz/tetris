import { useEffect, useState } from "react";

export const useWebSocket = (url: string) => {
	const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

	const [webSocketOpen, setWebSocketOpen] = useState<any>();
	const [webSocketClose, setWebSocketClose] = useState<any>();
	const [webSocketError, setWebSocketError] = useState<any>();
	const [webSocketMessage, setWebSockMessage] = useState<any>({});

	const webSocketSend = (message: {}) => {
		webSocket?.send(JSON.stringify(message));
	};

	useEffect(() => {
		const ws = new WebSocket(url, ["soap", "wamp"]);

		ws.onopen = () => {
			setWebSocketOpen(null);
		};

		ws.onclose = (e) => {
			setWebSocketClose(null);
		};

		ws.onerror = (e) => {
			setWebSocketError(null);
		};

		ws.onmessage = (e) => {
			let data: any = null;

			try {
				data = JSON.parse(e.data);
			} catch (error) {
				//do nothing
			}

			console.log(JSON.stringify(data));

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
