import React from "react";

interface Props {
	completedLinesAmount: number;
}

const Lines: React.FC<Props> = (props: Props): JSX.Element => {
	const { completedLinesAmount } = props;
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
						<h3>{completedLinesAmount}</h3>
					</div>
				</div>
			</div>
		</>
	);
};

export default Lines;
