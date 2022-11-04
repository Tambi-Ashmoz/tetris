import React, { useEffect, useState } from "react";
import { Button } from "../../components/button/Button";
import { Tetris } from "../../components/tetris/Tetris";
import { TetrisState, useTetris } from "../../hooks/UseTetris";

enum WarState {
	WaitingToStart = "WaitingToStart",
	Reset = "Reset",
	CountDown3 = "CountDown3",
	CountDown2 = "CountDown2",
	CountDown1 = "CountDown1",
	Go = "Go",
	Playing = "Playing",
	WarOver = "WarOver",
}

interface Props {
	player: string;
	webSocketMessage: any;
	webSocketSend: (message: {}) => void;
}

export const War: React.FC<Props> = (props: Props): JSX.Element => {
	const { player, webSocketMessage, webSocketSend } = props;

	const [warState, setWarState] = useState<WarState>(WarState.WaitingToStart);
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
			case WarState.WaitingToStart:
				tetris1.setState(TetrisState.Reset);

				setWinner(0);
				break;

			case WarState.Reset:
				tetris1.setState(TetrisState.Reset);

				setWinner(0);
				setWarState(WarState.CountDown3);
				break;

			case WarState.CountDown3:
				setTimeout(() => {
					setWarState(WarState.CountDown2);
				}, 1000);
				break;

			case WarState.CountDown2:
				setTimeout(() => {
					setWarState(WarState.CountDown1);
				}, 1000);
				break;

			case WarState.CountDown1:
				setTimeout(() => {
					setWarState(WarState.Go);
				}, 1000);
				break;

			case WarState.Go:
				tetris1.setState(TetrisState.Play);

				setTimeout(() => {
					setWarState(WarState.Playing);
				}, 1000);
				break;

			case WarState.Playing:
				break;

			case WarState.WarOver:
				tetris1.setState(TetrisState.Pause);
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
			warState: warState,
		});

		tetris1.setLinesCleared(0);
	}, [warState, tetris1.board, tetris1.next, tetris1.isGameOver, tetris1.lines, tetris1.linesCleared]);

	useEffect(() => {
		switch (webSocketMessage.action) {
			case "snapshot":
				if (webSocketMessage.player != player) {
					setWarState(webSocketMessage.warState);

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
		}
	}, [webSocketMessage]);

	const startWar = () => {
		setWarState(WarState.Reset);
	};

	const stopWar = () => {
		setWarState(WarState.WarOver);
	};

	return (
		<>
			<div className="mat">
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
						<h3>{warState == WarState.WarOver ? "War Over" : ""}</h3>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						<h3>
							{warState == WarState.WaitingToStart ? "Waiting To Start" : ""}
							{warState == WarState.CountDown3 ? "Get Ready 3" : ""}
							{warState == WarState.CountDown2 ? "Get Ready 2" : ""}
							{warState == WarState.CountDown1 ? "Get Ready 1" : ""}
							{warState == WarState.Go ? "Go !" : ""}
							{warState == WarState.Playing ? "Play !" : ""}
							{winner == 1 ? "You Win!" : ""}
							{winner == 2 ? "You Lose!" : ""}
						</h3>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						{warState == WarState.WaitingToStart || warState == WarState.WarOver ? <Button onClick={startWar}>Start</Button> : <></>}
					</div>
				</div>
			</div>
		</>
	);
};
