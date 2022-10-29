import React, { useEffect, useReducer } from "react";
import { Game, PlayerSide } from "../game/Game";
import { Init } from "../init/Init";

interface GameReducerState {
	page: JSX.Element;
	playerSide: PlayerSide;
}

enum GameReducerActions {
	ConnectingToServer,
	PlayingGame,
}

const gameReducer = (
	state: GameReducerState,
	action:
		| { type: GameReducerActions.ConnectingToServer }
		| { type: GameReducerActions.PlayingGame; playerSide: PlayerSide }
): any => {
	switch (action.type) {
		case GameReducerActions.ConnectingToServer:
			return { ...state, page: <Init /> };

		case GameReducerActions.PlayingGame:
			return { ...state, page: <Game playerSide={action.playerSide} /> };

		default:
			return state;
	}
};

interface Props {}

export const Home: React.FC<Props> = (props: Props): JSX.Element => {
	const [gameState, gameDispatch] = useReducer(gameReducer, {
		page: <Init />,
	});

	useEffect(() => {
		setTimeout(() => {
			gameDispatch({
				type: GameReducerActions.PlayingGame,
				playerSide: 1,
			});
		}, 2300);
	}, []);

	return <>{gameState.page}</>;
};
