import React, { useEffect, useState } from "react";
import { Button } from "../../components/button/Button";
import { Tetris } from "../../components/tetris/Tetris";
import { TetrisState, useTetris } from "../../hooks/UseTetris";

enum WarState {
	Wait,
	Start,
	Play,
	End,
}

interface Props {
	player: string;
	webSocketMessage: any;
	webSocketSend: (message: {}) => void;
}

export const War: React.FC<Props> = (props: Props): JSX.Element => {
	const { player, webSocketMessage, webSocketSend } = props;

	const [warState, setWarState] = useState<WarState>(WarState.Wait);
	const [winner, setWinner] = useState<number>(0);

	const tetris1 = useTetris();
	const [tetris2, setTetris2] = useState({
		board: tetris1.board,
		next: tetris1.next,
		isGameOver: tetris1.isGameOver,
		lines: tetris1.lines,
		linesCleared: tetris1.linesCleared,
		state: tetris1.state,
	});

	useEffect(() => {
		switch (warState) {
			case WarState.Wait:
				break;

			case WarState.Start:
				webSocketSend({ action: "start" });
				break;

			case WarState.Play:
				break;

			case WarState.End:
				webSocketSend({ action: "end" });
				break;
		}
	}, [warState]);

	useEffect(() => {
		webSocketSend({
			action: "snapshot",
			player: player,
			board: tetris1.board,
			next: tetris1.next,
			isGameOver: tetris1.isGameOver,
			lines: tetris1.lines,
			linesCleared: tetris1.linesCleared,
		});

		tetris1.setLinesCleared(0);
	}, [tetris1.board, tetris1.next, tetris1.isGameOver, tetris1.lines, tetris1.linesCleared]);

	useEffect(() => {
		// console.log(webSocketMessage.action);

		switch (webSocketMessage.action) {
			case "snapshot":
				if (webSocketMessage.player != player) {
					tetris1.pushLines(webSocketMessage.linesCleared);

					setTetris2({
						...tetris2,
						board: webSocketMessage.board,
						next: webSocketMessage.next,
						lines: webSocketMessage.lines,
					});
				}

				if (webSocketMessage.isGameOver == true) {
					stopWar();

					if (webSocketMessage.player != player) {
						setWinner(1);
					}

					if (webSocketMessage.player == player) {
						setWinner(2);
					}
				}

				break;

			case "start":
				setWarState(WarState.Start);

				tetris1.setState(TetrisState.Reset);
				setWinner(0);

				setTimeout(() => {
					tetris1.setState(TetrisState.Play);
					setWarState(WarState.Play);
				}, 2000);
				break;

			case "end":
				tetris1.setState(TetrisState.Pause);
				setWarState(WarState.Wait);
				break;
		}
	}, [webSocketMessage]);

	const startWar = () => {
		setWarState(WarState.Start);
	};

	const stopWar = () => {
		setWarState(WarState.End);
	};

	return (
		<>
			<div className="mat">
				<div className="row">
					<div className="col">Player: {player}</div>
				</div>
				<div className="row">
					<div className="col">
						<Tetris
							board={tetris1.board}
							next={tetris1.next}
							lines={tetris1.lines}
							onClickUp={tetris1.onClickUp}
							onClickDown={tetris1.onClickDown}
							onClickLeft={tetris1.onClickLeft}
							onClickRight={tetris1.onClickRight}
						/>
					</div>
					<div className="col">
						<Tetris board={tetris2.board} next={tetris2.next} lines={tetris2.lines} />
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						<h3>{warState == WarState.End ? "War Over" : ""}</h3>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						<h3>
							{warState == WarState.Wait ? "" : ""}
							{warState == WarState.Start ? "Ready ?" : ""}
							{warState == WarState.Play ? "Play !" : ""}
							{winner == 1 ? "You Win!" : ""}
							{winner == 2 ? "You Lose!" : ""}
						</h3>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">{warState == WarState.Wait ? <Button onClick={startWar}>Start</Button> : <></>}</div>
				</div>
			</div>
		</>
	);
};
