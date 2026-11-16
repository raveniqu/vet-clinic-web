import {
  Archive,
  Building2,
  Check,
  Copy,
  EllipsisVertical,
  Eye,
  MapPin,
  PawPrint,
  Pencil,
  ShieldAlert,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
import { cn } from "cn";

import { useOwnersTable } from "#/client/features/reception/owners/hooks/use-owners-table";
import {
  formatAddressArea,
  formatFullAddress,
  formatOwnerRegisteredDate,
  formatPreferredChannelDetail,
  getOwnerDisplayName,
  getOwnerInitials,
  getPdpaConsentSummary,
  hasNonEmptyText,
} from "#/client/features/reception/owners/models/owners-table";
import { SuccessBadge, WarningBadge } from "#/client/shared/components/app-badge";
import { AppCard, AppCardContent, AppCardFooter } from "#/client/shared/components/app-card";
import { AppPagination } from "#/client/shared/components/app-pagination";
import { AppSpeciesIcon } from "#/client/shared/components/app-species-icon";
import { formatPhoneNumber, formatTaxId } from "#/client/shared/helpers/formatters";
import { Avatar, AvatarFallback } from "#/client/shared/shadcn/components/ui/avatar";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/client/shared/shadcn/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/client/shared/shadcn/components/ui/empty";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "#/client/shared/shadcn/components/ui/popover";
import { Separator } from "#/client/shared/shadcn/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/client/shared/shadcn/components/ui/table";
import { AppRowsPerPageSelector } from "#/client/shared/components/app-rows-per-page-selector";
import { AppButtonLink } from "#/client/shared/components/app-link";

export function MainTable() {
  const {
    paginatedOwners,
    pagination,
    totalCount,
    isEmptyDataset,
    hasActiveFilter,
    clearFilters,
    hasColumn,
    visibleColSpan,
    petsByOwnerId,
    speciesCodeById,
    copyPhone,
    isPhoneCopied,
    copyTaxId,
    isTaxIdCopied,
    openPdpaPopoverOwnerId,
    onPdpaPopoverOpenChange,
    openEditConsent,
    setEditingOwner,
  } = useOwnersTable();

  return (
    <AppCard>
      <AppCardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-52">Owner</TableHead>
              {hasColumn("contact") ? <TableHead className="min-w-44">Contact</TableHead> : null}
              {hasColumn("pets") ? <TableHead>Pets</TableHead> : null}
              {hasColumn("pdpaConsent") ? (
                <TableHead className="min-w-36">PDPA Consent</TableHead>
              ) : null}
              {hasColumn("taxId") ? <TableHead className="min-w-44">Tax ID</TableHead> : null}
              {hasColumn("additionalContacts") ? (
                <TableHead className="min-w-48">Additional Contacts</TableHead>
              ) : null}
              {hasColumn("address") ? <TableHead className="min-w-44">Address</TableHead> : null}
              {hasColumn("preferredSchedule") ? (
                <TableHead className="min-w-36">Pref. Time &amp; Lang</TableHead>
              ) : null}
              {hasColumn("referralSource") ? (
                <TableHead className="min-w-36">Referral Source</TableHead>
              ) : null}
              {hasColumn("createdAt") ? <TableHead>Registered</TableHead> : null}
              <TableHead className="sticky right-0 z-10 w-0 p-0 pointer-coarse:w-auto pointer-coarse:px-3">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOwners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColSpan} className="p-0">
                  <Empty className="py-10">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <UsersRound aria-hidden="true" />
                      </EmptyMedia>
                      <EmptyTitle>
                        {isEmptyDataset
                          ? "No owners registered yet"
                          : "No owners match your filters"}
                      </EmptyTitle>
                      <EmptyDescription>
                        {isEmptyDataset
                          ? "Register a new pet owner from the button above to get started."
                          : "Try adjusting your search term or quick filters."}
                      </EmptyDescription>
                    </EmptyHeader>
                    {hasActiveFilter ? (
                      <EmptyContent>
                        <Button type="button" size="sm" variant="outline" onClick={clearFilters}>
                          Clear all filters
                        </Button>
                      </EmptyContent>
                    ) : null}
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              paginatedOwners.map((owner) => {
                const displayName = getOwnerDisplayName(owner);
                const pets = petsByOwnerId.get(owner.id) ?? [];
                const pdpa = getPdpaConsentSummary(owner);
                const phoneCopied = isPhoneCopied(owner.id);
                const taxIdCopied = isTaxIdCopied(owner.id);
                const areaLabel = formatAddressArea(owner);
                const hasAdditionalContact =
                  hasNonEmptyText(owner.phoneSecondary) ||
                  hasNonEmptyText(owner.lineId) ||
                  hasNonEmptyText(owner.email);

                return (
                  <TableRow key={owner.id} className="group/row">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 shrink-0">
                          <AvatarFallback className="text-xs font-medium">
                            {owner.customerType === "JURISTIC" ? (
                              <Building2
                                className="size-4 text-muted-foreground"
                                aria-hidden="true"
                              />
                            ) : (
                              getOwnerInitials(owner)
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-medium text-foreground">
                              {displayName}
                            </span>
                            {owner.customerType === "JURISTIC" ? (
                              <Badge variant="outline">Juristic</Badge>
                            ) : null}
                          </div>
                          <span className="font-mono text-xs text-muted-foreground">
                            {owner.customerCode}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {hasColumn("contact") ? (
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs text-foreground">
                              {formatPhoneNumber(owner.phonePrimary)}
                            </span>
                            <Button
                              type="button"
                              size="icon-xs"
                              variant="ghost"
                              aria-label={`Copy phone number for ${displayName}`}
                              onClick={() => void copyPhone(owner.id, owner.phonePrimary)}
                            >
                              {phoneCopied ? (
                                <Check className="text-primary" aria-hidden="true" />
                              ) : (
                                <Copy aria-hidden="true" />
                              )}
                            </Button>
                          </div>
                          <span className="truncate text-xs text-muted-foreground">
                            {formatPreferredChannelDetail(owner)}
                          </span>
                        </div>
                      </TableCell>
                    ) : null}

                    {hasColumn("pets") ? (
                      <TableCell>
                        {pets.length === 0 ? (
                          <span className="text-xs text-muted-foreground">No pets</span>
                        ) : (
                          <Popover>
                            <PopoverTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="xs"
                                  className="h-auto rounded-full p-0 hover:bg-transparent"
                                  aria-label={`Inspect ${pets.length} registered pets for ${displayName}`}
                                />
                              }
                            >
                              <Badge variant="secondary" className="">
                                <PawPrint
                                  data-icon="inline-start"
                                  className="text-primary"
                                  aria-hidden="true"
                                />
                                <span>
                                  {pets.length} {pets.length === 1 ? "Pet" : "Pets"}
                                </span>
                              </Badge>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="w-72 gap-3">
                              <PopoverHeader>
                                <PopoverTitle className="text-sm">
                                  Registered Pets — {displayName}
                                </PopoverTitle>
                                <PopoverDescription className="text-xs">
                                  {pets.length} {pets.length === 1 ? "pet" : "pets"} under care
                                </PopoverDescription>
                              </PopoverHeader>
                              <Separator />
                              <ul className="flex flex-col gap-2">
                                {pets.map((pet) => (
                                  <li
                                    key={pet.id}
                                    className="flex items-center justify-between gap-2 text-xs"
                                  >
                                    <div className="flex min-w-0 items-center gap-2">
                                      <AppSpeciesIcon
                                        code={speciesCodeById.get(pet.speciesId)}
                                        className="size-4 shrink-0 text-primary"
                                      />
                                      <div className="flex min-w-0 flex-col">
                                        <span className="truncate font-medium text-foreground">
                                          {pet.petName}
                                        </span>
                                        <span className="truncate text-muted-foreground">
                                          {pet.breedName}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="shrink-0 font-mono text-muted-foreground">
                                      {pet.petCode}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </PopoverContent>
                          </Popover>
                        )}
                      </TableCell>
                    ) : null}

                    {hasColumn("pdpaConsent") ? (
                      <TableCell>
                        <Popover
                          open={openPdpaPopoverOwnerId === owner.id}
                          onOpenChange={(open) => onPdpaPopoverOpenChange(owner.id, open)}
                        >
                          <PopoverTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                className="h-auto rounded-full p-0 hover:bg-transparent"
                                aria-label={`Inspect PDPA consent details for ${displayName}`}
                              />
                            }
                          >
                            {pdpa.isFullConsent ? (
                              <SuccessBadge>
                                <ShieldCheck data-icon="inline-start" aria-hidden="true" />
                                <span>{pdpa.badgeLabel}</span>
                              </SuccessBadge>
                            ) : (
                              <WarningBadge>
                                <ShieldAlert data-icon="inline-start" aria-hidden="true" />
                                <span>{pdpa.badgeLabel}</span>
                              </WarningBadge>
                            )}
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-72 gap-3">
                            <PopoverHeader>
                              <PopoverTitle className="text-sm">PDPA Consent Status</PopoverTitle>
                              <PopoverDescription className="text-xs">
                                {pdpa.grantedCount} of {pdpa.totalCount} permissions granted
                              </PopoverDescription>
                            </PopoverHeader>
                            <Separator />
                            <ul className="flex flex-col gap-2 text-xs">
                              {pdpa.items.map((item) => (
                                <li
                                  key={item.key}
                                  className="flex items-center justify-between gap-2"
                                >
                                  <span className="flex items-center gap-2 text-foreground">
                                    {item.granted ? (
                                      <Check className="size-3.5 text-primary" aria-hidden="true" />
                                    ) : (
                                      <X
                                        className="size-3.5 text-muted-foreground"
                                        aria-hidden="true"
                                      />
                                    )}
                                    <span>{item.label}</span>
                                  </span>
                                  <span
                                    className={
                                      item.granted
                                        ? "font-medium text-foreground"
                                        : "text-muted-foreground"
                                    }
                                  >
                                    {item.granted ? "Granted" : "Declined"}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <Separator />
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="w-full"
                              onClick={() => openEditConsent(owner)}
                            >
                              <Pencil data-icon="inline-start" aria-hidden="true" />
                              <span>Edit Consent</span>
                            </Button>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    ) : null}

                    {hasColumn("taxId") ? (
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs text-foreground">
                            {formatTaxId(owner.taxId)}
                          </span>
                          <Button
                            type="button"
                            size="icon-xs"
                            variant="ghost"
                            aria-label={`Copy Tax ID for ${displayName}`}
                            onClick={() => void copyTaxId(owner.id, owner.taxId)}
                          >
                            {taxIdCopied ? (
                              <Check className="text-primary" aria-hidden="true" />
                            ) : (
                              <Copy aria-hidden="true" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    ) : null}

                    {hasColumn("additionalContacts") ? (
                      <TableCell>
                        {hasAdditionalContact ? (
                          <div className="flex max-w-48 flex-col gap-0.5 text-xs">
                            {hasNonEmptyText(owner.phoneSecondary) ? (
                              <span className="truncate font-mono text-foreground">
                                2nd: {formatPhoneNumber(owner.phoneSecondary)}
                              </span>
                            ) : null}
                            {hasNonEmptyText(owner.lineId) ? (
                              <span className="truncate text-muted-foreground">
                                LINE: {owner.lineId}
                              </span>
                            ) : null}
                            {hasNonEmptyText(owner.email) ? (
                              <span className="truncate text-muted-foreground">{owner.email}</span>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    ) : null}

                    {hasColumn("address") ? (
                      <TableCell>
                        {areaLabel ? (
                          <Popover>
                            <PopoverTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="xs"
                                  className="h-auto max-w-44 justify-start px-1.5 py-0.5 text-left font-normal"
                                  aria-label={`Read full address for ${displayName}`}
                                />
                              }
                            >
                              <MapPin data-icon="inline-start" aria-hidden="true" />
                              <span className="truncate text-xs text-foreground">{areaLabel}</span>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="w-80">
                              <PopoverHeader>
                                <PopoverTitle className="text-sm">
                                  Registered Address — {displayName}
                                </PopoverTitle>
                                <PopoverDescription className="text-xs whitespace-pre-wrap text-foreground">
                                  {formatFullAddress(owner)}
                                </PopoverDescription>
                              </PopoverHeader>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    ) : null}

                    {hasColumn("preferredSchedule") ? (
                      <TableCell className="text-xs text-foreground">
                        {owner.preferredTime} · {owner.preferredLanguage}
                      </TableCell>
                    ) : null}

                    {hasColumn("referralSource") ? (
                      <TableCell className="text-xs text-muted-foreground">
                        {owner.referralSource}
                      </TableCell>
                    ) : null}

                    {hasColumn("createdAt") ? (
                      <TableCell className="text-xs text-muted-foreground">
                        {formatOwnerRegisteredDate(owner.createdAt)}
                      </TableCell>
                    ) : null}

                    <TableCell className="sticky right-0 z-10 w-0 p-0 text-right align-middle pointer-coarse:w-auto pointer-coarse:px-3">
                      <div className="relative flex items-center justify-end">
                        <div
                          className={cn(
                            "pointer-events-none absolute right-3 flex translate-x-1 items-center gap-1 rounded-full p-1 opacity-0 shadow-md/10 inset-shadow-sm/5 backdrop-blur-xs transition duration-150 ease-out motion-reduce:transition-none",
                            "group-hover/row:pointer-events-auto group-hover/row:translate-x-0 group-hover/row:opacity-100",
                            "group-focus-within/row:pointer-events-auto group-focus-within/row:translate-x-0 group-focus-within/row:opacity-100 dark:ring-1 dark:ring-border",
                            "group-has-[[data-slot=dropdown-menu-trigger][aria-expanded=true]]/row:pointer-events-auto group-has-[[data-slot=dropdown-menu-trigger][aria-expanded=true]]/row:translate-x-0 group-has-[[data-slot=dropdown-menu-trigger][aria-expanded=true]]/row:opacity-100",
                            "pointer-coarse:pointer-events-auto pointer-coarse:static pointer-coarse:translate-x-0 pointer-coarse:bg-transparent pointer-coarse:p-0.5 pointer-coarse:opacity-100 pointer-coarse:shadow-sm pointer-coarse:backdrop-blur-xs"
                          )}
                        >
                          <AppButtonLink
                            to="/owners/$ownerId"
                            params={{ ownerId: String(owner.id) }}
                            type="button"
                            size="xs"
                            variant="secondary"
                          >
                            <Eye data-icon="inline-start" aria-hidden="true" />
                            <span>View Profile</span>
                          </AppButtonLink>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  type="button"
                                  size="icon-xs"
                                  variant="ghost"
                                  aria-label={`More actions for ${displayName}`}
                                />
                              }
                            >
                              <EllipsisVertical aria-hidden="true" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => setEditingOwner(owner)}>
                                  <Pencil aria-hidden="true" />
                                  <span>Edit Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => void copyPhone(owner.id, owner.phonePrimary)}
                                >
                                  <Copy aria-hidden="true" />
                                  <span>{phoneCopied ? "Phone Copied" : "Copy Phone"}</span>
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                <DropdownMenuItem className="text-amber-600 dark:text-amber-400">
                                  <Archive aria-hidden="true" />
                                  <span>Archive</span>
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </AppCardContent>

      {totalCount > 0 ? (
        <AppCardFooter className="flex-wrap gap-3 py-3">
          <AppRowsPerPageSelector pagination={pagination} itemLabel="owners" />

          <AppPagination
            className="ml-auto"
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            canGoPrevious={pagination.canGoPrevious}
            canGoNext={pagination.canGoNext}
            onPageChange={pagination.goToPage}
            goToPreviousPage={pagination.goToPreviousPage}
            goToNextPage={pagination.goToNextPage}
          />
        </AppCardFooter>
      ) : null}
    </AppCard>
  );
}
