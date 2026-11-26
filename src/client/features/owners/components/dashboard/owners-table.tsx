import { Building2, Check, Copy, MapPin, PawPrint } from "lucide-react";
import { OwnerRowProvider } from "#/client/features/owners/contexts/owner-row.context";
import { useOwnersTable } from "#/client/features/owners/hooks/use-owners-table";
import { AppDataTable } from "#/client/shared/components/app-data-table";
import {
	Avatar,
	AvatarFallback,
} from "#/client/shared/shadcn/components/ui/avatar";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "#/client/shared/shadcn/components/ui/popover";
import { OwnerPdpaPopover } from "./owner-pdpa-popover";
import { OwnerRowActions } from "./owner-row-actions";
import { OwnersTableEmpty } from "./owners-table-empty";

export function OwnersTable() {
	const {
		table,
		isPending,
		isFetchingPlaceholder,
		getRowPresentation,
		copyPhone,
		isPhoneCopied,
		copyTaxId,
		isTaxIdCopied,
	} = useOwnersTable();

	return (
		<AppDataTable
			table={table}
			isLoading={isPending}
			isFetchingPlaceholder={isFetchingPlaceholder}
			itemLabel="รายการ"
			emptyState={<OwnersTableEmpty />}
			renderCell={(cell) => {
				const owner = cell.row.original;
				const rowView = getRowPresentation(owner);

				if (cell.column.id === "owner") {
					return (
						<div className="flex items-center gap-3">
							<Avatar className="size-9 shrink-0">
								<AvatarFallback className="text-xs font-medium">
									{rowView.isJuristic ? (
										<Building2
											className="size-4 text-muted-foreground"
											aria-hidden="true"
										/>
									) : (
										rowView.initials
									)}
								</AvatarFallback>
							</Avatar>
							<div className="flex min-w-0 flex-col gap-0.5">
								<div className="flex items-center gap-1.5">
									<span className="truncate font-medium text-foreground">
										{rowView.displayName}
									</span>
								</div>
								<span className="font-mono text-xs text-muted-foreground">
									{owner.ownerCode}
								</span>
							</div>
						</div>
					);
				}

				if (cell.column.id === "contact") {
					const phoneCopied = isPhoneCopied(owner.ownerId);
					return (
						<div className="flex flex-col gap-0.5">
							<div className="flex items-center gap-1">
								<span className="text-base text-foreground">
									{rowView.formattedPhone}
								</span>
								<Button
									type="button"
									size="icon-xs"
									variant="ghost"
									aria-label={`คัดลอกเบอร์โทรศัพท์ของ ${rowView.displayName}`}
									onClick={() =>
										void copyPhone(owner.ownerId, owner.phoneNumber)
									}
								>
									{phoneCopied ? (
										<Check className="text-primary" aria-hidden="true" />
									) : (
										<Copy aria-hidden="true" />
									)}
								</Button>
							</div>
						</div>
					);
				}

				if (cell.column.id === "pets") {
					return (
						<Badge variant="secondary" className="text-muted-foreground">
							<PawPrint data-icon="inline-start" aria-hidden="true" />
							<span>รอเชื่อม API</span>
						</Badge>
					);
				}

				if (cell.column.id === "pdpaConsent") {
					return (
						<OwnerRowProvider owner={owner}>
							<OwnerPdpaPopover />
						</OwnerRowProvider>
					);
				}

				if (cell.column.id === "taxId") {
					const taxIdCopied = isTaxIdCopied(owner.ownerId);
					return (
						<div className="flex items-center gap-1">
							<span className="font-mono text-xs text-foreground">
								{rowView.formattedTaxId}
							</span>
							{rowView.canCopyFullTaxId ? (
								<Button
									type="button"
									size="icon-xs"
									variant="ghost"
									aria-label={`คัดลอกเลขประจำตัวผู้เสียภาษีของ ${rowView.displayName}`}
									onClick={() => void copyTaxId(owner.ownerId, owner.taxId)}
								>
									{taxIdCopied ? (
										<Check className="text-primary" aria-hidden="true" />
									) : (
										<Copy aria-hidden="true" />
									)}
								</Button>
							) : null}
						</div>
					);
				}

				if (cell.column.id === "additionalContacts") {
					return rowView.hasAdditionalContact ? (
						<div className="flex max-w-48 flex-col gap-0.5 text-xs">
							{owner.lineId ? (
								<span className="truncate text-muted-foreground">
									LINE: {owner.lineId}
								</span>
							) : null}
							{owner.email ? (
								<span className="truncate text-muted-foreground">
									{owner.email}
								</span>
							) : null}
						</div>
					) : (
						<span className="text-xs text-muted-foreground">—</span>
					);
				}

				if (cell.column.id === "address") {
					return rowView.addressAreaLabel ? (
						<Popover>
							<PopoverTrigger
								render={
									<Button
										type="button"
										variant="ghost"
										size="xs"
										className="h-auto max-w-44 justify-start px-1.5 py-0.5 text-left font-normal"
										aria-label={`ดูที่อยู่เต็มของ ${rowView.displayName}`}
									/>
								}
							>
								<MapPin data-icon="inline-start" aria-hidden="true" />
								<span className="truncate text-xs text-foreground">
									{rowView.addressAreaLabel}
								</span>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-80">
								<PopoverHeader>
									<PopoverTitle className="text-sm">
										ที่อยู่หลัก — {rowView.displayName}
									</PopoverTitle>
									<PopoverDescription className="text-xs whitespace-pre-wrap text-foreground">
										{rowView.fullAddressLabel}
									</PopoverDescription>
								</PopoverHeader>
							</PopoverContent>
						</Popover>
					) : (
						<span className="text-xs text-muted-foreground">—</span>
					);
				}

				if (cell.column.id === "acquisitionChannel") {
					return (
						<span className="text-xs text-muted-foreground">
							{rowView.acquisitionChannelLabel}
						</span>
					);
				}

				if (cell.column.id === "createdAt") {
					return (
						<span className="text-xs text-muted-foreground">
							{rowView.createdAtLabel}
						</span>
					);
				}

				if (cell.column.id === "actions") {
					return (
						<OwnerRowProvider owner={owner}>
							<OwnerRowActions />
						</OwnerRowProvider>
					);
				}

				return <table.FlexRender cell={cell} />;
			}}
		/>
	);
}
