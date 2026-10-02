export const calculateCanvasSize = () => {
	const width = window.innerWidth;
	const height = window.innerHeight;

	return { width, height };
};

export const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
