import React from "react";
import { Button } from "../../components/button/Button";
import { Screens } from "../screenHome/ScreenHome";

interface Props {
	onSelect: (selectedScreen: Screens) => void;
}

export const ScreenSelection: React.FC<Props> = (props: Props): JSX.Element => {
	const onClickSinglePlayer = () => {
		props.onSelect(Screens.SinglePlayer);
	};

	const onClickMultiPlayer = () => {
		props.onSelect(Screens.MultiPlayer);
	};

	return (
		<>
			<div className="mat">
				<div className="row">
					<div className="col">
						<Button onClick={onClickSinglePlayer}>Single Player</Button>
					</div>
					<div className="col">
						<Button onClick={onClickMultiPlayer}>Multi Player</Button>
					</div>
				</div>
			</div>
		</>
	);
};
