import { Loader2 } from "lucide-react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../shadcn/components/ui/alert-dialog";
import { Button } from "../shadcn/components/ui/button";

export interface AppConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	confirmLabel?: string;
	cancelLabel?: string;
	isPending?: boolean;
	variant?: "default" | "destructive";
	onConfirm: () => Promise<void> | void;
}

export function AppConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = "ยืนยัน",
	cancelLabel = "ยกเลิก",
	isPending = false,
	variant = "destructive",
	onConfirm,
}: AppConfirmDialogProps) {
	return (
		<AlertDialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (isPending && !nextOpen) return;
				onOpenChange(nextOpen);
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>
						{cancelLabel}
					</AlertDialogCancel>
					<Button
						type="button"
						variant={variant}
						disabled={isPending}
						onClick={() => void onConfirm()}
					>
						{isPending ? (
							<>
								<Loader2
									className="mr-1.5 size-4 animate-spin"
									aria-hidden="true"
								/>
								<span>กำลังดำเนินการ...</span>
							</>
						) : (
							confirmLabel
						)}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
