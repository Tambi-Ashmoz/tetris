import React, { useEffect, useReducer, useState } from "react";
import Button from "../../components/button/Button";
import Tetris, { TetrisState } from "../../components/tetris/Tetris";

interface GameReducerState {
	playerSide: number;
	gameState: string;
	winner: number;
}

enum GameReducterActions {
	SELECTING_PLAYERS,
	WAITING_TO_START_GAME,
	PLAYING_GAME,
	GAME_OVER,
}

const gameReducer = (
	state: GameReducerState,
	action: { type: GameReducterActions; value: any }
): any => {
	switch (action.type) {
		case GameReducterActions.SELECTING_PLAYERS:
			return { ...state, playerSide: action.value };

		case GameReducterActions.WAITING_TO_START_GAME:
			return { ...state };

		case GameReducterActions.PLAYING_GAME:
			return { ...state };

		case GameReducterActions.GAME_OVER:
			return { ...state };

		default:
			return state;
	}
};

interface Props {}

const Home: React.FC<Props> = (props: Props): JSX.Element => {
	const [gameState, gameDispatch] = useReducer(gameReducer, { a: 0 });

	const [tetrisALinesCompleted, setTetrisALinesCompleted] = useState<
		number[][]
	>([]);

	const [tetrisBLinesCompleted, setTetrisBLinesCompleted] = useState<
		number[][]
	>([]);

	const [tetrisAState, setTettrisAState] = useState<TetrisState>(
		TetrisState.RESET
	);

	const [tetrisBState, setTettrisBState] = useState<TetrisState>(
		TetrisState.RESET
	);

	const [winner, setWinner] = useState<number>(-1);

	const startNewGame = () => {
		setWinner(0);

		setTettrisAState(TetrisState.RESET);
		setTettrisBState(TetrisState.RESET);
	};

	useEffect(() => {
		if (winner == 0) {
			setTettrisAState(TetrisState.PLAY);
			setTettrisBState(TetrisState.PLAY);
		}
	}, [winner]);

	useEffect(() => {
		if (tetrisAState == TetrisState.GAME_OVER) {
			setWinner(2);

			setTettrisAState(TetrisState.PAUSE);
			setTettrisBState(TetrisState.PAUSE);
		}
	}, [tetrisAState]);

	useEffect(() => {
		if (tetrisBState == TetrisState.GAME_OVER) {
			setWinner(1);

			setTettrisAState(TetrisState.PAUSE);
			setTettrisBState(TetrisState.PAUSE);
		}
	}, [tetrisBState]);

	return (
		<>
			<div className="mat">
				<div className="row">
					<div id="1" className="col">
						<Tetris
							onLineComplete={setTetrisALinesCompleted}
							linesToAddFromEnd={tetrisBLinesCompleted}
							state={tetrisAState}
							setState={setTettrisAState}
						/>
					</div>
					<div id="2" className="col">
						<Tetris
							onLineComplete={setTetrisBLinesCompleted}
							linesToAddFromEnd={tetrisALinesCompleted}
							state={tetrisBState}
							setState={setTettrisBState}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						<h3>{winner != 0 ? "Game Over" : ""}</h3>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						<h3>
							{winner == 1 ? "Player 1 Wins!" : ""}
							{winner == 2 ? "Player 2 Wins!" : ""}
						</h3>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						{winner != 0 ? (
							<Button onClick={startNewGame}>Start</Button>
						) : (
							""
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
