import React from "react";
import { Button } from "../../components/button/Button";

interface Props {
	playerId1: string;
	setPlayerId2: React.Dispatch<React.SetStateAction<string>>;
	playersIds: string[];
}

export const ScreenPlayers: React.FC<Props> = (props: Props): JSX.Element => {
	const onClickPlayer = (player: string) => {
		props.setPlayerId2(player);
	};

	return (
		<>
			<div className="mat">
				<div className="row">
					<div className="col">
						<h3>Player: {props.playerId1}</h3>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<Button onClick={() => onClickPlayer("-1")}>Practice</Button>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<h3>Players online: {props.playersIds.length}</h3>
					</div>
				</div>
				{props.playersIds.map((item, i, arr) => (
					<div className="row" key={i}>
						<div className="col">
							<Button onClick={() => onClickPlayer(item)}>{item}</Button>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
