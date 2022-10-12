import React, { useEffect, useState } from "react";
import Board from "./components/board/Board";
import Controls from "./components/controls/Controls";
import Lines from "./components/lines/Lines";
import Next from "./components/next/Next";
import usePolling from "./hooks/UsePolling";
import "./Tetris.css";
import {
	getBoardFullLines,
	getBoardMiddle,
	getRandomPieceNumber,
	initialBoard,
	isCanPutPieceOnBoard,
	pieces,
	putPieceOnBoard,
	removeBoardFullLines,
	rotatePieceToLeft,
} from "./Tetris.logic";

interface Props {}

const Tetris: React.FC<Props> = (props: Props): JSX.Element => {
	const [board, setBoard] = useState(initialBoard);
	const [boardToDisplay, setBoardToDisplay] = useState(initialBoard);

	const [pieceSlide, setPieceSlide] = useState(pieces[getRandomPieceNumber()]);
	const [pieceSlideX, setPieceSlideX] = useState(getBoardMiddle(board));
	const [pieceSlideY, setPieceSlideY] = useState(0);

	const [pieceNext, setPieceNext] = useState(pieces[getRandomPieceNumber()]);

	const [isGameOver, setIsGameOver] = useState(false);
	const [completedLinesAmount, setCompletedLinesAmount] = useState(0);

	const [pollingTime, setPollingTime] = useState(0);

	useEffect(() => {
		startNewGame();
	}, []);

	useEffect(() => {
		if (isGameOver == true) {
			setPollingTime(0);
		}
	}, [isGameOver]);

	usePolling(() => {
		onClickDown();
	}, pollingTime);

	const setPieceXY = (x: number, y: number) => {
		if (isCanPutPieceOnBoard(board, pieceSlide, x, y) == true) {
			setPieceSlideX(x);
			setPieceSlideY(y);

			const newBoard = putPieceOnBoard(board, pieceSlide, x, y);
			setBoardToDisplay(newBoard);
		}
	};

	const onClickLeft = () => {
		setPieceXY(pieceSlideX - 1, pieceSlideY);
	};

	const onClickRight = () => {
		setPieceXY(pieceSlideX + 1, pieceSlideY);
	};

	const onClickUp = () => {
		const newPiece = rotatePieceToLeft(pieceSlide);

		if (
			isCanPutPieceOnBoard(board, newPiece, pieceSlideX, pieceSlideY) == true
		) {
			setPieceSlide(newPiece);

			const newBoard = putPieceOnBoard(
				board,
				newPiece,
				pieceSlideX,
				pieceSlideY
			);
			setBoardToDisplay(newBoard);
		}
	};

	const onClickDown = () => {
		if (
			isCanPutPieceOnBoard(board, pieceSlide, pieceSlideX, pieceSlideY + 1) ===
			true
		) {
			setPieceXY(pieceSlideX, pieceSlideY + 1);
		} else if (pieceSlideY === 0) {
			setIsGameOver(true);
		} else {
			//freeze pieceSlide on the back board
			const newBoard = putPieceOnBoard(
				board,
				pieceSlide,
				pieceSlideX,
				pieceSlideY
			);

			//count full lines
			const fullLines = getBoardFullLines(newBoard);

			setCompletedLinesAmount(completedLinesAmount + fullLines.length);

			//remove any full line in this newBoard if we have one
			const newBoardWithNoFullLines = removeBoardFullLines(newBoard);

			//save clean newBoard
			setBoard(newBoardWithNoFullLines);

			//take the nextPiece and make it as oure new piece on the top of the board
			const newPieceSlide = pieceNext;
			const newPieceSlideX = getBoardMiddle(board);
			const newPieceSlideY = 0;

			setPieceSlide(newPieceSlide);
			setPieceSlideX(newPieceSlideX);
			setPieceSlideY(newPieceSlideY);

			//put pieceSlide on boardToDisplay
			const newBoardToDisplay = putPieceOnBoard(
				newBoardWithNoFullLines,
				newPieceSlide,
				newPieceSlideX,
				newPieceSlideY
			);

			//save new boardToDisplay
			setBoardToDisplay(newBoardToDisplay);

			//generate new random next piece
			setPieceNext(pieces[getRandomPieceNumber()]);
		}
	};

	const startNewGame = () => {
		const newBoard = initialBoard;

		const newPieceSlide = pieces[getRandomPieceNumber()];
		const newPieceSlideX = getBoardMiddle(board);
		const newPieceSlideY = 0;

		const newPieceNext = pieces[getRandomPieceNumber()];

		const newIsGameOver = false;
		const newCompletedLines = 0;

		setPieceSlide(newPieceSlide);
		setPieceSlideX(newPieceSlideX);
		setPieceSlideY(newPieceSlideY);

		setPieceNext(newPieceNext);

		setIsGameOver(newIsGameOver);
		setCompletedLinesAmount(newCompletedLines);

		setBoard(newBoard);

		const newBoardToDisplay = putPieceOnBoard(
			newBoard,
			newPieceSlide,
			newPieceSlideX,
			newPieceSlideY
		);

		setBoardToDisplay(newBoardToDisplay);

		setPollingTime(1000);
	};

	return (
		<>
			<div className="mat">
				<div className="row">
					<div className="col">
						<h3>
							Tetris {isGameOver ? "- Game Over !" : ""} {isGameOver ? "" : ""}{" "}
						</h3>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<Board boardToDisplay={boardToDisplay} />
						{isGameOver ? (
							<div className="btn btn-new_game" onClick={startNewGame}>
								New Game
							</div>
						) : (
							""
						)}
					</div>
					<div className="col margin-left-1 margin-right-1">
						<div className="mat">
							<div className="row">
								<div className="col hor-align-center">
									<Next pieceNext={pieceNext} />
								</div>
							</div>
							<div className="row">
								<div className="col hor-align-center">
									<Lines completedLinesAmount={completedLinesAmount} />
								</div>
							</div>

							<div className="row">
								<div className="col">
									<Controls
										onClickUp={onClickUp}
										onClickLeft={onClickLeft}
										onClickDown={onClickDown}
										onClickRight={onClickRight}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Tetris;
