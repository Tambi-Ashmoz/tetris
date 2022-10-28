import { useEffect, useRef, useState } from "react";

export const usePolling = (callback: () => void, pollingTime: number) => {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		if (pollingTime <= 0) {
			return;
		}

		const intervalId = setInterval(() => {
			callbackRef.current();
		}, pollingTime);

		return () => {
			clearInterval(intervalId);
		};
	}, [pollingTime]);
};
