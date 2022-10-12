import React from "react";
import Tetris from "../../components/tetris/Tetris";

interface Props {}

const Home: React.FC<Props> = (props: Props): JSX.Element => {
	return (
		<>
			<Tetris />
		</>
	);
};

export default Home;
