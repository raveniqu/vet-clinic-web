import {
	Dot,
	Search,
	UserRoundCheck,
	UserRoundPlus,
	UsersRound,
} from "lucide-react";
import { usePetOwnerSelection } from "#/client/features/pets/hooks/use-pet-owner-selection";
import {
	AppFieldError,
	AppFieldLabel,
	AppFieldLegend,
	AppFieldSet,
} from "#/client/shared/components/app-field";
import { AppComboboxInput } from "#/client/shared/components/app-input-group";
import { formatPhoneNumber } from "#/client/shared/helpers/formatters";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
	Combobox,
	ComboboxCollection,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
} from "#/client/shared/shadcn/components/ui/combobox";
import { Field } from "#/client/shared/shadcn/components/ui/field";
import { InputGroupAddon } from "#/client/shared/shadcn/components/ui/input-group";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "#/client/shared/shadcn/components/ui/item";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import type { OwnerListItem } from "#/shared/schemas/owners.schema";

export function PetOwnerField() {
	const {
		owners,
		isLoadingOwners,
		isOwnersError,
		setSearchQuery,
		selectedOwner,
		selectedOwnerSummary,
		ownerError,
		handleSelectOwner,
		handleClearOwner,
		openNewOwnerModal,
		getOwnerLabel,
		isOwnerEqualToValue,
	} = usePetOwnerSelection();

	const isMobile = useIsMobile();

	return (
		<AppFieldSet>
			<AppFieldLegend>
				<UsersRound aria-hidden="true" />
				<span>ข้อมูลเจ้าของสัตว์เลี้ยง</span>
			</AppFieldLegend>

			<Field data-invalid={Boolean(ownerError)}>
				<AppFieldLabel htmlFor="pet-owner-search-input">
					<span>เลือกเจ้าของสัตว์เลี้ยง</span>
					<span className="font-bold text-destructive">*</span>
				</AppFieldLabel>

				{selectedOwnerSummary ? (
					<Item variant="outline" className="bg-primary/5">
						<ItemMedia
							variant="icon"
							className="size-8 rounded-full bg-primary/10 text-primary"
						>
							<UserRoundCheck aria-hidden="true" />
						</ItemMedia>
						<ItemContent className="gap-0">
							<ItemTitle>{selectedOwnerSummary.displayName}</ItemTitle>
							<ItemDescription className="text-xs">
								โทร: {formatPhoneNumber(selectedOwnerSummary.phoneNumber)}
								{selectedOwnerSummary.ownerCode
									? ` (${selectedOwnerSummary.ownerCode})`
									: ""}
							</ItemDescription>
						</ItemContent>
						<ItemActions>
							<Button
								type="button"
								variant="link"
								size="xs"
								onClick={handleClearOwner}
							>
								เปลี่ยน
							</Button>
						</ItemActions>
					</Item>
				) : (
					<div className="flex items-center gap-2">
						<Combobox<OwnerListItem>
							items={owners}
							value={selectedOwner}
							filter={null}
							onInputValueChange={setSearchQuery}
							onValueChange={handleSelectOwner}
							itemToStringLabel={getOwnerLabel}
							isItemEqualToValue={isOwnerEqualToValue}
						>
							<AppComboboxInput
								id="pet-owner-search-input"
								placeholder="ค้นหาเจ้าของจากชื่อ, เบอร์โทร หรือรหัสลูกค้า..."
								showClear
								showTrigger={false}
								className="flex-1 **:placeholder:text-sm"
								aria-invalid={Boolean(ownerError)}
							>
								<InputGroupAddon align="inline-start">
									<Search
										className="size-4 text-muted-foreground"
										aria-hidden="true"
									/>
								</InputGroupAddon>
							</AppComboboxInput>

							<ComboboxContent
								align="start"
								className="z-50 w-(--anchor-width) bg-popover/95 backdrop-blur-md"
							>
								<ComboboxList>
									<ComboboxEmpty className="py-6 text-center text-xs text-muted-foreground">
										{isLoadingOwners
											? "กำลังค้นหาข้อมูลเจ้าของสัตว์เลี้ยง..."
											: isOwnersError
												? "ไม่สามารถโหลดรายชื่อเจ้าของสัตว์เลี้ยงได้"
												: "ไม่พบข้อมูลเจ้าของสัตว์เลี้ยงในระบบ"}
									</ComboboxEmpty>
									<ComboboxCollection>
										{(owner: OwnerListItem) => (
											<ComboboxItem key={owner.ownerId} value={owner}>
												<div className="flex flex-col">
													<span className="font-medium text-foreground">
														{getOwnerLabel(owner)}
													</span>
													<span className="flex flex-col items-start text-xs text-muted-foreground sm:flex-row">
														<span>{formatPhoneNumber(owner.phoneNumber)}</span>
														<Dot
															className="hidden sm:block"
															aria-hidden="true"
														/>
														<span className="hidden sm:block">
															{owner.ownerCode}
														</span>
													</span>
												</div>
											</ComboboxItem>
										)}
									</ComboboxCollection>
								</ComboboxList>
							</ComboboxContent>
						</Combobox>

						<Button
							type="button"
							size={isMobile ? "icon" : "default"}
							variant="outline"
							onClick={openNewOwnerModal}
							className="shrink-0"
						>
							<UserRoundPlus className="size-4" aria-hidden="true" />
							<span className="sr-only md:not-sr-only">เจ้าของใหม่</span>
						</Button>
					</div>
				)}

				{ownerError ? <AppFieldError>{ownerError}</AppFieldError> : null}
			</Field>
		</AppFieldSet>
	);
}
