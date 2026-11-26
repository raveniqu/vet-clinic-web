import { cn } from "cn";
import {
	Building2,
	Check,
	Copy,
	Eye,
	PawPrint,
	Pencil,
	Phone,
	Trash2,
	UsersRound,
} from "lucide-react";
import { OwnerRowProvider } from "#/client/features/owners/contexts/owner-row.context";
import { useOwnersMobile } from "#/client/features/owners/hooks/use-owners-mobile";
import { AppButtonLink } from "#/client/shared/components/app-link";
import { AppPagination } from "#/client/shared/components/app-pagination";
import {
	Avatar,
	AvatarFallback,
} from "#/client/shared/shadcn/components/ui/avatar";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/client/shared/shadcn/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "#/client/shared/shadcn/components/ui/empty";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "#/client/shared/shadcn/components/ui/item";
import { Skeleton } from "#/client/shared/shadcn/components/ui/skeleton";
import { OwnerPdpaPopover } from "./owner-pdpa-popover";

export function MobileView() {
	const {
		cards,
		currentPage,
		totalPages,
		totalItems,
		canGoPrevious,
		canGoNext,
		goToPage,
		goToPreviousPage,
		goToNextPage,
		isPending,
		isPlaceholderData,
		isEmptyDataset,
		hasActiveFilter,
		clearFilters,
		copyPhone,
		isPhoneCopied,
		openEditOwner,
		requestDeleteOwner,
	} = useOwnersMobile();

	if (isPending) {
		return (
			<div className="col-span-full flex flex-col gap-4">
				<Skeleton className="h-44 w-full rounded-2xl" />
				<Skeleton className="h-44 w-full rounded-2xl" />
				<Skeleton className="h-44 w-full rounded-2xl" />
			</div>
		);
	}

	if (cards.length === 0) {
		return (
			<Card className="col-span-full py-6">
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<UsersRound aria-hidden="true" />
						</EmptyMedia>
						<EmptyTitle>
							{isEmptyDataset
								? "ยังไม่มีข้อมูลเจ้าของสัตว์เลี้ยงในระบบ"
								: "ไม่พบข้อมูลเจ้าของสัตว์เลี้ยงที่ตรงกับตัวกรอง"}
						</EmptyTitle>
						<EmptyDescription>
							{isEmptyDataset
								? "เริ่มต้นด้วยการลงทะเบียนเจ้าของสัตว์เลี้ยงใหม่จากปุ่มด้านบน"
								: "ลองปรับคำค้นหา ประเภทลูกค้า หรือช่องทางที่รู้จักใหม่อีกครั้ง"}
						</EmptyDescription>
					</EmptyHeader>
					{hasActiveFilter ? (
						<EmptyContent>
							<Button
								type="button"
								variant="outline"
								className="min-h-11"
								onClick={clearFilters}
							>
								ล้างตัวกรองทั้งหมด
							</Button>
						</EmptyContent>
					) : null}
				</Empty>
			</Card>
		);
	}

	return (
		<div
			className={cn(
				"col-span-full flex flex-col gap-4",
				isPlaceholderData && "opacity-60 transition-opacity",
			)}
		>
			{cards.map((card) => {
				const phoneCopied = isPhoneCopied(card.ownerId);

				return (
					<Card key={card.ownerId} className="py-3">
						<CardHeader className="px-4.5">
							<div className="flex items-start gap-3">
								<Avatar className="size-9 shrink-0">
									<AvatarFallback className="text-xs font-medium">
										{card.isJuristic ? (
											<Building2
												className="size-4 text-muted-foreground"
												aria-hidden="true"
											/>
										) : (
											card.initials
										)}
									</AvatarFallback>
								</Avatar>
								<div className="flex min-w-0 flex-1 flex-col gap-1.5">
									<CardTitle className="flex flex-wrap items-center gap-1.5 text-base">
										<span>{card.displayName}</span>
										{card.isJuristic ? (
											<Badge variant="outline">นิติบุคคล</Badge>
										) : null}
									</CardTitle>
									<CardDescription className="flex flex-wrap items-center gap-2">
										<Badge variant="outline" className="font-mono text-xs">
											{card.ownerCode}
										</Badge>
										<Badge
											variant="outline"
											className="font-normal text-muted-foreground"
										>
											เลขผู้เสียภาษี: {card.formattedTaxId}
										</Badge>
									</CardDescription>
								</div>
							</div>
						</CardHeader>

						<CardContent className="flex flex-col gap-2.5 px-4">
							<Item className="p-2.5" variant="muted">
								<ItemContent>
									<ItemTitle className="flex flex-wrap items-center gap-2">
										<span className="flex items-center gap-1.5 font-mono text-sm">
											<Phone
												className="size-3.5 text-muted-foreground"
												aria-hidden="true"
											/>
											<span>{card.formattedPhone}</span>
										</span>
										<span className="text-xs font-normal text-muted-foreground">
											· {card.acquisitionChannelLabel}
										</span>
									</ItemTitle>
									<ItemDescription className="text-xs leading-relaxed">
										{card.fullAddressLabel}
									</ItemDescription>
								</ItemContent>
								<ItemActions>
									<Button
										type="button"
										size="icon"
										variant="ghost"
										className="min-h-11 min-w-11"
										aria-label={`คัดลอกเบอร์โทรศัพท์ของ ${card.displayName}`}
										onClick={() =>
											void copyPhone(card.ownerId, card.raw.phoneNumber)
										}
									>
										{phoneCopied ? (
											<Check className="text-primary" aria-hidden="true" />
										) : (
											<Copy aria-hidden="true" />
										)}
									</Button>
								</ItemActions>
							</Item>

							<div className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground">
								<PawPrint className="size-3.5" aria-hidden="true" />
								<span>ข้อมูลสัตว์เลี้ยง: รอเชื่อมต่อ API</span>
							</div>
						</CardContent>

						<CardFooter className="flex-wrap gap-2 px-4 pt-1">
							<OwnerRowProvider owner={card.raw}>
								<OwnerPdpaPopover />
							</OwnerRowProvider>

							<div className="ml-auto flex items-center gap-1.5">
								<Button
									type="button"
									size="icon-xs"
									variant="ghost"
									aria-label={`ลบข้อมูล ${card.displayName}`}
									onClick={() => requestDeleteOwner(card)}
								>
									<Trash2 className="text-destructive" aria-hidden="true" />
								</Button>
								<Button
									type="button"
									size="xs"
									variant="outline"
									onClick={() => openEditOwner(card.ownerId)}
								>
									<Pencil data-icon="inline-start" aria-hidden="true" />
									<span>แก้ไข</span>
								</Button>
								<AppButtonLink
									to="/owners/$ownerId"
									params={{ ownerId: String(card.ownerId) }}
									size="xs"
									variant="link"
								>
									<Eye data-icon="inline-start" aria-hidden="true" />
									<span>ดูประวัติ</span>
								</AppButtonLink>
							</div>
						</CardFooter>
					</Card>
				);
			})}

			<div className="flex flex-col items-center gap-2 pt-2">
				<span className="text-xs text-muted-foreground">
					ทั้งหมด {totalItems} รายการ
				</span>
				<AppPagination
					currentPage={currentPage}
					totalPages={totalPages}
					canGoPrevious={canGoPrevious}
					canGoNext={canGoNext}
					onPageChange={goToPage}
					goToPreviousPage={goToPreviousPage}
					goToNextPage={goToNextPage}
				/>
			</div>
		</div>
	);
}
