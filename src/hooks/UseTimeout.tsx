import { useEffect, useRef } from "react";

export const useTimeout = (
	callbackTimeout: () => void,
	timeout: number,
	callbackInterval: () => void,
	interval: number
) => {
	const callbackTimeoutRef = useRef(callbackTimeout);
	const callbackIntervalRef = useRef(callbackInterval);

	useEffect(() => {
		callbackTimeoutRef.current = callbackTimeout;
	}, [callbackTimeout]);

	useEffect(() => {
		callbackIntervalRef.current = callbackInterval;
	}, [callbackInterval]);

	useEffect(() => {
		if (timeout <= 0) {
			return;
		}

		if (interval <= 0) {
			interval = timeout;
		}

		const timeoutId = setTimeout(() => {
			clearTimers();

			callbackTimeoutRef.current();
		}, timeout);

		const intervalId = setInterval(() => {
			callbackIntervalRef.current();
		}, interval);

		const clearTimers = () => {
			clearTimeout(timeoutId);
			clearInterval(intervalId);
		};

		return () => {
			clearTimers();
		};
	}, [timeout, interval]);
};
