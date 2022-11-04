import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../hooks/UseWebSocket";
import { TypeWebSocketMessage, TypeWebSocketMessageActions } from "../../types/WebSocketTypes";
import { Players } from "../players/Players";
import { War } from "../war/War";

enum Screens {
	Players,
	War,
}

interface Props {}

export const Home: React.FC<Props> = (props: Props): JSX.Element => {
	const [screen, setScreen] = useState<Screens>(Screens.Players);

	const [playerId1, setPlayerId1] = useState<string>("");
	const [playerId2, setPlayerId2] = useState<string>("");
	const [playersIds, setPlayersIds] = useState<string[]>([]);

	const { webSocketMessage, webSocketSend } = useWebSocket<TypeWebSocketMessage>("ws://localhost:80");

	useEffect(() => {
		switch (webSocketMessage.action) {
			case TypeWebSocketMessageActions.Connected:
				setPlayerId1(webSocketMessage.clientId);
				break;

			case TypeWebSocketMessageActions.Clients:
				const clients = webSocketMessage.clients.filter((clientId: string) => clientId != playerId1);

				setPlayersIds([...clients]);
				break;

			case TypeWebSocketMessageActions.ReadyToPlay:
				setScreen(Screens.War);
				break;
		}
	}, [webSocketMessage]);

	useEffect(() => {
		if (playerId2 != "") {
			webSocketSend({ action: TypeWebSocketMessageActions.ReadyToPlay, playerId1: playerId1, playerId2: playerId2 });
		}
	}, [playerId2]);

	useEffect(() => {
		if (playersIds.indexOf(playerId2) == -1) {
			setPlayerId2("");
			setScreen(Screens.Players);
		}
	}, [playersIds]);

	return (
		<>
			{screen == Screens.Players ? <Players playersIds={playersIds} playerId1={playerId1} setPlayerId2={setPlayerId2} /> : <></>}
			{screen == Screens.War ? <War playerId={playerId1} webSocketMessage={webSocketMessage} webSocketSend={webSocketSend} /> : <></>}
		</>
	);
};
