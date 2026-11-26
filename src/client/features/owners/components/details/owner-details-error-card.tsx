import { cn } from "cn";
import {
	AlertTriangle,
	ChevronDown,
	LogIn,
	RefreshCw,
	ShieldAlert,
	Undo2,
	WifiOff,
} from "lucide-react";
import { useOwnerDetailsError } from "#/client/features/owners/hooks/use-owner-details-error";
import { GhostBadge } from "#/client/shared/components/app-badge";
import {
	AppCard,
	AppCardAction,
	AppCardContent,
	AppCardHeader,
	AppCardTitle,
} from "#/client/shared/components/app-card";
import { AppButtonLink } from "#/client/shared/components/app-link";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "#/client/shared/shadcn/components/ui/alert";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "#/client/shared/shadcn/components/ui/collapsible";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "#/client/shared/shadcn/components/ui/empty";

export function OwnerDetailsErrorCard() {
	const {
		presentation,
		isDetailsOpen,
		setIsDetailsOpen,
		isRetrying,
		retryLoadOwner,
	} = useOwnerDetailsError();

	const StatusIcon =
		presentation.kind === "upstream"
			? WifiOff
			: presentation.kind === "unauthorized" ||
					presentation.kind === "forbidden"
				? ShieldAlert
				: AlertTriangle;

	return (
		<AppCard className="col-span-full">
			<AppCardHeader>
				<AppCardTitle>
					<AlertTriangle
						className="size-4 text-destructive"
						aria-hidden="true"
					/>
					<span>สถานะการโหลดข้อมูล</span>
				</AppCardTitle>
				<AppCardAction>
					<GhostBadge className="font-mono">
						{presentation.technicalCode ?? "ERROR"}
					</GhostBadge>
				</AppCardAction>
			</AppCardHeader>
			<AppCardContent className="gap-6">
				<Empty className="py-8">
					<EmptyHeader className="max-w-lg">
						<EmptyMedia variant="icon">
							<StatusIcon aria-hidden="true" />
						</EmptyMedia>
						<EmptyTitle>{presentation.title}</EmptyTitle>
						<EmptyDescription className="leading-relaxed text-pretty">
							{presentation.description}
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent className="max-w-lg">
						<div className="flex flex-wrap items-center justify-center gap-3">
							{presentation.requiresSignIn ? (
								<AppButtonLink to="/sign-in" className="min-h-11 sm:min-h-9">
									<LogIn data-icon="inline-start" aria-hidden="true" />
									<span>เข้าสู่ระบบใหม่</span>
								</AppButtonLink>
							) : (
								<Button
									type="button"
									className="min-h-11 sm:min-h-9"
									disabled={isRetrying}
									onClick={() => void retryLoadOwner()}
								>
									<RefreshCw
										data-icon="inline-start"
										className={cn(
											isRetrying && "animate-spin motion-reduce:animate-none",
										)}
										aria-hidden="true"
									/>
									<span>
										{isRetrying ? "กำลังลองโหลดใหม่..." : "ลองโหลดข้อมูลใหม่"}
									</span>
								</Button>
							)}

							<AppButtonLink
								to="/owners"
								variant="outline"
								className="min-h-11 sm:min-h-9"
							>
								<Undo2 data-icon="inline-start" aria-hidden="true" />
								<span>กลับไปหน้ารายชื่อเจ้าของ</span>
							</AppButtonLink>

							{presentation.requiresSignIn ? (
								<Button
									type="button"
									variant="ghost"
									className="min-h-11 sm:min-h-9"
									disabled={isRetrying}
									onClick={() => void retryLoadOwner()}
								>
									<RefreshCw
										data-icon="inline-start"
										className={cn(
											isRetrying && "animate-spin motion-reduce:animate-none",
										)}
										aria-hidden="true"
									/>
									<span>
										{isRetrying ? "กำลังลองโหลดใหม่..." : "ลองโหลดข้อมูลใหม่"}
									</span>
								</Button>
							) : null}
						</div>

						<Collapsible
							open={isDetailsOpen}
							onOpenChange={setIsDetailsOpen}
							className="w-full pt-2"
						>
							<CollapsibleTrigger
								render={
									<Button
										type="button"
										variant="ghost"
										size="xs"
										className="text-muted-foreground"
									/>
								}
							>
								<span>
									{isDetailsOpen
										? "ซ่อนรายละเอียดทางเทคนิค"
										: "ดูรายละเอียดทางเทคนิค"}
								</span>
								<ChevronDown
									className={cn(
										"size-3.5 transition-transform duration-150 motion-reduce:transition-none",
										isDetailsOpen && "rotate-180",
									)}
									aria-hidden="true"
								/>
							</CollapsibleTrigger>
							<CollapsibleContent className="pt-3 text-left">
								<Alert variant="destructive">
									<AlertTriangle className="size-4" aria-hidden="true" />
									<AlertTitle className="text-xs font-medium">
										ข้อมูลทางเทคนิคสำหรับการตรวจสอบ
									</AlertTitle>
									<AlertDescription className="font-mono text-xs break-words">
										{presentation.technicalMessage}
									</AlertDescription>
								</Alert>
							</CollapsibleContent>
						</Collapsible>
					</EmptyContent>
				</Empty>
			</AppCardContent>
		</AppCard>
	);
}
