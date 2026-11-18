import { Check, Pencil, ShieldAlert, ShieldCheck, X } from "lucide-react";
import { SuccessBadge, WarningBadge } from "#/client/shared/components/app-badge";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "#/client/shared/shadcn/components/ui/popover";
import { Separator } from "#/client/shared/shadcn/components/ui/separator";
import { useOwnerPdpaPopover } from "#/client/features/reception/owners/hooks/use-owner-pdpa-popover";

export function OwnerPdpaPopover() {
  const { isOpen, setIsOpen, displayName, pdpa, handleEditConsent } = useOwnerPdpaPopover();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="h-auto rounded-full p-0 hover:bg-transparent aria-expanded:bg-transparent"
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
            <li key={item.key} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-foreground">
                {item.granted ? (
                  <Check className="size-3.5 text-primary" aria-hidden="true" />
                ) : (
                  <X className="size-3.5 text-muted-foreground" aria-hidden="true" />
                )}
                <span>{item.label}</span>
              </span>
              <span
                className={item.granted ? "font-medium text-foreground" : "text-muted-foreground"}
              >
                {item.granted ? "Granted" : "Declined"}
              </span>
            </li>
          ))}
        </ul>
        <Separator />
        <Button
          type="button"
          size="xs"
          variant="outline"
          className="w-full"
          onClick={handleEditConsent}
        >
          <Pencil data-icon="inline-start" aria-hidden="true" />
          <span>Edit Consent</span>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
