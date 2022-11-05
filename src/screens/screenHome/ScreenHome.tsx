import React, { useState } from "react";
import { ScreenMultiPlayer } from "../screenMultiPLayer/ScreenMultiPlayer";
import { ScreenSelection } from "../screenSelection/ScreenSelection";
import { ScreenSinglePlayer } from "../screenSinglePLayer/ScreenSinglePlayer";

export enum Screens {
	Selection,
	SinglePlayer,
	MultiPlayer,
}

interface Props {}

export const ScreenHome: React.FC<Props> = (props: Props): JSX.Element => {
	const [screen, setScreen] = useState<Screens>(Screens.Selection);

	const onSelect = (selectedScreen: Screens) => {
		setScreen(selectedScreen);
	};

	return (
		<>
			{screen == Screens.Selection ? <ScreenSelection onSelect={onSelect} /> : <></>}
			{screen == Screens.SinglePlayer ? <ScreenSinglePlayer /> : <></>}
			{screen == Screens.MultiPlayer ? <ScreenMultiPlayer /> : <></>}
		</>
	);
};
