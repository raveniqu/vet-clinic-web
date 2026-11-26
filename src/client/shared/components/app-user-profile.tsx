import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "../shadcn/components/ui/avatar";

export function AppUserProfile({
	imageSrc,
	prefix = "คุณ",
	firstName,
	lastName,
	subText,
}: {
	imageSrc: string;
	prefix?: string;
	firstName: string;
	lastName: string;
	subText: string;
}) {
	return (
		<div className="flex flex-1 items-center gap-2">
			<Avatar>
				<AvatarImage
					src={imageSrc}
					alt={`รูปโปรไฟล์ของ ${prefix} ${firstName} ${lastName}`}
				/>
				<AvatarFallback>
					{firstName.charAt(0)}
					{lastName.charAt(0)}
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-1 flex-col text-left text-sm leading-tight">
				<p className="truncate text-sm font-medium">
					{prefix} {firstName} {lastName}
				</p>
				<small className="truncate text-xs text-muted-foreground">
					{subText}
				</small>
			</div>
		</div>
	);
}
