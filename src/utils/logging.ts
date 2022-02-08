/* eslint-disable no-console */
export type LogAdmin = (...args: unknown[]) => void;

const css = `color: blue`;
const inDevelopment = process.env.NODE_ENV === 'development'

export function logAdminExternal(...args: unknown[]): void {
	if (!inDevelopment && (args as unknown as {viaContext: boolean}).viaContext !== true) return;
	if (args.length > 1) {
		console.log(...args);
	} else if (typeof args[0] === "string") {
		console.log(`%c${args[0]}`, css);
	} else {
		console.log(...args);
	}
}
