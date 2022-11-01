import React from "react";
import { Board } from "./components/board/Board";
import { Controls } from "./components/controls/Controls";
import { Lines } from "./components/lines/Lines";
import { Next } from "./components/next/Next";
import "./Tetris.css";

interface Props {
	board: number[][];
	next: number[][];

	lines: number;

	onClickUp?: () => void;
	onClickDown?: () => void;
	onClickLeft?: () => void;
	onClickRight?: () => void;
}

export const Tetris: React.FC<Props> = (props: Props): JSX.Element => {
	const { board, next, lines, onClickUp, onClickDown, onClickLeft, onClickRight } = props;

	return (
		<>
			<div className="mat">
				<div className="row">
					<div className="col">
						<h3>Tetris</h3>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<Board board={board} />
					</div>
					<div className="col margin-left-1 margin-right-1">
						<div className="mat">
							<div className="row">
								<div className="col hor-align-center">
									<Next next={next} />
								</div>
							</div>
							<div className="row">
								<div className="col hor-align-center">
									<Lines lines={lines} />
								</div>
							</div>

							<div className="row">
								<div className="col">
									{onClickUp && onClickDown && onClickLeft && onClickRight ? (
										<Controls
											onClickUp={onClickUp}
											onClickLeft={onClickLeft}
											onClickDown={onClickDown}
											onClickRight={onClickRight}
										/>
									) : (
										<></>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
