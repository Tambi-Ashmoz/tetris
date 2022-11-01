import React from "react";

interface Props {
	lines: number;
}

export const Lines: React.FC<Props> = (props: Props): JSX.Element => {
	const { lines } = props;

	return (
		<>
			<div className="mat">
				<div className="row">
					<div className="col">
						<h3 className="margin-0">Lines</h3>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center">
						<h3>{lines}</h3>
					</div>
				</div>
			</div>
		</>
	);
};
