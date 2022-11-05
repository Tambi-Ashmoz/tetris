import React from "react";
import { Button } from "../../components/button/Button";

interface Props {
	playerId1: string;
	playersIds: string[];
	onSelectPlayer: (playerId: string) => void;
}

export const ScreenPlayers: React.FC<Props> = (props: Props): JSX.Element => {
	const onClickPlayer = (playerId: string) => {
		props.onSelectPlayer(playerId);
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
