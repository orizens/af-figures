import { ChatGptIcon } from "./ChatGptIcon";

export function AppHeader(): React.ReactElement {
	return (
		<header
			role="banner"
			className="bg-surface border-b border-border px-6 py-4"
		>
			<div className="max-w-3xl mx-auto flex items-center gap-3">
				<ChatGptIcon className="size-6" />
				<h1 className="text-lg font-bold text-text tracking-tight">
					ChatGPT Reviews
				</h1>
			</div>
		</header>
	);
}
