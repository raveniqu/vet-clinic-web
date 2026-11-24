import { Dot, PawPrint } from "lucide-react";
import { useOwnerDetails } from "#/client/features/reception/owners/hooks/use-owner-details";
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from "#/client/shared/components/app-card";
import { AppButtonLink } from "#/client/shared/components/app-link";
import { AppSpeciesIcon } from "#/client/shared/components/app-species-icon";
import { Avatar, AvatarFallback, AvatarImage } from "#/client/shared/shadcn/components/ui/avatar";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "#/client/shared/shadcn/components/ui/item";

export function OwnerPetsOwned() {
  const { petsByOwner, speciesCodeById, handleOpenEmr } = useOwnerDetails();
  return (
    <AppCard className="mt-4">
      <AppCardHeader>
        <AppCardTitle>
          <PawPrint className="size-4 text-primary" />
          <span>สัตว์เลี้ยงในความดูแล</span>
        </AppCardTitle>
      </AppCardHeader>
      <AppCardContent>
        <ItemGroup>
          {petsByOwner.map((pet) => (
            <Item key={pet.id} variant="outline">
              <ItemMedia variant="image">
                <Avatar size="lg">
                  <AvatarImage src={pet.photo} />
                  <AvatarFallback>
                    <AppSpeciesIcon code={speciesCodeById.get(pet.speciesId)} />
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{pet.petName}</ItemTitle>
                <ItemDescription className="flex items-center text-xs">
                  {pet.speciesName}
                  <Dot />
                  {pet.breedName}
                  <Dot />
                  <span className="font-semibold text-primary">{pet.weight} กก.</span>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <AppButtonLink
                  size="xs"
                  variant="link"
                  to="/pets/$petId"
                  params={{ petId: String(pet.id) }}
                >
                  ดูข้อมูลสัตว์เลี้ยง
                </AppButtonLink>
                <Button size="xs" onClick={handleOpenEmr}>
                  เปิดเวชระเบียน (EMR)
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </AppCardContent>
    </AppCard>
  );
}
