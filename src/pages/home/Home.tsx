import React, { useEffect, useState } from "react";
import { Game } from "../game/Game";
import { Players } from "../players/Players";

const webSocket = new WebSocket("ws://localhost:80", ["soap", "wamp"]);

enum Pages {
	Playes,
	Game,
}

interface Props {}

export const Home: React.FC<Props> = (props: Props): JSX.Element => {
	const [page, setPage] = useState<Pages>(Pages.Playes);

	const [player1, setPlayer1] = useState<string>("");
	const [player2, setPlayer2] = useState<string>("");
	const [players, setPlayers] = useState<string[]>([]);

	const [webSocketData, setWebSocketData] = useState<any>({});

	useEffect(() => {
		console.log("client: connecting to server...");

		webSocket.onopen = (e) => {
			console.log("client: connected to server");
		};

		webSocket.onerror = (e) => {
			console.log("client: error", e);
		};

		webSocket.onmessage = (e) => {
			console.log("client: received message from server " + e.data);

			let data: any = {};

			try {
				data = JSON.parse(e.data);
			} catch (error) {
				console.log("client: error parsing message");
			}

			setWebSocketData(data);
		};

		webSocket.onclose = (e) => {
			console.log("client: disconnected from success");
		};

		return () => {
			console.log("client: closing connection");
			webSocket.close();
		};
	}, []);

	useEffect(() => {
		switch (webSocketData.action) {
			case "connected":
				setPlayer1(webSocketData.clientId);
				break;

			case "connections":
				const clients = webSocketData.clients.filter((item: string) => item != player1);

				setPlayers([...clients]);
				break;

			case "readyToPlay":
				setPage(Pages.Game);
				break;

			default:
				break;
		}
	}, [webSocketData]);

	useEffect(() => {
		if (player2 != "") {
			webSocket.send(JSON.stringify({ action: "readyToPlay", player1: player1, player2: player2 }));
		}
	}, [player2]);

	return (
		<>
			{page == Pages.Playes ? <Players players={players} player1={player1} setPlayer2={setPlayer2} /> : <></>}
			{page == Pages.Game ? <Game webSocket={webSocket} /> : <></>}
		</>
	);
};
