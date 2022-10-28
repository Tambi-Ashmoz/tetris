import React, { useEffect, useState } from "react";
import { Game } from "../game/Game";
import { Init } from "../init/Init";

enum PageName {
	Init,
	Game,
}

interface Props {}

export const Home: React.FC<Props> = (props: Props): JSX.Element => {
	const [pageName, setPageName] = useState<PageName>(PageName.Init);

	useEffect(() => {
		setTimeout(() => {
			setPageName(PageName.Game);
		}, 2000);
	}, []);

	const getPage = (pageName: PageName): JSX.Element => {
		let page: JSX.Element = <></>;

		switch (pageName) {
			case PageName.Init:
				page = <Init />;
				break;

			case PageName.Game:
				page = <Game />;
				break;
		}

		return page;
	};

	return <>{getPage(pageName)}</>;
};
