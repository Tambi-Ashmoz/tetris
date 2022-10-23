import React, { useState } from "react";
import Tetris from "../../components/tetris/Tetris";

interface Props {}

const Home: React.FC<Props> = (props: Props): JSX.Element => {
	const [tetrisALinesCompleted, setTetrisALinesCompleted] = useState<
		number[][]
	>([]);

	const [tetrisBLinesCompleted, setTetrisBLinesCompleted] = useState<
		number[][]
	>([]);

	return (
		<>
			<div className="mat">
				<div className="row">
					<div id="1" className="col">
						<Tetris
							linesToAddFromEnd={tetrisBLinesCompleted}
							setLinesCompleted={setTetrisALinesCompleted}
						/>
					</div>
					<div id="2" className="col">
						<Tetris
							linesToAddFromEnd={tetrisALinesCompleted}
							setLinesCompleted={setTetrisBLinesCompleted}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
