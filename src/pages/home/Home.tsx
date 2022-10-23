import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Tetris, { GameState } from "../../components/tetris/Tetris";

interface Props {}

const Home: React.FC<Props> = (props: Props): JSX.Element => {
	const [tetrisALinesCompleted, setTetrisALinesCompleted] = useState<
		number[][]
	>([]);

	const [tetrisBLinesCompleted, setTetrisBLinesCompleted] = useState<
		number[][]
	>([]);

	const [tetrisAGameState, setTettrisAGameState] = useState<GameState>(
		GameState.RESET
	);

	const [tetrisBGameState, setTettrisBGameState] = useState<GameState>(
		GameState.RESET
	);

	const [winner, setWinner] = useState<number>(-1);

	const startNewGame = () => {
		setWinner(0);

		setTettrisAGameState(GameState.RESET);
		setTettrisBGameState(GameState.RESET);
	};

	useEffect(() => {
		if (winner == 0) {
			setTettrisAGameState(GameState.PLAY);
			setTettrisBGameState(GameState.PLAY);
		}
	}, [winner]);

	useEffect(() => {
		if (tetrisAGameState == GameState.GAME_OVER) {
			setWinner(2);

			setTettrisAGameState(GameState.PAUSE);
			setTettrisBGameState(GameState.PAUSE);
		}
	}, [tetrisAGameState]);

	useEffect(() => {
		if (tetrisBGameState == GameState.GAME_OVER) {
			setWinner(1);

			setTettrisAGameState(GameState.PAUSE);
			setTettrisBGameState(GameState.PAUSE);
		}
	}, [tetrisBGameState]);

	return (
		<>
			<div className="mat">
				<div className="row">
					<div id="1" className="col">
						<Tetris
							onLineComplete={setTetrisALinesCompleted}
							linesToAddFromEnd={tetrisBLinesCompleted}
							gameState={tetrisAGameState}
							setGameState={setTettrisAGameState}
						/>
					</div>
					<div id="2" className="col">
						<Tetris
							onLineComplete={setTetrisBLinesCompleted}
							linesToAddFromEnd={tetrisALinesCompleted}
							gameState={tetrisBGameState}
							setGameState={setTettrisBGameState}
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
						{winner != 0 ? <Button onClick={startNewGame}>Start</Button> : ""}
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
