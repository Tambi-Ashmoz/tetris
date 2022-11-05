import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "../../components/button/Button";
import { Tetris } from "../../components/tetris/Tetris";
import { TetrisState, useTetris } from "../../hooks/UseTetris";

const YouLose = styled.div`
	color: #bb0000;
	text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
`;

const YouWin = styled.div`
	color: #00bb00;
	text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00e600, 0 0 40px #00e600, 0 0 50px #00e600, 0 0 60px #00e600, 0 0 70px #00e600;
`;

enum WarState {
	Wait,
	Start,
	Play,
	End,
}

interface Props {}

export const ScreenSinglePlayer: React.FC<Props> = (props: Props): JSX.Element => {
	const [warState, setWarState] = useState<WarState>(WarState.Wait);

	const tetris1 = useTetris();

	useEffect(() => {
		switch (warState) {
			case WarState.Wait:
				break;

			case WarState.Start:
				setWarState(WarState.Start);

				tetris1.setState(TetrisState.Reset);

				setTimeout(() => {
					tetris1.setState(TetrisState.Play);
					setWarState(WarState.Play);
				}, 2000);
				break;

			case WarState.Play:
				break;

			case WarState.End:
				tetris1.setState(TetrisState.Pause);
				setWarState(WarState.Wait);
				break;
		}
	}, [warState]);

	useEffect(() => {
		if (tetris1.isGameOver == true) {
			stopWar();
		}
	}, [tetris1.isGameOver]);

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
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						<h3>{warState == WarState.End ? "Game Over" : ""}</h3>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center margin-top-1">
						<h3>
							{warState == WarState.Wait ? "" : ""}
							{warState == WarState.Start ? "Ready ?" : ""}
							{warState == WarState.Play ? "Play !" : ""}
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
