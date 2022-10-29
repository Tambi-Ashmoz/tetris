import React, { useEffect, useState } from "react";
import { Button } from "../../components/button/Button";
import { Tetris, TetrisState } from "../../components/tetris/Tetris";

enum GameState {
	WaitingToStartGame = "WaitingToStartGame",
	CountDownToStartGame = "CountDownToStartGame",
	PlayingGame = "PlayingGame",
	GameOver = "GameOver",
}

interface Props {}

export const Game: React.FC<Props> = (props: Props): JSX.Element => {
	const [gameState, setGameState] = useState<GameState>(GameState.WaitingToStartGame);

	const [tetrisALinesCompleted, setTetrisALinesCompleted] = useState<number[][]>([]);
	const [tetrisBLinesCompleted, setTetrisBLinesCompleted] = useState<number[][]>([]);
	const [tetrisAState, setTettrisAState] = useState<TetrisState>(TetrisState.Reset);
	const [tetrisBState, setTettrisBState] = useState<TetrisState>(TetrisState.Reset);

	const [winner, setWinner] = useState<number>(0);

	useEffect(() => {
		switch (gameState) {
			case GameState.WaitingToStartGame:
				setWinner(0);

				setTettrisAState(TetrisState.Reset);
				setTettrisBState(TetrisState.Reset);
				break;

			case GameState.CountDownToStartGame:
				setWinner(0);

				setTettrisAState(TetrisState.Reset);
				setTettrisBState(TetrisState.Reset);

				setTimeout(() => {
					setGameState(GameState.PlayingGame);
				}, 3000);
				break;

			case GameState.PlayingGame:
				setTettrisAState(TetrisState.Play);
				setTettrisBState(TetrisState.Play);
				break;

			case GameState.GameOver:
				setTettrisAState(TetrisState.Pause);
				setTettrisBState(TetrisState.Pause);

				break;
		}
	}, [gameState]);

	useEffect(() => {
		if (tetrisAState == TetrisState.GameOver) {
			setWinner(2);
			setGameState(GameState.GameOver);
		}
	}, [tetrisAState]);

	useEffect(() => {
		if (tetrisBState == TetrisState.GameOver) {
			setWinner(1);
			setGameState(GameState.GameOver);
		}
	}, [tetrisBState]);

	const startNewGame = () => {
		setGameState(GameState.CountDownToStartGame);
	};

	return (
		<>
			<div className="mat">
				<div className="row">
					<div className="col">
						<Tetris
							onLineComplete={setTetrisALinesCompleted}
							linesToAddFromEnd={tetrisBLinesCompleted}
							state={tetrisAState}
							setState={setTettrisAState}
							isControlsEnabled={true}
						/>
					</div>
					<div className="col">
						<Tetris
							onLineComplete={setTetrisBLinesCompleted}
							linesToAddFromEnd={tetrisALinesCompleted}
							state={tetrisBState}
							setState={setTettrisBState}
							isControlsEnabled={false}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						<h3>{gameState == GameState.GameOver ? "Game Over" : ""}</h3>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						<h3>
							{gameState == GameState.CountDownToStartGame ? "Get Ready..." : ""}
							{winner == 1 ? "Player 1 Wins!" : ""}
							{winner == 2 ? "Player 2 Wins!" : ""}
						</h3>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						{gameState == GameState.WaitingToStartGame || gameState == GameState.GameOver ? (
							<Button onClick={startNewGame}>Start</Button>
						) : (
							<></>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
