import { Plus } from "lucide-react";
import { usePetFormShell } from "#/client/features/pets/hooks/use-pet-form-shell";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";

export function AddNewPetTrigger() {
	const isMobile = useIsMobile();
	const { openCreate } = usePetFormShell();

	return (
		<Button
			type="button"
			size={isMobile ? "icon" : "default"}
			onClick={(event) => {
				event.currentTarget.blur();
				openCreate();
			}}
		>
			<Plus className="size-4" aria-hidden="true" />
			<span className="sr-only md:not-sr-only md:text-xs lg:text-sm">
				ลงทะเบียนสัตว์ใหม่
			</span>
		</Button>
	);
}
