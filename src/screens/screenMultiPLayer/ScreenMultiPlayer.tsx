import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../hooks/UseWebSocket";
import { TypeWebSocketMessage, TypeWebSocketMessageActions } from "../../types/TypeWebSocket";
import { ScreenPlayers } from "../screenPlayers/ScreenPlayers";
import { ScreenWar } from "../screenWar/ScreenWar";

enum Screens {
	Players,
	War,
}

interface Props {}

export const ScreenMultiPlayer: React.FC<Props> = (props: Props): JSX.Element => {
	const [screen, setScreen] = useState<Screens>(Screens.Players);

	const [playerId1, setPlayerId1] = useState<string>("");
	const [playerId2, setPlayerId2] = useState<string>("");
	const [playersIds, setPlayersIds] = useState<string[]>([]);

	const { webSocketMessage, webSocketSend } = useWebSocket<TypeWebSocketMessage>("ws://localhost:80");

	const onSelectPlayer = (playerId: string) => {
		setPlayerId2(playerId);
	};

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
			{screen == Screens.Players ? <ScreenPlayers playersIds={playersIds} playerId1={playerId1} onSelectPlayer={onSelectPlayer} /> : <></>}
			{screen == Screens.War ? <ScreenWar playerId={playerId1} webSocketMessage={webSocketMessage} webSocketSend={webSocketSend} /> : <></>}
		</>
	);
};
