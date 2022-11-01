import React from "react";
import { Box } from "../box/Box";

interface Props {
	board: number[][];
}

export const Board: React.FC<Props> = (props: Props): JSX.Element => {
	const { board } = props;

	return (
		<>
			<div className="mat board">
				{board.map((row, i) => (
					<div key={i} className="row">
						{row.map((col, j) => (
							<div key={j} className="col">
								<Box color={col} />
							</div>
						))}
					</div>
				))}
			</div>
		</>
	);
};
