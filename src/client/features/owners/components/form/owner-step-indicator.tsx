import { cn } from "cn";
import {
	CheckIcon,
	ChevronRightIcon,
	MapPinIcon,
	ShieldCheckIcon,
	UserRoundIcon,
} from "lucide-react";
import { Fragment } from "react";
import { useOwnerFormShell } from "#/client/features/owners/hooks/use-owner-form-shell";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "#/client/shared/shadcn/components/ui/breadcrumb";

const OWNER_FORM_STEPS = [
	{
		step: 1,
		label: "ข้อมูลส่วนตัวและติดต่อ",
		description: "ชื่อ-สกุล เลขภาษี และเบอร์โทร",
		icon: UserRoundIcon,
	},
	{
		step: 2,
		label: "ที่อยู่",
		description: "ที่อยู่ปัจจุบันและใบเสร็จ",
		icon: MapPinIcon,
	},
	{
		step: 3,
		label: "ช่องทางรู้จักและ PDPA",
		description: "ช่องทางรับทราบและความยินยอม",
		icon: ShieldCheckIcon,
	},
] as const;

export function OwnerStepIndicator() {
	const { currentStep, goToStep, isEdit } = useOwnerFormShell();

	return (
		<Breadcrumb aria-label="ขั้นตอนการกรอกข้อมูลเจ้าของสัตว์เลี้ยง" className="w-full">
			<BreadcrumbList className="flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-evenly md:gap-2">
				{OWNER_FORM_STEPS.map((item, index) => {
					const isDone = currentStep > item.step;
					const isCurrent = currentStep === item.step;
					const isClickable = isEdit || isDone;
					const StepIcon = item.icon;

					return (
						<Fragment key={item.step}>
							<BreadcrumbItem className="min-w-0">
								<button
									type="button"
									onClick={() => isClickable && goToStep(item.step)}
									disabled={!isClickable}
									aria-current={isCurrent ? "step" : undefined}
									className={cn(
										"flex items-center gap-2.5 text-left transition-opacity",
										isClickable
											? "cursor-pointer hover:opacity-80"
											: "cursor-default",
									)}
								>
									<span
										className={cn(
											"flex size-8.5 shrink-0 items-center justify-center rounded-full transition-colors sm:size-9",
											isCurrent
												? "bg-primary text-primary-foreground shadow-xs"
												: isDone
													? "bg-primary/15 text-primary"
													: "bg-muted text-muted-foreground",
										)}
									>
										{isDone ? (
											<CheckIcon className="size-4" aria-hidden="true" />
										) : (
											<StepIcon className="size-4" aria-hidden="true" />
										)}
									</span>

									<div className="flex min-w-0 flex-col">
										<span
											className={cn(
												"truncate text-xs transition-colors",
												isCurrent
													? "font-semibold text-foreground"
													: isDone
														? "font-medium text-foreground"
														: "text-muted-foreground",
											)}
										>
											{item.label}
										</span>
										<span className="truncate text-[11px] leading-tight text-muted-foreground">
											{item.description}
										</span>
									</div>
								</button>
							</BreadcrumbItem>

							{index < OWNER_FORM_STEPS.length - 1 ? (
								<BreadcrumbSeparator className="flex items-center text-muted-foreground/60">
									<ChevronRightIcon
										className="hidden md:block"
										aria-hidden="true"
									/>
									<div
										className={cn(
											"ml-4 block h-3.5 w-0.5 rounded-full transition-colors md:hidden",
											isDone ? "bg-primary/40" : "bg-muted",
										)}
										aria-hidden="true"
									/>
								</BreadcrumbSeparator>
							) : null}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
