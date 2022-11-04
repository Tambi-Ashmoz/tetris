// https://www.npmjs.com/package/ws
// npm i ws -g

import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 80 });
let clientIdCountr = 0;

wss.on("connection", (ws, req) => {
	//settings
	ws.isAlive = true;
	ws.clientId = clientIdCountr++;

	//get all clients
	const clients = [...wss.clients].map((e) => e.clientId);

	console.log("server: connected to client: " + ws.clientId + ", total clients: " + clients.length);

	//helpers
	const sendMessageToClient = (str) => {
		ws.send(str);
	};

	const sendMessageToClients = (str) => {
		wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(str);
			}
		});
	};

	//send to the client his id and all available clients
	const messageToClient = JSON.stringify({ action: "connected", clientId: ws.clientId });
	sendMessageToClient(messageToClient);

	const messageToClients = JSON.stringify({ action: "connections", clients: clients });
	sendMessageToClients(messageToClients);

	//on pong
	ws.on("pong", () => {
		ws.isAlive = true;
	});

	const interval = setInterval(() => {
		ws.isAlive = false;
		ws.ping();

		setTimeout(() => {
			if (ws.isAlive == false) {
				ws.terminate();
				clearInterval(interval);

				const clients = [...wss.clients].map((e) => e.clientId);
				console.log("server: connection lost with client: " + ws.clientId + ", total clients: " + clients.length);

				const messageToClients = JSON.stringify({ action: "connections", clients: clients });
				sendMessageToClients(messageToClients);
			}
		}, 1 * 1000);
	}, 1 * 1000);

	//on error
	ws.on("error", (e) => {
		console.log("server: error with client: " + ws.clientId, e);
	});

	//on client disconnect
	ws.on("disconnect", () => {
		console.log("server: client dissconnected: " + ws.clientId);
	});

	//on message from client
	ws.on("message", (message, isBinary) => {
		let data = {};

		try {
			data = JSON.parse(message);
		} catch (error) {
			console.log("server: error parsing message from client: " + ws.clientId);
		}

		console.log("server: message from client: " + ws.clientId + ", " + JSON.stringify(data).substring(0, 50) + " ...");

		//send to all clients the message (except to himself)
		switch (data.action) {
			case "readyToPlay": {
				const messageToClients = JSON.stringify({
					action: "readyToPlay",
					player1: data.player1,
					player2: data.player2,
				});
				sendMessageToClients(messageToClients);

				break;
			}

			case "snapshot": {
				const messageToClients = JSON.stringify(data);
				sendMessageToClients(messageToClients);

				break;
			}
		}
	});
});

wss.on("close", () => {
	clearInterval(interval);
});

console.log("server: running");
