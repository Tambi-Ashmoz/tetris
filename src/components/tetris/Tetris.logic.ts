export const initialBoard = [
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


export const pieces = [
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

export const getRandomNumber = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomPieceNumber = () => {
	const min = 1;
	const max = pieces.length - 1;
	return getRandomNumber(min, max);
}

export const getBoardMiddle = (board: number[][]) => {
	return Math.floor(board[0].length / 2) - 1;
}

export const cloneMatrix = (matrix: number[][]) => {
	const newMatrix: number[][] = [];

	for (let i = 0; i < matrix.length; i++) {
		newMatrix[i] = [];

		for (let j = 0; j < matrix[i].length; j++) {
			newMatrix[i][j] = matrix[i][j];
		}
	}

	return newMatrix;
}

export const putPieceOnBoard = (board: number[][], piece: number[][], x: number, y: number) => {
	const newBoard: number[][] = cloneMatrix(board);

	for (let i = 0; i < piece.length; i++) {
		for (let j = 0; j < piece[i].length; j++) {
			if (newBoard[y + i]?.[x + j] === 0) {
				newBoard[y + i][x + j] = piece[i][j];

			}
		}
	}

	return newBoard;
}

export const isCanPutPieceOnBoard = (board: number[][], piece: number[][], x: number, y: number) => {
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
}

export const rotatePieceToLeft = (piece: number[][]) => {
	let newPiece = cloneMatrix(piece);

	for (let i = 0; i < piece.length; i++) {
		for (let j = 0; j < piece[i].length; j++) {
			newPiece[piece[i].length - 1 - j][i] = piece[i][j];
		}
	}

	return newPiece;
}

export const rotatePieceToRight = (piece: number[][]) => {
	const newPiece = cloneMatrix(piece);

	for (let i = 0; i < piece.length; i++) {
		for (let j = 0; j < piece[i].length; j++) {
			newPiece[j][piece[i].length - 1 - i] = piece[i][j];
		}
	}

	return newPiece;
}

export const removeBoardFullLines = (board: number[][]) => {
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
}

export const getBoardFullLines = (board: number[][]) => {
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
}

export const generateRandomLines = (board: number[][], numberOfLines: number) => {
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
}

export const addBoardLinesFromEnd = (board: number[][], lines: number[][]) => {
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
}
