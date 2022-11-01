import React, { useEffect, useState } from "react";
import { Game } from "../game/Game";
import { Players } from "../players/Players";

const ws = new WebSocket("ws://localhost:80", ["soap", "wamp"]);

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

	const [wsData, setWsData] = useState<any>({});

	useEffect(() => {
		console.log("client: connecting to server...");

		ws.onopen = (e) => {
			console.log("client: connected to server");
		};

		ws.onerror = (e) => {
			console.log("client: error", e);
		};

		ws.onmessage = (e) => {
			console.log("client: received message from server " + e.data);

			let data: any = {};

			try {
				data = JSON.parse(e.data);
			} catch (error) {
				console.log("client: error parsing message");
			}

			setWsData(data);
		};

		ws.onclose = (e) => {
			console.log("client: disconnected from success");
		};

		return () => {
			console.log("client: closing connection");
			ws.close();
		};
	}, []);

	useEffect(() => {
		switch (wsData.action) {
			case "connected":
				setPlayer1(wsData.clientId);
				break;

			case "connections":
				const clients = wsData.clients.filter((item: string) => item != player1);

				setPlayers([...clients]);
				break;

			case "readyToPlay":
				setPage(Pages.Game);
				break;

			default:
				break;
		}
	}, [wsData]);

	useEffect(() => {
		if (player2 != "") {
			ws.send(JSON.stringify({ action: "readyToPlay", player1: player1, player2: player2 }));
		}
	}, [player2]);

	return (
		<>
			{page == Pages.Playes ? <Players players={players} player1={player1} setPlayer2={setPlayer2} /> : <></>}
			{page == Pages.Game ? <Game /> : <></>}
		</>
	);
};
