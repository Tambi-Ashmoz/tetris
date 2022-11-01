import React, { useEffect, useState } from "react";
import { Button } from "../../components/button/Button";
import { Tetris, TetrisState } from "../../components/tetris/Tetris";

enum GameState {
	WaitingToStartGame = "WaitingToStartGame",
	ResetGame = "ResetGame",
	CountDown3 = "CountDown3",
	CountDown2 = "CountDown2",
	CountDown1 = "CountDown1",
	Go = "Go",
	PlayingGame = "PlayingGame",
	GameOver = "GameOver",
}

interface Props {
	webSocket: WebSocket;
}

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

			case GameState.ResetGame:
				setWinner(0);

				setTettrisAState(TetrisState.Reset);
				setTettrisBState(TetrisState.Reset);

				setGameState(GameState.CountDown3);
				break;

			case GameState.CountDown3:
				setTimeout(() => {
					setGameState(GameState.CountDown2);
				}, 1000);
				break;

			case GameState.CountDown2:
				setTimeout(() => {
					setGameState(GameState.CountDown1);
				}, 1000);
				break;

			case GameState.CountDown1:
				setTimeout(() => {
					setGameState(GameState.Go);
				}, 1000);
				break;

			case GameState.Go:
				setTettrisAState(TetrisState.Play);
				setTettrisBState(TetrisState.Play);

				setTimeout(() => {
					setGameState(GameState.PlayingGame);
				}, 1000);
				break;

			case GameState.PlayingGame:
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
		setGameState(GameState.ResetGame);
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
							{gameState == GameState.CountDown3 ? "Get Ready 3" : ""}
							{gameState == GameState.CountDown2 ? "Get Ready 2" : ""}
							{gameState == GameState.CountDown1 ? "Get Ready 1" : ""}
							{gameState == GameState.Go ? "Go !" : ""}
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
