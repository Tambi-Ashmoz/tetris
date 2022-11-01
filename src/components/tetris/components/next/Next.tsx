import React from "react";
import { Box } from "../box/Box";

interface Props {
	next: number[][];
}

export const Next: React.FC<Props> = (props: Props): JSX.Element => {
	const { next } = props;

	return (
		<>
			<div className="mat">
				<div className="row">
					<div className="col hor-align-center">
						<h3>Next</h3>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<div className="mat next">
							{next.map((row, i) => (
								<div key={i} className="row">
									{row.map((col, j) => (
										<div key={j} className="col">
											<Box color={col} />
										</div>
									))}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
