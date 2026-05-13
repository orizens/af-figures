interface RadioProps {
	name: string;
	value: string;
	checked: boolean;
	onChange: () => void;
	ariaLabel: string;
	children: React.ReactNode;
}

export function Radio({ name, value, checked, onChange, ariaLabel, children }: RadioProps): React.ReactElement {
	const activeClass = checked ? "opacity-100 ring-1 ring-primary rounded" : "opacity-60 hover:opacity-100";
	return (
		<label className={`flex items-center gap-2 cursor-pointer rounded-base px-2 py-1 transition-opacity ${activeClass}`}>
			<input
				type="radio"
				name={name}
				value={value}
				checked={checked}
				onChange={onChange}
				aria-label={ariaLabel}
				className="accent-primary"
			/>
			{children}
		</label>
	);
}
