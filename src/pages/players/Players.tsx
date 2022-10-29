import React from "react";
import { Button } from "../../components/button/Button";

interface Props {
	setPlayerId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Players: React.FC<Props> = (props: Props): JSX.Element => {
	const players = ["Player 1", "Player 2", "Player 3", "Player 4"];

	const onClick = (playerId: string) => {
		props.setPlayerId(playerId);
	};

	return (
		<>
			<div className="mat">
				<div className="row">
					<div className="col">
						<h3>Players online:</h3>
					</div>
				</div>
				{players.map((item, i, arr) => (
					<div className="row" key={i}>
						<div className="col">
							<Button onClick={() => onClick(item)}>
								{item}
							</Button>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
