import React, { useEffect, useState } from "react";
import { Game } from "../game/Game";
import { Players } from "../players/Players";

interface Props {}

export const Home: React.FC<Props> = (props: Props): JSX.Element => {
	const [page, setPage] = useState<JSX.Element>(<></>);

	const [playerId, setPlayerId] = useState<string | null>(null);

	useEffect(() => {
		setPage(<Players setPlayerId={setPlayerId} />);
	}, []);

	useEffect(() => {
		if (playerId != null) {
			setPage(<Game />);
		}
	}, [playerId]);

	return <>{page}</>;
};
