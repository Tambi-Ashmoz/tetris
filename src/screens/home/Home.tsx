import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../hooks/UseWebSocket";
import { WebSocketActions } from "../../types/WebSocketTypes";
import { Players } from "../players/Players";
import { War } from "../war/War";

enum Screens {
	Players,
	War,
}

interface Props {}

export const Home: React.FC<Props> = (props: Props): JSX.Element => {
	const [page, setPage] = useState<Screens>(Screens.Players);

	const [player1, setPlayer1] = useState<string>("");
	const [player2, setPlayer2] = useState<string>("");
	const [players, setPlayers] = useState<string[]>([]);

	const { webSocketMessage, webSocketSend } = useWebSocket("ws://localhost:80");

	useEffect(() => {
		switch (webSocketMessage.action) {
			case WebSocketActions.Connected:
				setPlayer1(webSocketMessage.clientId);
				break;

			case WebSocketActions.Clients:
				const clients = webSocketMessage.clients.filter((item: string) => item != player1);

				setPlayers([...clients]);
				break;

			case WebSocketActions.ReadyToPlay:
				setPage(Screens.War);
				break;
		}
	}, [webSocketMessage]);

	useEffect(() => {
		if (player2 != "") {
			webSocketSend({ action: WebSocketActions.ReadyToPlay, player1: player1, player2: player2 });
		}
	}, [player2]);

	useEffect(() => {
		if (players.indexOf(player2) == -1) {
			setPlayer2("");
			setPage(Screens.Players);
		}
	}, [players]);

	return (
		<>
			{page == Screens.Players ? <Players players={players} player1={player1} setPlayer2={setPlayer2} /> : <></>}
			{page == Screens.War ? <War player={player1} webSocketMessage={webSocketMessage} webSocketSend={webSocketSend} /> : <></>}
		</>
	);
};
