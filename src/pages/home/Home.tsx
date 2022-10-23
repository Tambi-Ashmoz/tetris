import React, { useState } from "react";
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

	const [gameState, setGameState] = useState<GameState>(GameState.GAME_OVER);

	const startNewGame = () => {
		setGameState(GameState.NEW_GAME);
	};

	return (
		<>
			<div className="mat">
				<div className="row">
					<div id="1" className="col">
						<Tetris
							onLineComplete={setTetrisALinesCompleted}
							linesToAddFromEnd={tetrisBLinesCompleted}
							setGameState={setGameState}
						/>
					</div>
					<div id="2" className="col">
						<Tetris
							onLineComplete={setTetrisBLinesCompleted}
							linesToAddFromEnd={tetrisALinesCompleted}
							setGameState={setGameState}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						<div className="game-over">
							{gameState === GameState.GAME_OVER ? "Game Over" : ""}
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						{gameState === GameState.GAME_OVER ? (
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
