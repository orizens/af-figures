export function BackgroundBlobs(): React.ReactElement {
	return (
		<div
			className="fixed inset-0 overflow-hidden pointer-events-none"
			aria-hidden="true"
		>
			<div className="absolute -top-48 -left-48 w-[32rem] h-[32rem] rounded-full bg-blue-400/25 blur-[140px]" />
			<div className="absolute top-1/3 -right-48 w-[28rem] h-[28rem] rounded-full bg-violet-400/25 blur-[130px]" />
			<div className="absolute bottom-16 left-1/4 w-96 h-96 rounded-full bg-pink-400/20 blur-[120px]" />
			<div className="absolute top-2/3 left-1/2 w-72 h-72 rounded-full bg-sky-300/20 blur-[100px]" />
		</div>
	);
}
