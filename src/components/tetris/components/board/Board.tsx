import React from "react";
import { Box } from "../box/Box";

interface Props {
	boardToDisplay: number[][];
}

export const Board: React.FC<Props> = (props: Props): JSX.Element => {
	const { boardToDisplay } = props;
	return (
		<>
			<div className="mat board">
				{boardToDisplay.map((row, i) => (
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
