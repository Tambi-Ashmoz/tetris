import React from "react";
import "./Button.css";

interface Props {
	onClick?: () => void;
	children: React.ReactNode;
}

export default (props: Props): JSX.Element => {
	return (
		<>
			<div className="btn padding-1" onClick={props.onClick}>
				{props.children}
			</div>
		</>
	);
};
