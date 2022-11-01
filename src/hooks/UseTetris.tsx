import { useEffect, useState } from "react";
import { usePolling } from "../components/tetris/hooks/UsePolling";

export enum TetrisState {
	Reset = "Reset",
	Play = "Play",
	Pause = "Pause",
}

export const useTetris = () => {
	const [state, setState] = useState<TetrisState>(TetrisState.Reset);

	const [board, setBoard] = useState(initialBoard);
	const [boardToDisplay, setBoardToDisplay] = useState(initialBoard);

	const [pieceSlide, setPieceSlide] = useState(pieces[0]);
	const [pieceSlideX, setPieceSlideX] = useState(getBoardMiddle(board));
	const [pieceSlideY, setPieceSlideY] = useState(0);

	const [pieceNext, setPieceNext] = useState(pieces[0]);

	const [isGameOver, setIsGameOver] = useState(false);
	const [completedLinesAmount, setCompletedLinesAmount] = useState(0);

	const [pollingTime, setPollingTime] = useState(0);

	const [linesCleared, setLinesCleared] = useState<number>(0);

	useEffect(() => {
		if (isGameOver == true) {
			setPollingTime(0);
			setState(TetrisState.Pause);
		}
	}, [isGameOver]);

	usePolling(() => {
		onClickDown();
	}, pollingTime);

	useEffect(() => {
		switch (state) {
			case TetrisState.Reset:
				resetGame();
				break;

			case TetrisState.Play:
				setPollingTime(1000);
				break;

			case TetrisState.Pause:
				setPollingTime(0);
				break;
		}
	}, [state]);

	const setPieceXY = (x: number, y: number) => {
		if (isCanPutPieceOnBoard(board, pieceSlide, x, y) == true) {
			setPieceSlideX(x);
			setPieceSlideY(y);

			const newBoard = putPieceOnBoard(board, pieceSlide, x, y);
			setBoardToDisplay(newBoard);
		}
	};

	const onClickLeft = () => {
		if (pollingTime == 0) {
			return;
		}

		setPieceXY(pieceSlideX - 1, pieceSlideY);
	};

	const onClickRight = () => {
		if (pollingTime == 0) {
			return;
		}

		setPieceXY(pieceSlideX + 1, pieceSlideY);
	};

	const onClickUp = () => {
		if (pollingTime == 0) {
			return;
		}

		const newPiece = rotatePieceToLeft(pieceSlide);

		if (isCanPutPieceOnBoard(board, newPiece, pieceSlideX, pieceSlideY) == true) {
			setPieceSlide(newPiece);

			const newBoard = putPieceOnBoard(board, newPiece, pieceSlideX, pieceSlideY);
			setBoardToDisplay(newBoard);
		}
	};

	const onClickDown = () => {
		if (pollingTime == 0) {
			return;
		}

		if (isCanPutPieceOnBoard(board, pieceSlide, pieceSlideX, pieceSlideY + 1) === true) {
			setPieceXY(pieceSlideX, pieceSlideY + 1);
		} else if (pieceSlideY === 0) {
			setIsGameOver(true);
		} else {
			//freeze pieceSlide on the back board
			const newBoard = putPieceOnBoard(board, pieceSlide, pieceSlideX, pieceSlideY);

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

			//update parent with deleted fullLines
			setLinesCleared(fullLines.length);
		}
	};

	const resetGame = () => {
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

		const newBoardToDisplay = putPieceOnBoard(newBoard, newPieceSlide, newPieceSlideX, newPieceSlideY);

		setBoardToDisplay(newBoardToDisplay);
	};

	const pushLines = (linesCleared: number) => {
		if (isGameOver === false && linesCleared > 0) {
			const newLinesWithEmptySpots = generateRandomLines(board, linesCleared);
			const newBoardWithLines = addBoardLinesFromEnd(board, newLinesWithEmptySpots);
			const newBoard = putPieceOnBoard(newBoardWithLines, pieceSlide, pieceSlideX, pieceSlideY);

			setBoard(newBoardWithLines);
			setBoardToDisplay(newBoard);
		}
	};

	return {
		board: boardToDisplay,
		next: pieceNext,
		isGameOver: isGameOver,
		lines: completedLinesAmount,
		linesCleared: linesCleared,

		state: state,
		setState: setState,

		onClickLeft: onClickLeft,
		onClickRight: onClickRight,
		onClickUp: onClickUp,
		onClickDown: onClickDown,

		pushLines: pushLines,
	};
};

const initialBoard = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const pieces = [
	[
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
	],
	[
		[1, 1],
		[1, 1],
	],
	[
		[0, 2, 2],
		[2, 2, 0],
		[0, 0, 0],
	],
	[
		[3, 3, 0],
		[0, 3, 3],
		[0, 0, 0],
	],
	[
		[0, 4, 0],
		[4, 4, 4],
		[0, 0, 0],
	],
	[
		[0, 0, 5],
		[5, 5, 5],
		[0, 0, 0],
	],
	[
		[6, 0, 0],
		[6, 6, 6],
		[0, 0, 0],
	],
	[
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
	],
];

const getRandomNumber = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomPieceNumber = () => {
	const min = 1;
	const max = pieces.length - 1;
	return getRandomNumber(min, max);
};

const getBoardMiddle = (board: number[][]) => {
	return Math.floor(board[0].length / 2) - 1;
};

const cloneMatrix = (matrix: number[][]) => {
	const newMatrix: number[][] = [];

	for (let i = 0; i < matrix.length; i++) {
		newMatrix[i] = [];

		for (let j = 0; j < matrix[i].length; j++) {
			newMatrix[i][j] = matrix[i][j];
		}
	}

	return newMatrix;
};

const putPieceOnBoard = (board: number[][], piece: number[][], x: number, y: number) => {
	const newBoard: number[][] = cloneMatrix(board);

	for (let i = 0; i < piece.length; i++) {
		for (let j = 0; j < piece[i].length; j++) {
			if (newBoard[y + i]?.[x + j] === 0) {
				newBoard[y + i][x + j] = piece[i][j];
			}
		}
	}

	return newBoard;
};

const isCanPutPieceOnBoard = (board: number[][], piece: number[][], x: number, y: number) => {
	for (let i = 0; i < piece.length; i++) {
		for (let j = 0; j < piece[i].length; j++) {
			if (piece[i][j] === 0) {
				continue;
			}

			if (y + i > board.length - 1 || y + i < 0) {
				return false;
			}

			if (x + j > board[y + i].length - 1 || x + j < 0) {
				return false;
			}

			if (board[y + i][x + j] !== 0) {
				return false;
			}
		}
	}

	return true;
};

const rotatePieceToLeft = (piece: number[][]) => {
	let newPiece = cloneMatrix(piece);

	for (let i = 0; i < piece.length; i++) {
		for (let j = 0; j < piece[i].length; j++) {
			newPiece[piece[i].length - 1 - j][i] = piece[i][j];
		}
	}

	return newPiece;
};

const rotatePieceToRight = (piece: number[][]) => {
	const newPiece = cloneMatrix(piece);

	for (let i = 0; i < piece.length; i++) {
		for (let j = 0; j < piece[i].length; j++) {
			newPiece[j][piece[i].length - 1 - i] = piece[i][j];
		}
	}

	return newPiece;
};

const removeBoardFullLines = (board: number[][]) => {
	const newBoard = cloneMatrix(board);

	for (let i = 0; i < newBoard.length; i++) {
		for (let j = 0; j < newBoard[i].length; j++) {
			newBoard[i][j] = 0;
		}
	}

	for (let i = board.length - 1, k = newBoard.length - 1; i >= 0; i--) {
		let isLineFull = true;

		for (let j = 0; j < board[i].length; j++) {
			if (board[i][j] === 0) {
				isLineFull = false;
				break;
			}
		}

		if (isLineFull === false) {
			for (let j = 0; j < board[i].length; j++) {
				newBoard[k][j] = board[i][j];
			}

			k--;
		}
	}

	return newBoard;
};

const getBoardFullLines = (board: number[][]) => {
	let fullLines = [];

	for (let i = board.length - 1, k = board.length - 1; i >= 0; i--) {
		let isLineFull = true;

		for (let j = 0; j < board[i].length; j++) {
			if (board[i][j] === 0) {
				isLineFull = false;
				break;
			}
		}

		if (isLineFull === true) {
			fullLines.push(board[i]);
		}
	}

	return fullLines;
};

const generateRandomLines = (board: number[][], numberOfLines: number) => {
	const lines: number[][] = [];

	for (let i = 0; i < numberOfLines; i++) {
		lines[i] = [];

		for (let j = 0; j < board[0].length; j++) {
			lines[i][j] = 8;
		}

		const emtySpotIndex = getRandomNumber(0, board[0].length - 1);

		lines[i][emtySpotIndex] = 0;
	}

	return lines;
};

const addBoardLinesFromEnd = (board: number[][], lines: number[][]) => {
	const newBoard = cloneMatrix(board);

	for (let i = 0; i < newBoard.length; i++) {
		for (let j = 0; j < newBoard[i].length; j++) {
			newBoard[i][j] = 0;
		}
	}

	for (let i = 0; i < lines.length; i++) {
		newBoard[newBoard.length - 1 - i] = lines[i];
	}

	for (let i = board.length - 1; i >= 0; i--) {
		newBoard[i - lines.length] = board[i];
	}

	return newBoard;
};
