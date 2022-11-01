import React from "react";
import { Button } from "../../components/button/Button";

interface Props {
	player1: string;
	setPlayer2: React.Dispatch<React.SetStateAction<string>>;
	players: string[];
}

export const Players: React.FC<Props> = (props: Props): JSX.Element => {
	const onClickPlayer = (player: string) => {
		props.setPlayer2(player);
	};

	return (
		<>
			<div className="mat">
				<div className="row">
					<div className="col">
						<h3>Player:</h3>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<div>{props.player1}</div>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<h3>Players online: {props.players.length}</h3>
					</div>
				</div>
				{props.players.map((item, i, arr) => (
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
