import { ChatGptIcon } from "./ChatGptIcon";

export function AppHeader(): React.ReactElement {
	return (
		<header
			role="banner"
			className="relative border-b border-white/40 px-6 py-4 bg-white/60 backdrop-blur-md"
		>
			<div className="max-w-3xl mx-auto flex items-center gap-3">
				<ChatGptIcon className="size-6" />
				<h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-600 via-violet-500 to-pink-500 bg-clip-text text-transparent">
					ChatGPT Reviews
				</h1>
			</div>
		</header>
	);
}
