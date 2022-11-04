import React from "react";
import { Box } from "../box/Box";

interface Props {
	onClickUp: () => void;
	onClickLeft: () => void;
	onClickDown: () => void;
	onClickRight: () => void;
}

export const Controls: React.FC<Props> = (props: Props): JSX.Element => {
	const { onClickUp, onClickLeft, onClickDown, onClickRight } = props;
	return (
		<>
			<div className="mat">
				<div className="row">
					<div className="col hor-align-center">
						<h3>Controls</h3>
					</div>
				</div>
				<div className="row">
					<div className="col hor-align-center">
						<div className="mat control-buttons">
							<div className="row">
								<div className="col"></div>
								<div className="col" onClick={onClickUp}>
									<Box color={-1}>&uarr;</Box>
								</div>
								<div className="col"></div>
							</div>
							<div className="row">
								<div className="col" onClick={onClickLeft}>
									<Box color={-1}>&larr;</Box>
								</div>
								<div className="col"></div>
								<div className="col" onClick={onClickRight}>
									<Box color={-1}>&rarr;</Box>
								</div>
							</div>
							<div className="row">
								<div className="col"></div>
								<div className="col" onClick={onClickDown}>
									<Box color={-1}>&darr;</Box>
								</div>
								<div className="col"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
