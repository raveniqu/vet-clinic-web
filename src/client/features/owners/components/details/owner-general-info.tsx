import {
	Check,
	ClipboardList,
	Home,
	Receipt,
	ShieldCheck,
	X,
} from "lucide-react";
import { useOwnerDetails } from "#/client/features/owners/hooks/use-owner-details";
import {
	InfoBadge,
	SuccessBadge,
	WarningBadge,
} from "#/client/shared/components/app-badge";
import {
	AppCard,
	AppCardAction,
	AppCardContent,
	AppCardHeader,
	AppCardTitle,
} from "#/client/shared/components/app-card";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemTitle,
} from "#/client/shared/shadcn/components/ui/item";

export function OwnerGeneralInfo() {
	const {
		owner,
		ownerTypeLabel,
		prefixLabel,
		genderLabel,
		acquisitionChannelLabel,
		formattedTaxId,
		formattedDob,
		formattedCreatedAt,
		formattedUpdatedAt,
		residentialFullAddress,
		billingFullAddress,
		isResidentialDefault,
		isBillingDefault,
		pdpaSummary,
	} = useOwnerDetails();

	return (
		<div className="flex flex-col gap-4 pt-4 lg:gap-6">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<AppCard>
					<AppCardHeader>
						<AppCardTitle>
							<Home className="size-4 text-primary" aria-hidden="true" />
							<span>ที่อยู่ปัจจุบัน</span>
						</AppCardTitle>
						{isResidentialDefault ? (
							<AppCardAction>
								<InfoBadge>ที่อยู่หลัก</InfoBadge>
							</AppCardAction>
						) : null}
					</AppCardHeader>
					<AppCardContent>
						<p className="text-sm leading-relaxed text-foreground">
							{residentialFullAddress}
						</p>
					</AppCardContent>
				</AppCard>

				<AppCard>
					<AppCardHeader>
						<AppCardTitle>
							<Receipt className="size-4 text-primary" aria-hidden="true" />
							<span>ที่อยู่สำหรับออกใบเสร็จ</span>
						</AppCardTitle>
						{isBillingDefault ? (
							<AppCardAction>
								<InfoBadge>ที่อยู่หลัก</InfoBadge>
							</AppCardAction>
						) : null}
					</AppCardHeader>
					<AppCardContent>
						<p className="text-sm leading-relaxed text-muted-foreground">
							{billingFullAddress ?? "ไม่ได้ระบุแยก (ใช้ที่อยู่ปัจจุบัน)"}
						</p>
					</AppCardContent>
				</AppCard>
			</div>

			<AppCard>
				<AppCardHeader>
					<AppCardTitle>
						<ClipboardList className="size-4 text-primary" aria-hidden="true" />
						<span>ข้อมูลเจ้าของสัตว์เลี้ยง</span>
					</AppCardTitle>
				</AppCardHeader>
				<AppCardContent>
					<ItemGroup className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
						<Item size="xs" className="p-0">
							<ItemContent>
								<ItemDescription className="text-xs">รหัสลูกค้า</ItemDescription>
								<ItemTitle className="font-mono">{owner.ownerCode}</ItemTitle>
							</ItemContent>
						</Item>
						<Item size="xs" className="p-0">
							<ItemContent>
								<ItemDescription className="text-xs">
									ประเภทลูกค้า
								</ItemDescription>
								<ItemTitle>{ownerTypeLabel}</ItemTitle>
							</ItemContent>
						</Item>
						<Item size="xs" className="p-0">
							<ItemContent>
								<ItemDescription className="text-xs">
									คำนำหน้า / ประเภทองค์กร
								</ItemDescription>
								<ItemTitle>{prefixLabel}</ItemTitle>
							</ItemContent>
						</Item>
						<Item size="xs" className="p-0">
							<ItemContent>
								<ItemDescription className="text-xs">
									เลขประจำตัวผู้เสียภาษี
								</ItemDescription>
								<ItemTitle className="font-mono">{formattedTaxId}</ItemTitle>
							</ItemContent>
						</Item>
						{owner.ownerType === "INDIVIDUAL" ? (
							<>
								<Item size="xs" className="p-0">
									<ItemContent>
										<ItemDescription className="text-xs">วันเกิด</ItemDescription>
										<ItemTitle>{formattedDob}</ItemTitle>
									</ItemContent>
								</Item>
								<Item size="xs" className="p-0">
									<ItemContent>
										<ItemDescription className="text-xs">เพศ</ItemDescription>
										<ItemTitle>{genderLabel}</ItemTitle>
									</ItemContent>
								</Item>
							</>
						) : null}
						<Item size="xs" className="p-0">
							<ItemContent>
								<ItemDescription className="text-xs">
									ช่องทางที่รู้จักคลินิก
								</ItemDescription>
								<ItemTitle>{acquisitionChannelLabel}</ItemTitle>
							</ItemContent>
						</Item>
						<Item size="xs" className="p-0">
							<ItemContent>
								<ItemDescription className="text-xs">LINE ID</ItemDescription>
								<ItemTitle>{owner.lineId || "—"}</ItemTitle>
							</ItemContent>
						</Item>
						<Item size="xs" className="p-0">
							<ItemContent>
								<ItemDescription className="text-xs">อีเมล</ItemDescription>
								<ItemTitle>{owner.email || "—"}</ItemTitle>
							</ItemContent>
						</Item>
						<Item size="xs" className="p-0">
							<ItemContent>
								<ItemDescription className="text-xs">
									วันที่ลงทะเบียน
								</ItemDescription>
								<ItemTitle>{formattedCreatedAt}</ItemTitle>
							</ItemContent>
						</Item>
						<Item size="xs" className="p-0">
							<ItemContent>
								<ItemDescription className="text-xs">
									แก้ไขข้อมูลล่าสุด
								</ItemDescription>
								<ItemTitle>{formattedUpdatedAt}</ItemTitle>
							</ItemContent>
						</Item>
					</ItemGroup>
				</AppCardContent>
			</AppCard>

			<AppCard>
				<AppCardHeader>
					<AppCardTitle>
						<ShieldCheck className="size-4 text-primary" aria-hidden="true" />
						<span>สถานะความยินยอม PDPA</span>
					</AppCardTitle>
					<AppCardAction>
						{pdpaSummary.isFullConsent ? (
							<SuccessBadge>{pdpaSummary.badgeLabel}</SuccessBadge>
						) : (
							<WarningBadge>{pdpaSummary.badgeLabel}</WarningBadge>
						)}
					</AppCardAction>
				</AppCardHeader>
				<AppCardContent>
					<ItemGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{pdpaSummary.items.map((item) => (
							<Item key={item.key} variant="outline" size="xs">
								<ItemContent className="flex flex-row items-center justify-between gap-2">
									<ItemDescription className="text-xs text-foreground">
										{item.label}
									</ItemDescription>
									<span className="flex items-center gap-1 text-xs font-medium">
										{item.granted ? (
											<>
												<Check
													className="size-3.5 text-primary"
													aria-hidden="true"
												/>
												<span>ยินยอม</span>
											</>
										) : (
											<>
												<X
													className="size-3.5 text-muted-foreground"
													aria-hidden="true"
												/>
												<span className="text-muted-foreground">ไม่ยินยอม</span>
											</>
										)}
									</span>
								</ItemContent>
							</Item>
						))}
					</ItemGroup>
				</AppCardContent>
			</AppCard>
		</div>
	);
}
