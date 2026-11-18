import { Clock, ExternalLink, History } from "lucide-react";
import { Button } from "#/client/shared/shadcn/components/ui/button";

import {
  AppCard,
  AppCardAction,
  AppCardContent,
  AppCardDescription,
  AppCardHeader,
  AppCardTitle,
} from "#/client/shared/components/app-card";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "#/client/shared/shadcn/components/ui/item";
import { InfoBadge, SuccessBadge } from "#/client/shared/components/app-badge";

// Mock Recent Clinic Visits / Encounters
const recentVisits = [
  {
    id: 1,
    ownerName: "Emily Watson",
    petName: "Mochi",
    species: "Dog",
    service: "General Checkup & Allergy Consultation",
    time: "Today, 14:30",
    status: "Completed",
    variant: "success" as const,
  },
  {
    id: 2,
    ownerName: "David Sterling",
    petName: "Chao-Khun",
    species: "Cat",
    service: "Ear Cytology & Deep Cleaning",
    time: "Today, 11:15",
    status: "Completed",
    variant: "success" as const,
  },
  {
    id: 3,
    ownerName: "Sophia Martinez",
    petName: "Coco",
    species: "Dog",
    service: "Respiratory & Airway Evaluation",
    time: "Yesterday, 16:00",
    status: "Follow-up Set",
    variant: "info" as const,
  },
  {
    id: 4,
    ownerName: "Alexander Wright",
    petName: "Thor",
    species: "Dog",
    service: "Vaccination & Heartworm Screening",
    time: "Yesterday, 10:30",
    status: "Completed",
    variant: "success" as const,
  },
  {
    id: 5,
    ownerName: "Olivia Parker",
    petName: "Luna",
    species: "Cat",
    service: "Dental Scaling & Oral Hygiene",
    time: "2 days ago, 15:45",
    status: "Completed",
    variant: "success" as const,
  },
];

export function RecentVisits() {
  return (
    <AppCard className="flex flex-col xl:max-h-124">
      <AppCardHeader>
        <div className="flex items-center gap-2">
          <History className="size-4 text-primary" />
          <AppCardTitle>Recent Visits</AppCardTitle>
        </div>
        <AppCardDescription>Latest clinic visits & consultations</AppCardDescription>
        <AppCardAction>
          <Button size="icon-sm" variant="ghost" title="View all visits">
            <ExternalLink className="size-3.5" />
          </Button>
        </AppCardAction>
      </AppCardHeader>
      <AppCardContent className="flex min-h-0 flex-1 flex-col">
        <ItemGroup className="min-h-0 flex-1 overflow-y-auto">
          {recentVisits.map((visit) => (
            <Item key={visit.id} variant="outline" className="gap-2" size="xs">
              <ItemHeader>
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Clock className="size-3" />
                  <span>{visit.time}</span>
                </div>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  className="text-muted-foreground"
                  title="View encounter details"
                >
                  <ExternalLink className="size-3" />
                </Button>
              </ItemHeader>
              <ItemContent>
                <ItemTitle className="truncate text-foreground">
                  {visit.petName} ({visit.ownerName})
                </ItemTitle>
                <ItemDescription className="truncate text-xs text-muted-foreground">
                  {visit.service}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                {visit.variant === "success" ? (
                  <SuccessBadge>{visit.status}</SuccessBadge>
                ) : (
                  <InfoBadge>{visit.status}</InfoBadge>
                )}
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </AppCardContent>
    </AppCard>
  );
}
