import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../hooks/UseWebSocket";
import { Game } from "../game/Game";
import { Players } from "../players/Players";

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

	const { webSocket, webSocketMessage } = useWebSocket("ws://localhost:80");

	const [snapshot, setSnapshot] = useState<{ board: number[][]; next: number[][] }>({
		board: [],
		next: [],
	});

	useEffect(() => {
		switch (webSocketMessage.action) {
			case "connected":
				setPlayer1(webSocketMessage.clientId);
				break;

			case "connections":
				const clients = webSocketMessage.clients.filter((item: string) => item != player1);

				setPlayers([...clients]);
				break;

			case "readyToPlay":
				setPage(Pages.Game);
				break;

			case "snapshot":
				const player = webSocketMessage.player;
				const board = webSocketMessage.board;
				const next = webSocketMessage.next;

				if (player == player2) {
					setSnapshot({ board: board, next: next });
				}
				break;

			default:
				break;
		}
	}, [webSocketMessage]);

	useEffect(() => {
		if (player2 != "") {
			webSocket.send(JSON.stringify({ action: "readyToPlay", player1: player1, player2: player2 }));
		}
	}, [player2]);

	return (
		<>
			{page == Pages.Playes ? <Players players={players} player1={player1} setPlayer2={setPlayer2} /> : <></>}
			{page == Pages.Game ? <Game webSocket={webSocket} player={player1} snapshot={snapshot} /> : <></>}
		</>
	);
};
