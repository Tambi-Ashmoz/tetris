import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../hooks/UseWebSocket";
import { Players } from "../players/Players";
import { War } from "../war/War";

enum Pages {
	Playes,
	War,
}

interface Props {}

export const Home: React.FC<Props> = (props: Props): JSX.Element => {
	const [page, setPage] = useState<Pages>(Pages.Playes);

	const [player1, setPlayer1] = useState<string>("");
	const [player2, setPlayer2] = useState<string>("");
	const [players, setPlayers] = useState<string[]>([]);

	const { webSocketMessage, webSocketSend } = useWebSocket("ws://localhost:80");

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
				setPage(Pages.War);
				break;
		}
	}, [webSocketMessage]);

	useEffect(() => {
		if (player2 != "") {
			webSocketSend({ action: "readyToPlay", player1: player1, player2: player2 });
		}
	}, [player2]);

	return (
		<>
			{page == Pages.Playes ? <Players players={players} player1={player1} setPlayer2={setPlayer2} /> : <></>}
			{page == Pages.War ? (
				<War player={player1} webSocketMessage={webSocketMessage} webSocketSend={webSocketSend} />
			) : (
				<></>
			)}
		</>
	);
};
