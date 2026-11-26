import { UserRoundPlus } from "lucide-react";
import { useOwnerFormShell } from "#/client/features/owners/hooks/use-owner-form-shell";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";

export function AddNewOwnerTrigger() {
	const isMobile = useIsMobile();
	const { openCreate } = useOwnerFormShell();

	return (
		<Button
			type="button"
			size={isMobile ? "icon" : "default"}
			onClick={(event) => {
				event.currentTarget.blur();
				openCreate();
			}}
		>
			<UserRoundPlus className="size-4" aria-hidden="true" />
			<span className="sr-only md:not-sr-only md:text-xs lg:text-sm">
				เพิ่มเจ้าของใหม่
			</span>
		</Button>
	);
}
