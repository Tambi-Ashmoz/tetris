import React from "react";

interface Props {}

export const Init: React.FC<Props> = (props: Props): JSX.Element => {
	return (
		<>
			<div className="mat">
				<div className="row">
					<div className="col">
						<h3>Connecting to server...</h3>
					</div>
				</div>
			</div>
		</>
	);
};
