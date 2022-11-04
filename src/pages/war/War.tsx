import React, { useEffect, useState } from "react";
import { Button } from "../../components/button/Button";
import { Tetris } from "../../components/tetris/Tetris";
import { TetrisState, useTetris } from "../../hooks/UseTetris";

enum WarState {
	Reset = 0,
	Ready = 1,
	Play = 2,
	WarOver = 3,
}

interface Props {
	player: string;
	webSocketMessage: any;
	webSocketSend: (message: {}) => void;
}

export const War: React.FC<Props> = (props: Props): JSX.Element => {
	const { player, webSocketMessage, webSocketSend } = props;

	const [warState, setWarState] = useState<WarState>(WarState.Reset);
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
			case WarState.Reset:
				tetris1.setState(TetrisState.Reset);

				setWinner(0);
				break;

			case WarState.Ready:
				setTimeout(() => {
					tetris1.setState(TetrisState.Play);

					setWarState(WarState.Play);
				}, 2000);
				break;

			case WarState.Play:
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
					if (warState < webSocketMessage.warState || warState == WarState.WarOver) {
						setWarState(webSocketMessage.warState);
					}

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

		setTimeout(() => {
			setWarState(WarState.Ready);
		}, 1000);
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
							{warState == WarState.Reset ? "" : ""}
							{warState == WarState.Ready ? "Ready ?" : ""}
							{warState == WarState.Play ? "Play !" : ""}
							{winner == 1 ? "You Win!" : ""}
							{winner == 2 ? "You Lose!" : ""}
						</h3>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						{warState == WarState.Reset ? <Button onClick={startWar}>Start</Button> : <></>}
						{warState == WarState.WarOver ? <Button onClick={startWar}>Start</Button> : <></>}
					</div>
				</div>
			</div>
		</>
	);
};
