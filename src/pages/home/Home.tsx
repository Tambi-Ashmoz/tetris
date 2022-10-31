import React, { useEffect, useState } from "react";
import { Players } from "../players/Players";

const ws = new WebSocket("ws://localhost:80", ["soap", "wamp"]);
// const ws = new WebSocket("ws://192.168.1.15:80", ["soap", "wamp"]);

interface Props {}

export const Home: React.FC<Props> = (props: Props): JSX.Element => {
	const [page, setPage] = useState<JSX.Element>(<></>);

	const [player1, setPlayer1] = useState<string>("");
	const [player2, setPlayer2] = useState<string>("");
	const [players, setPlayers] = useState<string[]>([]);

	const [wsData, setWsData] = useState<any>({});

	console.log("--Home--");
	console.log("player1 " + player1);
	console.log("player2 " + player2);
	console.log("players " + players);

	useEffect(() => {
		console.log("client: connecting to server...");

		ws.onopen = (e) => {
			console.log("client: connected to server");
		};

		ws.onerror = (e) => {
			console.log("client: error", e);
		};

		ws.onmessage = (e) => {
			console.log("client: received message from server");

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
				console.log("connected");
				console.log(wsData.clientId);
				setPlayer1(wsData.clientId);
				break;

			case "connections":
				console.log("connections");
				console.log(player1);
				console.log(wsData.clients);

				const clients = wsData.clients.filter((item: string) => item != player1);
				setPlayers([...clients]);
				break;

			default:
				break;
		}
	}, [wsData]);

	// useEffect(() => {
	// 	setPage(<Players players={players} player1={player1} setPlayer2={setPlayer2} />);
	// }, []);

	// useEffect(() => {
	// 	if (player2 != "") {
	// 		setPage(<Game />);
	// 	}
	// }, [player2]);

	// return <>{page}</>;
	return (
		<>
			<Players players={players} player1={player1} setPlayer2={setPlayer2} />
		</>
	);
};
