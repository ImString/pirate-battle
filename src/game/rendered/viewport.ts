export const getGameViewport = (width: number, height: number) => {
	const scale = Math.min(1, width / 1280, height / 720);
	return { width: width / scale, height: height / scale, scale };
};
